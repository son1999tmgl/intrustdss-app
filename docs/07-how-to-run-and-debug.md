# 07. HƯỚNG DẪN CHI TIẾT CÁCH CHẠY & DEBUG ỨNG DỤNG (HOW TO RUN)

Tài liệu này hướng dẫn chi tiết từng bước để chạy ứng dụng Super App lên điện thoại thật hoặc máy ảo Android.

---

## 1. Cơ Chế Chạy Của React Native

Khi chạy React Native, luôn có **2 thành phần** hoạt động song song:
1. **Metro Bundler (Máy chủ nạp code JavaScript/TypeScript):** Chạy trên máy tính tại cổng `8081`, chịu trách nhiệm biên dịch code tức thì và đẩy xuống điện thoại qua mạng/dây cáp.
2. **Ứng dụng Native Container trên điện thoại:** Nhận bundle từ Metro và vẽ giao diện lên màn hình.

---

## 2. CÁCH 1: Chạy Trên Điện Thoại Thật (Khuyên Dùng Nhất ⭐)

Chạy trên máy thật giúp bạn test được mượt mà nhất: **Camera quét mã thật**, **Rung đa tầng (Haptics) thật**, và không làm ngốn RAM máy tính.

### Bước 1: Bật "Gỡ lỗi USB" (USB Debugging) trên điện thoại
1. Mở **Cài đặt (Settings)** trên điện thoại Android.
2. Vào **Giới thiệu điện thoại (About phone)** $\rightarrow$ **Thông tin phần mềm**.
3. Tìm dòng **Số hiệu bản dựng (Build number)** và **chạm liên tục 7 lần** vào đó cho đến khi máy báo: *"Bạn đã là nhà phát triển"*.
4. Quay lại Cài đặt $\rightarrow$ Mở mục **Tùy chọn nhà phát triển (Developer Options)** $\rightarrow$ Bật công tắc **Gỡ lỗi USB (USB Debugging)** lên.

### Bước 2: Cắm cáp USB nối điện thoại với máy tính
1. Cắm cáp USB, trên màn hình điện thoại sẽ hiện thông báo: *"Cho phép gỡ lỗi USB từ máy tính này?"* $\rightarrow$ Tích chọn **Luôn cho phép** và bấm **OK**.
2. Mở Terminal trên máy tính, gõ lệnh kiểm tra:
   ```bash
   adb devices
   ```
   *Nếu hiển thị một mã thiết bị kèm chữ `device` (ví dụ: `RF8N1234567 device`) là máy tính đã nhận điện thoại thành công.*

### Bước 3: Chuyển tiếp cổng kết nối (Port Forwarding)
Gõ lệnh này để điện thoại có thể đọc được code từ máy tính qua dây cáp:
```bash
adb reverse tcp:8081 tcp:8081
```

### Bước 4: Khởi động ứng dụng
Mở 2 cửa sổ Terminal tại thư mục `d:\Source\mobile app`:

* **Cửa sổ 1 (Bật máy chủ cấp code Metro):**
  ```bash
  pnpm --filter host-app start
  ```
* **Cửa sổ 2 (Cài app vào điện thoại):**
  ```bash
  pnpm --filter host-app android
  ```

---

## 3. CÁCH 2: Chạy Trên Máy Ảo Android (Android Emulator)

Nếu bạn không có sẵn điện thoại Android hoặc dây cáp:

### Bước 1: Bật máy ảo trong Android Studio
1. Mở **Android Studio** trên máy tính của bạn.
2. Nhìn góc trên bên phải, bấm vào biểu tượng điện thoại: **Device Manager**.
3. Nếu chưa có máy ảo, bấm **Create Device** (chọn Pixel 7 / Android 14).
4. Bấm nút **Play (▶)** màu xanh để khởi động máy ảo lên màn hình.

### Bước 2: Chạy ứng dụng
Mở Terminal gõ:
```bash
# Bật server cấp code
pnpm --filter host-app start
```
*Sau đó bấm phím **`a`** ngay trong terminal để tự động cài và mở app trên máy ảo Android.*

---

## 4. Các Thao Tác Thường Dùng Khi Đang Chạy App

* **Tải lại giao diện ngay lập tức (Reload):**
  * Trên máy ảo: Bấm phím **`R`** 2 lần liên tiếp.
  * Trên điện thoại thật: **Lắc mạnh điện thoại** sang hai bên $\rightarrow$ Chọn **Reload**.
* **Mở menu Debug & Soi giao diện:**
  * Bấm phím `Ctrl + M` (trên máy ảo) hoặc lắc điện thoại thật.
* **Bật Chrome DevTools để debug xem log/biến:**
  * Nhìn vào cửa sổ Terminal đang chạy Metro $\rightarrow$ Gõ phím **`j`** $\rightarrow$ Trình duyệt Chrome sẽ tự bật DevTools lên.

---

## 5. Xử Lý Các Lỗi Thường Gặp (Troubleshooting)

| Lỗi gặp phải | Nguyên nhân | Cách xử lý tức thì |
| :--- | :--- | :--- |
| **Màn hình đỏ báo "Unable to load script"** | Điện thoại không kết nối được vào cổng 8081 của máy tính. | Chạy lệnh: `adb reverse tcp:8081 tcp:8081` rồi lắc máy bấm Reload. |
| **Cổng 8081 bị chiếm (Port already in use)** | Có một tiến trình Node.js cũ chưa tắt hẳn. | Chạy: `pnpm --filter host-app start --port 8082` hoặc tắt hết terminal cũ. |
| **Sửa code hoặc cài thư viện mới mà app không nhận** | Bộ nhớ cache của Metro còn lưu bản cũ. | Chạy lệnh xóa sạch cache: `pnpm --filter host-app start --reset-cache` |
| **`adb devices` không thấy máy** | Dây cáp chỉ hỗ trợ sạc hoặc chưa bật USB Debugging. | Đổi cổng cắm USB, đổi dây cáp dữ liệu và kiểm tra lại công tắc USB Debugging. |
