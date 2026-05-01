# 🏠 Airbnb Clone — Backend API

> **Dự án cuối khoá** | NestJS + Prisma + MySQL | Cybersoft Vietnam

---

## ⚙️ Tech Stack & Thư viện

### 🏗️ Core Framework

| Thư viện | Mục đích sử dụng |
|---|---|
| `@nestjs/core` | Framework chính — kiến trúc Module/Controller/Service/DI |
| `@nestjs/common` | Các decorator cốt lõi: `@Controller`, `@Get`, `@Body`, `@Param`... |
| `@nestjs/platform-express` | Adapter cho Express.js (HTTP server bên dưới NestJS) |

### 🗄️ Database

| Thư viện | Mục đích sử dụng |
|---|---|
| `prisma` (devDependency) | CLI tool: `npx prisma generate`, `npx prisma db push` |
| `@prisma/client` | ORM Client — thao tác DB: `findMany`, `create`, `update`... |

### 🔐 Authentication & Security

| Thư viện | Mục đích sử dụng |
|---|---|
| `@nestjs/jwt` | Tạo và verify JWT Token (accessToken) |
| `bcrypt` + `@types/bcrypt` | Mã hoá mật khẩu khi đăng ký, so sánh khi đăng nhập |

### ✅ Validation & Transformation

| Thư viện | Mục đích sử dụng |
|---|---|
| `class-validator` | Validate DTO tự động qua Decorator (`@IsEmail`, `@IsNotEmpty`...) |
| `class-transformer` | Ép kiểu tự động từ JSON sang Class (dùng với `transform: true` trong ValidationPipe) |

### 📁 File Upload

| Thư viện | Mục đích sử dụng |
|---|---|
| `multer` + `@types/multer` | Xử lý upload file (`multipart/form-data`) — lưu ảnh vào thư mục `/public/imgs` |
| `@nestjs/platform-express` | Đã bao gồm — cung cấp `FileInterceptor` và `MulterModule` cho NestJS |

### 📖 API Documentation

| Thư viện | Mục đích sử dụng |
|---|---|
| `@nestjs/swagger` | Tự động sinh tài liệu Swagger từ Decorator trong code |
| `swagger-ui-express` | Render giao diện Swagger UI tại `http://localhost:3000/swagger` |

---

## 🗂️ Cấu trúc thư mục

```
src/
├── common/
│   ├── constants/          # Hằng số toàn cục (JWT Secret, Bcrypt Salt...)
│   ├── decorators/         # @GetUser() — lấy user đang đăng nhập
│   └── guards/             # JwtAuthGuard + @Public() decorator
│       └── jwt-auth.guard.ts
│
├── modules-system/         # Module hệ thống (không phải API nghiệp vụ)
│   └── prisma/             # PrismaService — kết nối database
│
└── modules-api/            # Tất cả API nghiệp vụ
    ├── auth/               # Đăng ký / Đăng nhập
    ├── nguoi-dung/         # Quản lý người dùng (CRUD + Upload Avatar)
    ├── vi-tri/             # Quản lý vị trí (CRUD + Upload ảnh + Phân trang)
    ├── phong/              # Quản lý phòng thuê (CRUD + Upload ảnh + Phân trang)
    ├── dat-phong/          # Đặt phòng / Huỷ phòng
    └── binh-luan/          # Bình luận theo phòng
```

---

## 🔐 Luồng hoạt động Auth (Flow)

```
Client                      Server
  |                             |
  |-- POST /api/auth/signup --> |  1. Kiểm tra email tồn tại chưa
  |                             |  2. Hash password bằng Bcrypt
  |                             |  3. Lưu vào DB
  |<-- 201 { user info } ------  |
  |                             |
  |-- POST /api/auth/signin --> |  1. Tìm user theo email
  |                             |  2. So sánh password với Bcrypt
  |                             |  3. Tạo JWT AccessToken (7 ngày)
  |<-- 201 { accessToken } -----|
  |                             |
  |-- GET /api/users/ -------> |  1. JwtAuthGuard chặn request
  |   Header: Bearer <token>   |  2. Giải mã token → lấy userId
  |                            |  3. Tìm user trong DB
  |                            |  4. Gắn user vào request
  |<-- 200 { data } -----------|
```

---

## 🛡️ Cơ chế phân quyền

- **Mặc định:** Tất cả API đều bị khoá (`JwtAuthGuard` global)
- **`@Public()`:** Gắn decorator này vào API nào muốn cho truy cập không cần Token
- **`@GetUser()`:** Dùng trong Controller để lấy thông tin user đang đăng nhập

---

## 📋 Tiến độ theo từng Module

### ✅ Chặng 1 — Nền móng

- [x] **Khởi tạo project** NestJS sạch
- [x] **Prisma v5** kết nối MySQL Docker
- [x] **Database Schema** — 5 bảng + 5 cột Audit (isDeleted, createdAt...)
- [x] **Swagger UI** tại `http://localhost:3000/swagger`
- [x] **Global Prefix** `/api`
- [x] **ValidationPipe** global (whitelist + transform)
- [x] **JwtAuthGuard** global — bảo vệ toàn bộ API

