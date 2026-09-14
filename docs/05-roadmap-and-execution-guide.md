# 05. LỘ TRÌNH PHÁT TRIỂN & HƯỚNG DẪN THỰC THI (ROADMAP & EXECUTION)

Tài liệu này cung cấp hướng dẫn từng bước từ cài đặt môi trường máy tính đến quy trình phát triển 5 giai đoạn để hiện thực hóa Super App.

---

## 1. Yêu Cầu Môi Trường Cài Đặt (Prerequisites)

Trước khi bắt đầu, máy tính phát triển cần cài đặt các công cụ sau:

1. **Node.js:** Phiên bản LTS (Khuyến nghị **v20.x** hoặc **v22.x**).
2. **Package Manager:** Cài đặt `pnpm` (nhanh và tiết kiệm ổ cứng nhất cho Monorepo):
   ```bash
   npm install -g pnpm
   ```
3. **Môi trường Android:**
   * Cài đặt **Android Studio** (bản mới nhất).
   * Cài đặt **JDK 17** (Java Development Kit).
   * Trong Android Studio SDK Manager, cài:
     * Android SDK Platform 34 (hoặc 35).
     * Android SDK Build-Tools.
     * Android Emulator (Máy ảo Android) với Google Play Intel x86/ARM64.
   * Cấu hình biến môi trường: `ANDROID_HOME` trỏ vào thư mục Android SDK.
4. **Môi trường iOS (Nếu có máy Mac):**
   * Xcode 15+ & CocoaPods (`sudo gem install cocoapods`).
5. **Công cụ lập trình (IDE):**
   * **VS Code** với các tiện ích khuyến nghị:
     * *ESLint* & *Prettier* (Format code chuẩn).
     * *Tailwind CSS IntelliSense* (Gợi ý class styling).
     * *React Native Tools*.

---

## 2. Lộ Trình Triển Khai 5 Giai Đoạn (Implementation Roadmap)

```
[ Giai đoạn 1 ]  ──>  [ Giai đoạn 2 ]  ──>  [ Giai đoạn 3 ]  ──>  [ Giai đoạn 4 ]  ──>  [ Giai đoạn 5 ]
 Khởi tạo              Xây dựng Core         Tạo Sub-App 01        Tích hợp              Hạ tầng CI/CD
 Monorepo & Shell      & Native Services     & Runner Độc Lập      5 Sub-Apps            & Cập nhật OTA
```

### 🔹 Giai đoạn 1: Khởi tạo Khung Dự Án (Monorepo & Host Shell)
* **Mục tiêu:** Tạo khung sườn dự án, đảm bảo máy ảo Android chạy lên được ứng dụng trắng.
* **Các bước:**
  1. Khởi tạo Monorepo bằng `pnpm workspaces`.
  2. Tạo ứng dụng `apps/host-app` bằng React Native (Hermes + TypeScript).
  3. Cài đặt và cấu hình **Re.Pack** (Webpack 5) để biến Host App thành container nạp Module Federation.

### 🔹 Giai đoạn 2: Xây dựng Bộ Lõi Dùng Chung (Core Packages & Native)
* **Mục tiêu:** Hoàn thiện các dịch vụ Native và bộ hợp đồng (Contracts) để các team có thể dùng ngay.
* **Các bước:**
  1. Xây dựng `@superapp/core-contracts`: Định nghĩa types của User, Auth token, danh sách URL routes.
  2. Cài đặt và bọc các thư viện Native trong `apps/host-app` & `@superapp/core-services`:
     * `react-native-vision-camera` (Camera & Quét mã).
     * `react-native-haptic-feedback` (Rung).
     * `@notifee/react-native` (Thông báo Local).
     * `react-native-mmkv` (Lưu trữ).
  3. Xây dựng Event Bus dùng chung (`EventEmitter`).

### 🔹 Giai đoạn 3: Chuẩn Hóa Sub-App & Thử Nghiệm "Standalone Runner"
* **Mục tiêu:** Tạo khuôn mẫu (Template) cho một phần mềm con, chứng minh khả năng chạy độc lập.
* **Các bước:**
  1. Tạo `sub-apps/sub-app-scanner` với tính năng quét mã vạch bằng Camera.
  2. Cấu hình thư mục `standalone/` để team lập trình có thể gõ lệnh:
     ```bash
     pnpm --filter sub-app-scanner start:standalone
     ```
  3. Kiểm tra: Test thử bật camera, quét mã, rung máy trực tiếp trên Runner mà không cần mở Host App.

### 🔹 Giai đoạn 4: Ghép Nối Động (Module Federation & Routing)
* **Mục tiêu:** Host App tải và hiển thị Sub-app từ xa.
* **Các bước:**
  1. Cấu hình Re.Pack để đóng gói Sub-app thành file `.bundle`.
  2. Host App sử dụng Dynamic Import (`React.lazy` / `Federated.importModule`) để mở Sub-app Scanner.
  3. Nhân bản cấu trúc cho các Sub-app tiếp theo (App 2, 3, 4, 5).
  4. Kiểm tra điều hướng liên ứng dụng qua URL Deep Link.

### 🔹 Giai đoạn 5: Tự Động Hóa CI/CD & Cập Nhật Từ Xa (OTA)
* **Mục tiêu:** Từng team có thể đẩy code mới lên máy chủ mà không cần duyệt App Store.
* **Các bước:**
  1. Thiết lập máy chủ lưu trữ Bundle (Cloudflare R2 / AWS S3 hoặc Nginx riêng).
  2. Viết GitHub Actions / GitLab CI cho từng Sub-app: Khi merge code vào nhánh của team đó, CI tự động build bundle và upload lên server.
  3. Viết cơ chế kiểm tra phiên bản ngầm trong Host App.

---

## 3. Bảng Lệnh Thao Tác Nhanh (Cheatsheet)

| Nhu cầu thao tác | Câu lệnh thực thi |
| :--- | :--- |
| **Cài đặt toàn bộ dependencies** | `pnpm install` |
| **Chạy Host App trên máy ảo Android** | `pnpm --filter host-app android` |
| **Chạy Host App trên máy ảo iOS** | `pnpm --filter host-app ios` |
| **Chạy riêng Sub-app 1 độc lập** | `pnpm --filter sub-app-scanner start:standalone` |
| **Build bundle của Sub-app 1** | `pnpm --filter sub-app-scanner build` |
| **Kiểm tra lỗi kiểu dữ liệu TypeScript** | `pnpm -r typecheck` |
| **Format code toàn bộ dự án** | `pnpm -r format` |
