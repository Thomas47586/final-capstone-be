-- SQL Script tạo Database cho Airbnb Clone (Đồng bộ với Prisma Schema)
-- Chạy script này trong Database bạn vừa tạo qua Docker

CREATE DATABASE IF NOT EXISTS db_airbnb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE db_airbnb;

-- 1. Bảng NguoiDung
CREATE TABLE NguoiDung (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    pass_word VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NULL,
    birth_day VARCHAR(255) NULL,
    gender BOOLEAN NULL,
    role VARCHAR(255) NULL,
    
    -- Audit columns
    deletedBY INT DEFAULT 0,
    isDeleted BOOLEAN DEFAULT FALSE,
    deletedAt TIMESTAMP NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAT TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Bảng ViTri
CREATE TABLE ViTri (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ten_vi_tri VARCHAR(255) NOT NULL,
    tinh_thanh VARCHAR(255) NOT NULL,
    quoc_gia VARCHAR(255) NOT NULL,
    hinh_anh VARCHAR(255) NULL,
    
    -- Audit columns
    deletedBY INT DEFAULT 0,
    isDeleted BOOLEAN DEFAULT FALSE,
    deletedAt TIMESTAMP NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAT TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. Bảng Phong
CREATE TABLE Phong (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ten_phong VARCHAR(255) NOT NULL,
    khach INT NOT NULL,
    phong_ngu INT NOT NULL,
    giuong INT NOT NULL,
    phong_tam INT NOT NULL,
    mo_ta TEXT NOT NULL,
    gia_tien INT NOT NULL,
    may_giat BOOLEAN NOT NULL,
    ban_la BOOLEAN NOT NULL,
    tivi BOOLEAN NOT NULL,
    dieu_hoa BOOLEAN NOT NULL,
    wifi BOOLEAN NOT NULL,
    bep BOOLEAN NOT NULL,
    do_xe BOOLEAN NOT NULL,
    ho_boi BOOLEAN NOT NULL,
    ban_ui BOOLEAN NOT NULL,
    hinh_anh VARCHAR(255) NULL,
    ma_vi_tri INT NOT NULL,
    
    -- Audit columns
    deletedBY INT DEFAULT 0,
    isDeleted BOOLEAN DEFAULT FALSE,
    deletedAt TIMESTAMP NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAT TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Foreign Key
    CONSTRAINT FK_Phong_ViTri FOREIGN KEY (ma_vi_tri) REFERENCES ViTri(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 4. Bảng DatPhong
CREATE TABLE DatPhong (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ma_phong INT NOT NULL,
    ngay_den DATETIME NOT NULL,
    ngay_di DATETIME NOT NULL,
    so_luong_khach INT NOT NULL,
    ma_nguoi_dat INT NOT NULL,
    
    -- Audit columns
    deletedBY INT DEFAULT 0,
    isDeleted BOOLEAN DEFAULT FALSE,
    deletedAt TIMESTAMP NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAT TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Foreign Keys
    CONSTRAINT FK_DatPhong_Phong FOREIGN KEY (ma_phong) REFERENCES Phong(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT FK_DatPhong_NguoiDung FOREIGN KEY (ma_nguoi_dat) REFERENCES NguoiDung(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 5. Bảng BinhLuan
CREATE TABLE BinhLuan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ma_phong INT NOT NULL,
    ma_nguoi_binh_luan INT NOT NULL,
    ngay_binh_luan DATETIME NOT NULL,
    noi_dung TEXT NOT NULL,
    sao_binh_luan INT NOT NULL,
    
    -- Audit columns
    deletedBY INT DEFAULT 0,
    isDeleted BOOLEAN DEFAULT FALSE,
    deletedAt TIMESTAMP NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAT TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Foreign Keys
    CONSTRAINT FK_BinhLuan_Phong FOREIGN KEY (ma_phong) REFERENCES Phong(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT FK_BinhLuan_NguoiDung FOREIGN KEY (ma_nguoi_binh_luan) REFERENCES NguoiDung(id) ON DELETE CASCADE ON UPDATE CASCADE
);