---

### ✅ Module Auth — `/api/auth`

| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| POST | `/api/auth/signup` | Đăng ký tài khoản | ❌ Public |
| POST | `/api/auth/signin` | Đăng nhập, lấy accessToken | ❌ Public |

**Schema Swagger:** `ThongTinDangKy`, `ThongTinDangNhap`

---

### ✅ Module ViTri — `/api/vi-tri`

| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| GET | `/api/vi-tri` | Lấy danh sách vị trí | ❌ Public |
| GET | `/api/vi-tri/phan-trang-tim-kiem` | Phân trang + tìm kiếm | ❌ Public |
| GET | `/api/vi-tri/:id` | Lấy vị trí theo ID | ❌ Public |
| POST | `/api/vi-tri` | Thêm vị trí mới | ✅ Token |
| PUT | `/api/vi-tri/:id` | Cập nhật vị trí | ✅ Token |
| DELETE | `/api/vi-tri/:id` | Xoá vị trí | ✅ Token |
| POST | `/api/vi-tri/upload-hinh-vitri` | Upload ảnh vị trí | ✅ Token |

---

### 🔲 Module NguoiDung — `/api/users`

| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| GET | `/api/users` | Lấy danh sách users | ✅ Token |
| GET | `/api/users/phan-trang-tim-kiem` | Phân trang + tìm kiếm | ✅ Token |
| GET | `/api/users/:id` | Lấy user theo ID | ✅ Token |
| GET | `/api/users/search/:tenNguoiDung` | Tìm kiếm user theo tên | ✅ Token |
| POST | `/api/users` | Thêm user mới | ✅ Token |
| PUT | `/api/users/:id` | Cập nhật user | ✅ Token |
| DELETE | `/api/users` | Xoá user | ✅ Token |
| POST | `/api/users/upload-avatar` | Upload ảnh đại diện | ✅ Token |

---

### 🔲 Module Phong — `/api/phong-thue`

| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| GET | `/api/phong-thue` | Lấy danh sách phòng | ❌ Public |
| GET | `/api/phong-thue/lay-phong-theo-vi-tri` | Lấy phòng theo vị trí | ❌ Public |
| GET | `/api/phong-thue/phan-trang-tim-kiem` | Phân trang + tìm kiếm | ❌ Public |
| GET | `/api/phong-thue/:id` | Lấy phòng theo ID | ❌ Public |
| POST | `/api/phong-thue` | Thêm phòng mới | ✅ Token |
| PUT | `/api/phong-thue/:id` | Cập nhật phòng | ✅ Token |
| DELETE | `/api/phong-thue/:id` | Xoá phòng | ✅ Token |
| POST | `/api/phong-thue/upload-hinh-phong` | Upload ảnh phòng | ✅ Token |

---

### 🔲 Module DatPhong — `/api/dat-phong`

| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| GET | `/api/dat-phong` | Lấy danh sách đặt phòng | ✅ Token |
| GET | `/api/dat-phong/:id` | Lấy đặt phòng theo ID | ✅ Token |
| GET | `/api/dat-phong/lay-theo-nguoi-dung/:maNguoiDung` | Lấy đặt phòng theo User | ✅ Token |
| POST | `/api/dat-phong` | Đặt phòng | ✅ Token |
| PUT | `/api/dat-phong/:id` | Cập nhật đặt phòng | ✅ Token |
| DELETE | `/api/dat-phong/:id` | Huỷ đặt phòng | ✅ Token |

---

### 🔲 Module BinhLuan — `/api/binh-luan`

| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| GET | `/api/binh-luan` | Lấy danh sách bình luận | ❌ Public |
| GET | `/api/binh-luan/lay-binh-luan-theo-phong/:maPhong` | Lấy bình luận theo phòng | ❌ Public |
| POST | `/api/binh-luan` | Thêm bình luận | ✅ Token |
| PUT | `/api/binh-luan/:id` | Cập nhật bình luận | ✅ Token |
| DELETE | `/api/binh-luan/:id` | Xoá bình luận | ✅ Token |

---

## 🚀 Chạy dự án

```bash
# Cài dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Đồng bộ Database
npx prisma db push

# Chạy development server
npm run start:dev

# Truy cập Swagger
open http://localhost:3000/swagger
```

---

## 📝 Quy ước đặt tên (Naming Convention)

| Thứ | Quy ước | Ví dụ |
|---|---|---|
| Tên Schema Swagger | Tiếng Việt, PascalCase | `ThongTinDangKy`, `ViTriViewModel` |
| Token trả về | `accessToken` | Không dùng `token`, `jwt` |
| Soft delete | Dùng `isDeleted=true` | Không xoá thật khỏi DB |
| Audit columns | 5 cột bắt buộc mọi bảng | `createdAt`, `updatedAT`, `isDeleted`, `deletedAt`, `deletedBY` |
# final-capstone-be
