# 04. QUY TẮC CODE CHO LẬP TRÌNH VIÊN ANGULAR (CODING CONVENTIONS)

Tài liệu này được thiết kế riêng để giúp các lập trình viên có nền tảng **Angular** chuyển đổi tư duy sang **React Native (TypeScript)** một cách dễ dàng nhất mà vẫn giữ được kiến trúc hướng đối tượng sạch sẽ.

---

## 1. Bảng Đối Chiếu Khái Niệm (Angular $\rightarrow$ React Native)

| Khái niệm trong Angular | Tương đương trong React Native | Ghi chú & Lời khuyên |
| :--- | :--- | :--- |
| `@Component({ template, ts })` | **Function Component (`.tsx`)** | Giao diện và logic hiển thị gộp chung trong 1 file JSX/TSX. |
| `@Injectable() class Service` | **Class Service** hoặc **Custom Hook** | Có thể dùng Class y hệt Angular cho tầng Service gọi API/xử lý logic. |
| `ngOnInit()` | `useEffect(() => { ... }, [])` | Chạy 1 lần duy nhất khi component vừa hiển thị. |
| `ngOnDestroy()` | `useEffect(() => { return () => { ... } }, [])` | Hàm `return` bên trong `useEffect` sẽ chạy khi thoát màn hình. |
| `@Input()` | `props` | Truyền dữ liệu từ component cha xuống component con. |
| `@Output() EventEmitter` | `callback props` | Cha truyền cho con hàm `onSave={handleSave}`. Con gọi hàm đó để báo lên. |
| `RxJS BehaviorSubject` | **Zustand Store** | Quản lý state toàn cục, thay đổi dữ liệu là UI tự động render lại. |
| `*ngIf` / `*ngFor` | Toán tử điều kiện `{isOpen && <View/>}` / `.map()` | Dùng JavaScript thuần để render danh sách và ẩn hiện component. |
| `pipes` (ví dụ: `currency`) | Hàm **Utility / Formatter** thuần | Ví dụ: `formatVND(item.price)`. |

---

## 2. Nơi Viết Logic Phức Tạp: Kiến Trúc 4 Tầng Chuẩn (Clean Architecture)

Mỗi tính năng trong Sub-app được tổ chức thành 4 tầng riêng biệt:

```
[ MÀN HÌNH UI (Screen) ] ── (Gọi) ──> [ CUSTOM HOOK ]
                                           │
                                           ├── (Gọi) ──> [ SERVICE (Class / OOP) ] ──> API / DB
                                           │
                                           └── (Lưu) ──> [ ZUSTAND STORE (State) ]
```

### Chi tiết từng tầng:

#### Tầng 1: Data Model (`models/order.model.ts`)
Viết `interface` hoặc `type` chặt chẽ, không dùng `any`:
```typescript
export interface OrderItem {
  id: string;
  sku: string;
  price: number;
  quantity: number;
}
```

#### Tầng 2: Service Layer (`services/order.service.ts`) - *Dành cho Logic Nặng & Gọi API*
**Viết bằng Class và OOP giống hệt Angular:**
```typescript
import { apiClient } from '@superapp/core-services';
import { OrderItem } from '../models/order.model';

export class OrderService {
  /**
   * Tính toán tổng tiền đã trừ chiết khấu và thuế (Logic phức tạp)
   */
  calculateTotal(items: OrderItem[], discountRate: number): number {
    const rawTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const afterDiscount = rawTotal * (1 - discountRate);
    const tax = afterDiscount * 0.1; // 10% VAT
    return Math.round(afterDiscount + tax);
  }

  /**
   * Gọi API tạo đơn hàng
   */
  async submitOrder(items: OrderItem[], total: number): Promise<boolean> {
    const response = await apiClient.post('/orders', { items, total });
    return response.data.success;
  }
}

// Khởi tạo Singleton tương tự @Injectable({ providedIn: 'root' })
export const orderService = new OrderService();
```

#### Tầng 3: Custom Hook (`hooks/useOrderCheckout.ts`) - *Cầu nối giữa Logic và UI*
Quản lý trạng thái loading, lỗi và gọi Service:
```typescript
import { useState } from 'react';
import { orderService } from '../services/order.service';
import { OrderItem } from '../models/order.model';

export function useOrderCheckout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkout = async (items: OrderItem[], discount: number) => {
    try {
      setLoading(true);
      setError(null);

      const total = orderService.calculateTotal(items, discount);
      const isSuccess = await orderService.submitOrder(items, total);

      return isSuccess;
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi tạo đơn');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { checkout, loading, error };
}
```

#### Tầng 4: Giao diện (`screens/CheckoutScreen.tsx`) - *Rất sạch sẽ, không dính logic tính toán*
```tsx
import React from 'react';
import { View, Text, Button, ActivityIndicator } from 'react-native';
import { useOrderCheckout } from '../hooks/useOrderCheckout';

export function CheckoutScreen({ items }: { items: any[] }) {
  const { checkout, loading, error } = useOrderCheckout();

  return (
    <View style={{ padding: 16 }}>
      {loading && <ActivityIndicator size="large" color="#0066cc" />}
      {error && <Text style={{ color: 'red' }}>{error}</Text>}

      <Button
        title="Xác Nhận Đặt Hàng"
        onPress={() => checkout(items, 0.1)}
        disabled={loading}
      />
    </View>
  );
}
```

---

## 3. Các Quy Tắc Code Bắt Buộc (Code Guidelines)

1. **TypeScript Tuyệt Đối:** Bật `noImplicitAny: true`. Mọi tham số và hàm bắt buộc phải có kiểu trả về rõ ràng.
2. **Quy tắc đặt tên:**
   * Component & Screen: PascalCase (`ScannerScreen.tsx`, `PrimaryButton.tsx`).
   * Service & Class: PascalCase (`OrderService.ts`).
   * Hook: camelCase bắt đầu bằng `use` (`useCameraScanner.ts`).
   * Utility & Helpers: camelCase (`formatCurrency.ts`).
3. **Độ dài file UI:** File Component/Screen không nên vượt quá **150 dòng code**. Nếu quá dài, hãy tách logic ra Custom Hook hoặc tách nhỏ các Component con.
4. **Quản lý bộ nhớ:** Luôn giải phóng tài nguyên, remove Event Listener hoặc huỷ subscription trong hàm dọn dẹp của `useEffect`:
   ```typescript
   useEffect(() => {
     const sub = eventBus.on('SOME_EVENT', handler);
     return () => sub.remove(); // BẮT BUỘC PHẢI DỌN DẸP
   }, []);
   ```
