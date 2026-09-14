# 00. NGUYÊN TẮC HỢP TÁC & PHƯƠNG PHÁP HỌC REACT NATIVE (BẮT BUỘC ÁP DỤNG)

Tài liệu này ghi nhớ nguyên tắc làm việc và phân công nhiệm vụ giữa **Bạn (Lập trình viên - nền tảng Angular, mới học React Native)** và **AI Assistant (Antigravity)**. Nguyên tắc này sẽ được **áp dụng xuyên suốt toàn bộ dự án từ nay về sau**.

---

## 1. Mục Tiêu Cốt Lõi
* Bạn không chỉ có một sản phẩm chạy được, mà bạn phải **thực sự hiểu, nắm vững và tự tay làm chủ được công nghệ React Native**.
* Tiết kiệm thời gian ở những khâu lặp lại, nhưng tập trung tối đa vào việc xây dựng "phản xạ lập trình" và "bộ nhớ cơ bắp" (muscle memory) cho bạn ở các phần kiến trúc then chốt.

---

## 2. Nguyên Tắc Phân Chia Công Việc

### A. Những phần AI sẽ làm tự động (Kèm giải thích để bạn đọc hiểu):
1. **Cấu hình hạ tầng & Boilerplate:**
   * Cấu hình Monorepo (`pnpm-workspace.yaml`, `tsconfig.base.json`, `.gitignore`).
   * Cấu hình build công cụ phức tạp (Webpack, Re.Pack, Gradle, Manifest).
   * Viết các `interface`, `contracts`, `types` chuẩn TypeScript (vì bạn đã vững TypeScript từ Angular, phần này bạn đọc là hiểu ngay).
2. **Setup khung sườn cơ bản:**
   * Cài đặt thư viện dependencies.
   * Tạo cấu trúc thư mục chuẩn.
   * Viết các đoạn mã dịch vụ Native bọc sẵn (Wrapper Services cho Camera, Haptics, Storage).

---

### B. Những phần BẮT BUỘC BẠN PHẢI TỰ TAY LÀM (AI chỉ hướng dẫn, giao bài tập):
1. **Chuyển đổi tư duy từ Angular sang React Component:**
   * Tự tay gõ Component React Native đầu tiên (`<View>`, `<Text>`, `<TouchableOpacity>`).
   * Tự tay chia giao diện bằng Flexbox (`flexDirection`, `justifyContent`, `alignItems`).
2. **Quản lý trạng thái (State & Hooks) - "Trái tim" của React:**
   * Tự tay viết và sử dụng `useState`, `useEffect`.
   * Tự tay viết một **Custom Hook** đầu tiên để cảm nhận sự khác biệt với `Injectable Service` của Angular.
3. **Điều hướng (Navigation) & Thao tác bấm:**
   * Tự tay viết code xử lý sự kiện `onPress` và chuyển màn hình.
4. **Viết màn hình Sub-app đầu tiên:**
   * Tự tay ghép giao diện và logic của màn hình quét mã Camera trong Sub-app Scanner.

---

## 3. Quy Trình Phối Hợp Mỗi Khi Có Phần Thực Hành Của Bạn

Mỗi khi đến phần cần bạn tự tay làm, AI sẽ:
1. **Dừng lại (Không sinh code hộ)**.
2. **Giải thích rõ tại sao:** Phần này tương đương với cái gì bên Angular? Tại sao trong React Native lại viết như vậy?
3. **Đưa ra mẫu / Gợi ý (Template & Hints):** Cho biết cấu trúc mong muốn và các thẻ cần dùng.
4. **Giao nhiệm vụ cụ thể:** Nêu rõ bạn cần mở file nào, viết đoạn code gì.
5. **Bạn viết xong $\rightarrow$ AI sẽ review, giải thích chi tiết các lỗi (nếu có) và hướng dẫn sửa chuẩn chỉ.**
