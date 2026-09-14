# 01. KIẾN TRÚC TỔNG THỂ & CÔNG NGHỆ (ARCHITECTURE & TECH STACK)

## 1. Sơ Đồ Kiến Trúc Hệ Thống (Super App / Micro-Apps)

Toàn bộ hệ sinh thái ứng dụng được thiết kế theo mô hình **Host Container + Dynamic Remotes (Module Federation)**:

```
                      ┌──────────────────────────────────────────────┐
                      │            CI/CD & STORAGE (CDN)             │
                      │   (Cloudflare R2 / AWS S3 / Private Server)  │
                      └──────┬──────────────┬──────────────┬─────────┘
                             │ Bundle 1     │ Bundle 2     │ Bundle 3..5
                             ▼              ▼              ▼
┌────────────────────────────────────────────────────────────────────┐
│                       SUPER APP CONTAINER (HOST)                   │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    CORE SERVICES & RUNTIME                   │  │
│  │  • Auth / SSO Provider           • Navigation Master Router  │  │
│  │  • Push / Local Notification     • Camera & Scanner Engine   │  │
│  │  • Haptic Feedback Manager       • High-speed MMKV Storage   │  │
│  └──────────────────────────────┬───────────────────────────────┘  │
│                                 │ Shared Interfaces / JSI Bus      │
│         ┌───────────────────────┼───────────────────────┐          │
│         ▼                       ▼                       ▼          │
│  ┌──────────────┐        ┌──────────────┐        ┌──────────────┐  │
│  │  SUB-APP 01  │        │  SUB-APP 02  │        │SUB-APP 03..05│  │
│  │  (Remote 1)  │        │  (Remote 2)  │        │ (Remotes)    │  │
│  └──────────────┘        └──────────────┘        └──────────────┘  │
└────────────────────────────────────────────────────────────────────┘
```

---

## 2. Danh Sách Công Nghệ Chuẩn (Tech Stack)

### A. Nền tảng cốt lõi
* **Framework:** `React Native` (phiên bản mới nhất với **Hermes JS Engine** kích hoạt mặc định để tối ưu tốc độ khởi động và bộ nhớ).
* **Ngôn ngữ:** `TypeScript` (Strict Mode: bật `strict: true` để đảm bảo an toàn kiểu dữ liệu giống Angular).
* **Module Federation (Micro-frontends):** `Re.Pack` (dựa trên Webpack 5) - Giải pháp tiêu chuẩn công nghiệp cho phép React Native nạp các JavaScript bundle từ xa qua mạng.

### B. Tầng can thiệp Native (Hardware & OS)
* **Camera & Quét mã:** `react-native-vision-camera`
  * Tích hợp **Frame Processors** để xử lý khung hình camera 60fps trực tiếp trên bộ nhớ C++.
  * Tích hợp bộ quét barcode/QR siêu tốc qua thư viện Vision/ML Kit (nhanh gấp nhiều lần so với quét trên Web).
* **Rung (Haptics):** `react-native-haptic-feedback`
  * Hỗ trợ các kiểu rung native tinh tế: Impact (Light, Medium, Heavy), Notification (Success, Warning, Error), Selection.
* **Thông báo (Notifications):**
  * Local Notifications (Thông báo tức thì & định lịch ngầm): `@notifee/react-native`
  * Push Notifications (Từ Cloud Server): `@react-native-firebase/messaging` (FCM trên Android & APNs trên iOS).
* **Lưu trữ cục bộ siêu tốc:** `react-native-mmkv` (thay thế cho `localStorage` của Web và `AsyncStorage` cũ; viết bằng C++ trực tiếp, nhanh hơn 30 lần).

### C. Tầng Logic & Dữ liệu
* **State Management (Quản lý trạng thái):** `zustand`
  * Rất nhẹ (dưới 2KB), cú pháp gọn gàng, không boilerplate rườm rà, có thể gọi bên trong hoặc bên ngoài component dễ dàng.
* **Quản lý API & Server Cache:** `@tanstack/react-query`
  * Tự động cache API, tự động retry khi mất mạng, quản lý trạng thái loading/error chuẩn mực tương đương giải pháp RxJS caching.
* **Giao tiếp HTTP:** `axios` (được bọc trong một `HttpService` với interceptor xử lý Refresh Token tập trung).

### D. Tầng Giao diện & Điều hướng
* **Điều hướng (Routing):** `@react-navigation/native` (hỗ trợ Deep Linking chuẩn URL scheme như `superapp://app1/detail/123`).
* **Styling (CSS):** `nativewind` (mang chuẩn Tailwind CSS lên React Native) kết hợp với `StyleSheet` khi cần tính toán style động phức tạp.

---

## 3. Cơ Chế Cập Nhật Từ Xa (Over-The-Air - OTA)

### Cách thức hoạt động:
1. **Lần đầu cài app:** File nộp lên App Store / Google Play chứa mã nguồn của **Host App** và phiên bản ban đầu của các Sub-app (được nhúng sẵn bên trong để user mở app lên là dùng được ngay cả khi không có mạng).
2. **Khi một Sub-app cập nhật:**
   * CI/CD của Sub-app đó build ra file `sub_app_x.bundle` (kèm assets ảnh/icon).
   * File bundle được upload lên máy chủ lưu trữ (CDN / S3 / Cloudflare).
   * Host App kiểm tra phiên bản mới qua một API `GET /api/v1/apps/version`.
   * Nếu có bản mới, Host App tải ngầm bundle về cache trên máy.
   * Lần tiếp theo người dùng mở Sub-app đó, giao diện và logic mới lập tức được kích hoạt mà **không cần thông qua kiểm duyệt App Store**.

### Quy tắc an toàn (App Store Review Guideline 2.5.2):
* Chỉ cập nhật mã nguồn JavaScript, hình ảnh, tài nguyên giao diện và logic nghiệp vụ.
* Không được bổ sung các tính năng Native mới hoàn toàn làm thay đổi bản chất đăng ký ban đầu của ứng dụng (nếu thêm module Native mới thì mới cần nộp lại bản build lên Store).
