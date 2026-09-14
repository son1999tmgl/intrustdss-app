# 02. CẤU TRÚC THƯ MỤC & QUẢN LÝ MÃ NGUỒN (PROJECT STRUCTURE)

Dự án áp dụng mô hình **Monorepo (quản lý bằng pnpm workspaces hoặc Turborepo)**. Cấu trúc này vừa đảm bảo tính cô lập tuyệt đối giữa các team, vừa cho phép chia sẻ các kiểu dữ liệu (Types/Contracts) và thư viện dùng chung một cách chuẩn mực.

---

## 1. Sơ Đồ Cây Thư Mục

```
super-app/
├── package.json                   # Khai báo workspaces, scripts tổng
├── pnpm-workspace.yaml            # Định nghĩa các package trong monorepo
├── tsconfig.base.json             # Cấu hình TypeScript chuẩn dùng chung
│
├── apps/
│   └── host-app/                  # APP CHÍNH (SHELL CONTAINER)
│       ├── android/               # Dự án Native Android (mở bằng Android Studio)
│       ├── ios/                   # Dự án Native iOS (mở bằng Xcode)
│       ├── src/
│       │   ├── navigation/        # Root Navigator, Deep Link handler
│       │   ├── remotes/           # Bộ nạp Module Federation cho các Sub-app
│       │   └── screens/           # Màn hình Splash, Login/SSO, Home Dashboard
│       ├── webpack.config.mjs     # Cấu hình Re.Pack Host
│       └── package.json
│
├── sub-apps/                      # 5 PHẦN MỀM CON ĐỘC LẬP
│   ├── sub-app-scanner/           # Phần mềm con 01 (Ví dụ: Quét mã / Kho)
│   │   ├── src/                   # Code nghiệp vụ chính của Sub-app 1
│   │   │   ├── screens/
│   │   │   ├── services/
│   │   │   ├── hooks/
│   │   │   └── index.ts           # Entry point xuất khẩu ra cho Host nạp
│   │   ├── standalone/            # RUNNER ĐỘC LẬP (Xem mục 2 bên dưới)
│   │   ├── rspack.config.mjs      # Cấu hình build bundle Re.Pack Remote
│   │   └── package.json
│   │
│   ├── sub-app-orders/            # Phần mềm con 02
│   ├── sub-app-chat/              # Phần mềm con 03
│   ├── sub-app-reports/           # Phần mềm con 04
│   └── sub-app-profile/           # Phần mềm con 05
│
└── packages/                      # CÁC PACKAGE DÙNG CHUNG (SHARED CORE)
    ├── core-contracts/            # NƠI ĐỊNH NGHĨA "HỢP ĐỒNG" (Xem doc 03)
    │   ├── src/
    │   │   ├── user.contract.ts   # Kiểu dữ liệu thông tin User
    │   │   ├── events.contract.ts # Định nghĩa các sự kiện Event Bus
    │   │   └── routes.contract.ts # Danh sách route chuẩn của toàn app
    │   └── package.json
    │
    ├── core-services/             # DỊCH VỤ NATIVE DÙNG CHUNG
    │   ├── src/
    │   │   ├── camera.service.ts  # Bọc Vision Camera
    │   │   ├── haptic.service.ts  # Bọc Rung
    │   │   ├── noti.service.ts    # Bọc Thông báo
    │   │   └── storage.service.ts # Bọc MMKV
    │   └── package.json
    │
    └── core-ui/                   # DESIGN SYSTEM DÙNG CHUNG
        ├── src/
        │   ├── components/        # Button, Input, Modal, Header chung
        │   └── theme/             # Bảng màu, typography, khoảng cách
        └── package.json
```

---

## 2. Bí Quyết Để 5 Team Không Giẫm Chân Nhau: "Standalone Runner"

Trong mỗi thư mục của Sub-app (ví dụ `sub-apps/sub-app-scanner/`), luôn có một thư mục con tên là `standalone/`:

### Vai trò của Standalone Runner:
* Nó là một ứng dụng mini giả lập (mock harness).
* Chứa một file cấu hình giả lập tài khoản người dùng đã đăng nhập sẵn (Mock User Token).
* Cung cấp sẵn các Mock Native Service nếu cần chạy nhanh trên máy ảo web hoặc máy ảo Android/iOS.

### Quy trình làm việc hàng ngày của lập trình viên Sub-app:
1. Lập trình viên của Team 1 mở thư mục `sub-apps/sub-app-scanner/`.
2. Chạy lệnh:
   ```bash
   pnpm --filter sub-app-scanner start:standalone
   ```
3. Ứng dụng chỉ chạy duy nhất phần mềm con số 1 trên điện thoại/máy ảo.
4. **Lợi ích tuyệt đối:**
   * Không cần nạp mã nguồn của 4 app còn lại.
   * Nếu App 2 hoặc App 3 đang bị lỗi code, Team 1 hoàn toàn không bị ảnh hưởng.
   * Tốc độ build và Hot Reload siêu nhanh vì dung lượng dự án cực nhỏ.

---

## 3. THỐNG NHẤT QUY CHUẨN TỔ CHỨC: MÔ HÌNH 1 (MONOREPO CÓ PHÂN QUYỀN & CI/CD OTA ĐỘC LẬP)

Dự án đã **thống nhất 100% áp dụng Mô hình 1**: Tất cả mã nguồn quản lý tập trung trong 1 Monorepo duy nhất để tối ưu tốc độ dev và kiểm soát chất lượng, đồng thời áp dụng 2 cơ chế phân lập:

### A. Phân quyền chặt chẽ bằng file `.github/CODEOWNERS`
* Ngăn chặn việc team này sửa nhầm code của team kia. Git sẽ tự động khóa (block) và bắt buộc phải có review từ đúng team phụ trách:
  * `apps/host-app/` & `packages/*` $\rightarrow$ Chỉ **Core Lead / Architect** được duyệt.
  * `sub-apps/sub-app-scanner/` $\rightarrow$ Chỉ **Team 1** được duyệt và merge.
  * `sub-apps/sub-app-orders/` $\rightarrow$ Chỉ **Team 2** được duyệt và merge.
  * `sub-apps/sub-app-chat/` $\rightarrow$ Chỉ **Team 3** được duyệt và merge.
  * `sub-apps/sub-app-reports/` $\rightarrow$ Chỉ **Team 4** được duyệt và merge.
  * `sub-apps/sub-app-profile/` $\rightarrow$ Chỉ **Team 5** được duyệt và merge.

### B. Cơ chế CI/CD độc lập (Path-based Trigger) & Cập nhật từ xa (OTA)
* **Quy tắc phát hành:**
  1. Khi Team 1 merge code vào `sub-apps/sub-app-scanner/**`, hệ thống CI/CD **chỉ kích hoạt build duy nhất Sub-App 1**:
     ```bash
     pnpm --filter sub-app-scanner build
     ```
  2. Kết quả xuất ra file `scanner.bundle` và được đẩy thẳng lên **máy chủ CDN (Cloudflare R2 / S3)**.
  3. Ứng dụng trên máy người dùng tự động kéo file bundle mới về cập nhật trong **2 giây**.
  4. **HOÀN TOÀN KHÔNG PHẢI NỘP LÊN APP STORE / GOOGLE PLAY DUYỆT**.
* **Khi nào mới phải nộp App Store duyệt?**
  * Chỉ duy nhất khi Core Team thay đổi mã máy Native (`apps/host-app/android` hoặc `apps/host-app/ios`). Còn 99% các tính năng, giao diện, sửa lỗi của 5 team con đều phát hành tức thì qua mạng (OTA).

