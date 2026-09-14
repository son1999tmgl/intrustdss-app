# 06. SỔ TAY CÁC CÂU LỆNH HAY DÙNG (COMMANDS CHEATSHEET)

Tài liệu này tổng hợp toàn bộ các câu lệnh thực tế từ cơ bản đến nâng cao mà bạn sẽ sử dụng hàng ngày trong quá trình phát triển hệ thống Super App.

---

## 1. Lệnh Quản Lý Thư Viện (pnpm & Workspaces)

Monorepo của chúng ta quản lý nhiều app cùng lúc, vì vậy bạn dùng cờ `--filter <tên-package>` để tác động chính xác vào app bạn muốn.

| Mục đích | Câu lệnh | Giải thích chi tiết |
| :--- | :--- | :--- |
| **Cài đặt toàn bộ dự án** | `pnpm install` | Chạy ở thư mục gốc. Tự động tải và liên kết tất cả các app và package. |
| **Cài thêm thư viện cho 1 app** | `pnpm --filter host-app add <tên-thư-viện>` | Ví dụ: `pnpm --filter host-app add zustand` (Chỉ cài cho host-app, không làm rác app khác). |
| **Cài thư viện Dev (devDependencies)** | `pnpm --filter host-app add -D @types/lodash` | Dùng cờ `-D` cho các thư viện chỉ dùng lúc code/test. |
| **Gỡ một thư viện** | `pnpm --filter host-app remove <tên-thư-viện>` | Xóa sạch thư viện khỏi app được chỉ định. |
| **Liên kết package nội bộ** | `pnpm --filter host-app add @superapp/core-contracts@workspace:*` | Cho phép host-app dùng code từ gói core-contracts mà không cần publish lên npm. |
| **Dọn dẹp sạch sẽ toàn bộ** | `pnpm clean` | Xóa các thư mục build rác và cache để chuẩn bị build lại từ đầu. |

---

## 2. Lệnh Kiểm Tra Code & TypeScript (Code Quality)

Trước khi commit code hoặc chuyển giao cho người khác, luôn chạy các lệnh này để đảm bảo không có lỗi tiềm ẩn.

| Mục đích | Câu lệnh | Khi nào nên dùng? |
| :--- | :--- | :--- |
| **Kiểm tra lỗi Type toàn bộ hệ thống** | `pnpm typecheck` | Chạy tsc cho toàn bộ Host App, 5 Sub-app và các Core packages. |
| **Kiểm tra Type riêng 1 app** | `pnpm --filter host-app typecheck` | Khi bạn vừa sửa code trong Host App và muốn kiểm tra nhanh. |
| **Format code tự động toàn dự án** | `pnpm format` | Tự động canh lề, dấu chấm phẩy, nháy đơn/kép chuẩn Prettier cho mọi file. |

---

## 3. Lệnh Chạy Ứng Dụng Mobile (React Native)

| Mục đích | Câu lệnh | Mẹo thực chiến |
| :--- | :--- | :--- |
| **Khởi động Metro Bundler (Server code JS)** | `pnpm --filter host-app start` | Luôn bật cửa sổ này đầu tiên khi bắt đầu làm việc. |
| **Khởi động Metro và xóa sạch cache** | `pnpm --filter host-app start --reset-cache` | **Cực kỳ hay dùng!** Dùng khi vừa cài thêm thư viện mới hoặc sửa file cấu hình mà app không nhận. |
| **Cài và chạy app lên Android** | `pnpm --filter host-app android` | Tự động mở máy ảo Android (hoặc cắm máy thật) rồi cài app vào. |
| **Cài và chạy app lên iOS (Mac)** | `pnpm --filter host-app ios` | Tự động mở iPhone Simulator và build app. |

---

## 4. Lệnh Thao Tác Với Thiết Bị & Android Studio (ADB Tools)

Lệnh ADB giúp bạn điều khiển trực tiếp điện thoại/máy ảo Android từ terminal.

| Mục đích | Câu lệnh | Tình huống áp dụng |
| :--- | :--- | :--- |
| **Xem danh sách máy đang kết nối** | `adb devices` | Kiểm tra xem máy tính đã nhận điện thoại cắm dây cáp USB hay máy ảo chưa. |
| **Chuyển cổng mạng (Port Forwarding)** | `adb reverse tcp:8081 tcp:8081` | **Bắt buộc dùng khi cắm điện thoại thật bằng dây cáp:** Giúp điện thoại load được code từ máy tính. |
| **Xem log của ứng dụng** | `adb logcat` | Xem toàn bộ log hệ điều hành. |
| **Chỉ xem log của React Native** | `adb logcat *:S ReactNative:V ReactNativeJS:V` | Lọc bớt log rác, chỉ xem đúng các lệnh `console.log()` của bạn. |
| **Chụp ảnh màn hình điện thoại lưu vào máy** | `adb exec-out screencap -p > screen.png` | Rất tiện khi cần chụp lỗi gửi cho đồng đội. |

---

## 5. Phím Tắt Khi Đang Mở Ứng Dụng Trên Điện Thoại / Máy Ảo

Khi ứng dụng đang hiển thị trên màn hình:

* **Tải lại giao diện ngay lập tức (Reload):**
  * Trên máy ảo Android: Bấm phím **`R`** 2 lần liên tiếp (hoặc bấm `Ctrl + M` chọn *Reload*).
  * Trên máy ảo iOS: Bấm **`Cmd + R`**.
* **Mở Menu Cài Đặt Debug (In-App Dev Menu):**
  * Trên máy ảo Android: Bấm phím **`Ctrl + M`**.
  * Trên máy ảo iOS: Bấm phím **`Cmd + D`**.
  * Trên điện thoại thật (cầm trên tay): **Lắc mạnh điện thoại** sang hai bên.
* **Bật Chrome DevTools để soi biến và đặt Breakpoint:**
  * Nhìn vào cửa sổ Terminal đang chạy Metro Bundler $\rightarrow$ Gõ phím **`j`** $\rightarrow$ Trình duyệt sẽ tự bật DevTools lên cho bạn.
