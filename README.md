# SUPER APP - TÀI LIỆU KIẾN TRÚC & HƯỚNG DẪN DỰ ÁN

Hệ thống ứng dụng Super App đa nền tảng (iOS & Android) xây dựng trên nền tảng **React Native (TypeScript)** với kiến trúc **Micro-Apps (Module Federation / Micro-Frontends)**, cho phép phát triển và phát hành song song 5 (hoặc nhiều hơn) phần mềm con độc lập mà không làm ảnh hưởng đến nhau.

---

## 📚 Mục Lục Tài Liệu Kỹ Thuật

Tài liệu được chia nhỏ thành các module trong thư mục `docs/` để dễ mở rộng và duy trì:

| STT | Tài liệu | Mô tả chi tiết |
| :---: | :--- | :--- |
| **00** | [Nguyên Tắc Hợp Tác & Học Tập](docs/00-collaboration-and-learning-rules.md) | **Quy tắc bất biến:** Phân định rõ phần AI làm hộ (cấu hình, boilerplate) và phần bạn bắt buộc phải tự tay code để làm chủ React Native. |
| **01** | [Kiến Trúc Tổng Thể & Công Nghệ](docs/01-architecture-and-tech-stack.md) | Mô hình Super App, Host Shell, Sub-apps, công nghệ Native (Camera, Rung, Thông báo), cơ chế cập nhật từ xa (OTA). |
| **02** | [Cấu Trúc Thư Mục & Quản Lý Mã Nguồn](docs/02-project-structure-monorepo.md) | Cấu trúc Monorepo (Workspaces), phân chia Core Shell, Shared Packages và cơ chế Standalone Runner cho từng app con. |
| **03** | [Giao Tiếp & Hợp Đồng (Contracts)](docs/03-communication-and-contracts.md) | Quy tắc "Contract-First", cơ chế Deep Link, Event Bus, Shared Native Services, nguyên tắc cấm import chéo. |
| **04** | [Quy Tắc Code Cho Lập Trình Viên Angular](docs/04-coding-conventions-for-angular-devs.md) | Chuyển đổi tư duy từ Angular sang React Native: OOP/Service sang Custom Hooks, Zustand State, cách viết logic phức tạp. |
| **05** | [Lộ Trình & Hướng Dẫn Thực Thi](docs/05-roadmap-and-execution-guide.md) | Lộ trình 5 giai đoạn phát triển, cài đặt môi trường ban đầu (VS Code, Android Studio, Xcode, Re.Pack). |
| **06** | [Sổ Tay Câu Lệnh Thường Dùng](docs/06-commands-cheatsheet.md) | **Cheatsheet thực chiến:** Toàn bộ câu lệnh pnpm workspaces, build, chạy app Android, debug ADB, phím tắt in-app. |

---

## 🎯 Mục Tiêu Cốt Lõi Của Hệ Thống

1. **Phát triển song song 100%:** 5 team (hoặc 5 module phần mềm) có thể code, test và chạy thử độc lập trên máy cục bộ mà không cần phụ thuộc vào mã nguồn của nhau.
2. **Can thiệp sâu Native:** Tối ưu hóa hiệu năng phần cứng cho Camera (quét mã/nhận diện khung hình thời gian thực 60fps), Haptic Feedback (rung đa tầng), và Local/Push Notifications chạy ngầm.
3. **Cập nhật không gián đoạn (OTA):** Cập nhật tính năng mới hoặc sửa lỗi cho từng phần mềm con tức thì qua mạng (Over-The-Air) mà không phải chờ duyệt từ Apple App Store / Google Play Store.
4. **Kiến trúc bền vững:** Phân tầng rõ ràng giữa UI (Function Components) và Logic (OOP Service / Custom Hooks / Zustand Store), kế thừa tối đa tư duy TypeScript và kiến trúc sạch từ Angular.
