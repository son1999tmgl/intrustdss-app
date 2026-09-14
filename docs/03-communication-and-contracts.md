# 03. GIAO TIẾP & HỢP ĐỒNG (COMMUNICATION & CONTRACTS)

Trong kiến trúc Super App / Micro-Apps, sự cố vỡ hệ thống thường xảy ra nhất khi các team tự ý gọi trực tiếp code của nhau. Tài liệu này quy định các nguyên tắc vàng và phương thức giao tiếp chuẩn.

---

## 1. QUY TẮC VÀNG (THE GOLDEN RULE)

> ⛔ **NGHIÊM CẤM:** Không một Sub-app nào được phép `import` trực tiếp code từ một Sub-app khác!
>
> ❌ **Sai:**  
> `import { OrderItem } from '../../sub-app-orders/src/models';`
>
>  **Đúng:**  
> Các Sub-app chỉ được phép:
> 1. Import từ package dùng chung: `@superapp/core-contracts`, `@superapp/core-services`, `@superapp/core-ui`.
> 2. Giao tiếp với nhau thông qua **Deep Linking (URL)** hoặc **Event Bus**.

---

## 2. Các Kênh Giao Tiếp Trong Hệ Thống

```
┌─────────────────────────────────────────────────────────────┐
│                       HOST CONTAINER                        │
│                                                             │
│    ┌──────────────────┐               ┌────────────────┐    │
│    │ MASTER ROUTER    │               │ CORE EVENT BUS │    │
│    │ (Deep Link URL)  │               │ (Publish / Sub)│    │
│    └────────▲─────────┘               └───────▲────────┘    │
└─────────────┼─────────────────────────────────┼─────────────┘
              │                                 │
     navigate('superapp://orders/12')           │ emit('CART_UPDATED')
              │                                 │
     ┌────────┴─────────┐              ┌────────┴─────────┐
     │  SUB-APP SCANNER │              │  SUB-APP ORDERS  │
     └──────────────────┘              └──────────────────┘
```

---

## 3. Chi Tiết Các Cơ Chế Giao Tiếp

### A. Chuyển trang giữa các App bằng Deep Linking (URL Scheme)
Mỗi màn hình trong các Sub-app phải được đăng ký một URL chuẩn trong `@superapp/core-contracts`:

```typescript
// packages/core-contracts/src/routes.contract.ts
export const APP_ROUTES = {
  SCANNER: {
    ROOT: 'superapp://scanner',
    SCAN_QR: 'superapp://scanner/camera',
  },
  ORDERS: {
    ROOT: 'superapp://orders',
    DETAIL: (id: string) => `superapp://orders/detail/${id}`,
  }
} as const;
```

Khi Sub-app Scanner muốn mở màn hình chi tiết đơn hàng của Sub-app Orders:
```typescript
// Trong Sub-app Scanner:
import { APP_ROUTES } from '@superapp/core-contracts';
import { useNavigationService } from '@superapp/core-services';

export function ScanResultScreen({ orderId }: { orderId: string }) {
  const nav = useNavigationService();

  const goToOrder = () => {
    // Điều hướng bằng URL. Host App sẽ tự động tải Sub-app Orders nếu chưa có
    nav.openUrl(APP_ROUTES.ORDERS.DETAIL(orderId));
  };

  return <Button title="Xem Đơn Hàng" onPress={goToOrder} />;
}
```

---

### B. Bắn sự kiện bất đồng bộ qua Event Bus (Pub / Sub)
Khi một hành động ở App A cần thông báo cho App B (ví dụ: quét mã kho thành công cần cập nhật số lượng ở app đơn hàng):

```typescript
// 1. Định nghĩa sự kiện trong packages/core-contracts/src/events.contract.ts
export interface AppEventMap {
  'INVENTORY_ITEM_SCANNED': { sku: string; quantity: number; scannedAt: number };
  'AUTH_LOGOUT': { reason: string };
}
```

```typescript
// 2. Sub-app Scanner BẮN SỰ KIỆN (Publish)
import { eventBus } from '@superapp/core-services';

eventBus.emit('INVENTORY_ITEM_SCANNED', {
  sku: 'SP-999',
  quantity: 1,
  scannedAt: Date.now(),
});
```

```typescript
// 3. Sub-app Orders LẮNG NGHE SỰ KIỆN (Subscribe)
import { useEffect } from 'react';
import { eventBus } from '@superapp/core-services';

export function OrdersDashboard() {
  useEffect(() => {
    const unsubscribe = eventBus.on('INVENTORY_ITEM_SCANNED', (data) => {
      console.log('Phát hiện có mặt hàng vừa quét:', data.sku);
      // Tự động reload danh sách...
    });

    return () => unsubscribe(); // Hủy đăng ký khi rời màn hình
  }, []);
}
```

---

### C. Sử dụng Dịch Vụ Native (Camera, Rung, Thông Báo)

Các Sub-app không tự cài đặt thư viện Native riêng lẻ mà sử dụng Service chuẩn hóa do Core cung cấp thông qua Interface:

```typescript
import { hapticService, notificationService } from '@superapp/core-services';

async function handleScanSuccess(code: string) {
  // 1. Kích hoạt rung máy Native loại Success
  hapticService.notification('success');

  // 2. Bắn thông báo Local tức thì
  await notificationService.displayLocal({
    title: 'Quét thành công',
    body: `Mã sản phẩm: ${code}`,
  });
}
```
