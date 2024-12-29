-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: app_mysql:3306
-- Generation Time: Dec 29, 2024 at 01:06 AM
-- Server version: 8.0.39
-- PHP Version: 8.2.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `nestjs_app`
--

-- --------------------------------------------------------

--
-- Table structure for table `city`
--

CREATE TABLE `city` (
  `id` varchar(36) NOT NULL,
  `id_code` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `name_en` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `full_name_en` varchar(255) NOT NULL,
  `latitude` varchar(255) NOT NULL,
  `longitude` varchar(255) NOT NULL,
  `created_at` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `city`
--

INSERT INTO `city` (`id`, `id_code`, `name`, `name_en`, `full_name`, `full_name_en`, `latitude`, `longitude`, `created_at`) VALUES
('01796374-3fed-4cf1-a4ca-423a9f2bc8d1', 37, 'Ninh Bình', 'Ninh Binh', 'Tỉnh Ninh Bình', 'Ninh Binh Province', '20.2051051', '105.9280678', '1735379605'),
('021db139-b590-4b46-bef0-d052c55f0417', 83, 'Bến Tre', 'Ben Tre', 'Tỉnh Bến Tre', 'Ben Tre Province', '10.1093637', '106.4811559', '1735379605'),
('0ac4d6bf-3d56-450c-b633-3cc8cd26c4be', 30, 'Hải Dương', 'Hai Duong', 'Tỉnh Hải Dương', 'Hai Duong Province', '20.8930571', '106.3725441', '1735379605'),
('0d855721-696d-4b1a-9374-261d93fd237d', 11, 'Điện Biên', 'Dien Bien', 'Tỉnh Điện Biên', 'Dien Bien Province', '21.6546566', '103.2168632', '1735379605'),
('16c98db9-5789-47d1-ada9-ebdab8e5874f', 4, 'Cao Bằng', 'Cao Bang', 'Tỉnh Cao Bằng', 'Cao Bang Province', '22.7426936', '106.1060926', '1735379605'),
('1a1a4331-d382-4bda-a259-2188d46b56c5', 20, 'Lạng Sơn', 'Lang Son', 'Tỉnh Lạng Sơn', 'Lang Son Province', '21.8487579', '106.6140692', '1735379605'),
('269db9ce-9dde-45c7-972f-c7e5cdfd826d', 56, 'Khánh Hòa', 'Khanh Hoa', 'Tỉnh Khánh Hòa', 'Khanh Hoa Province', '12.2980751', '108.9950386', '1735379605'),
('27d32beb-a4b4-4afb-8afc-b6a824495b3a', 24, 'Bắc Giang', 'Bac Giang', 'Tỉnh Bắc Giang', 'Bac Giang Province', '21.3169625', '106.437985', '1735379605'),
('2b1da085-c70f-4369-8f73-b8502635fa8d', 33, 'Hưng Yên', 'Hung Yen', 'Tỉnh Hưng Yên', 'Hung Yen Province', '20.7833912', '106.0699025', '1735379605'),
('2cb6f32b-6170-4356-9431-9ea0c6b7005d', 38, 'Thanh Hóa', 'Thanh Hoa', 'Tỉnh Thanh Hóa', 'Thanh Hoa Province', '19.9781573', '105.4816107', '1735379605'),
('307754b8-c551-4750-a521-635d9d5324f4', 67, 'Đắk Nông', 'Dak Nong', 'Tỉnh Đắk Nông', 'Dak Nong Province', '12.2818851', '107.7302484', '1735379605'),
('3115a8f1-0bff-4333-9ca2-d183d0eadfa3', 8, 'Tuyên Quang', 'Tuyen Quang', 'Tỉnh Tuyên Quang', 'Tuyen Quang Province', '22.0747798', '105.258411', '1735379605'),
('353d91bd-6013-4277-96ad-f654256f2113', 96, 'Cà Mau', 'Ca Mau', 'Tỉnh Cà Mau', 'Ca Mau Province', '9.0180177', '105.0869724', '1735379605'),
('42380dab-3462-4418-be15-6f470fa396ff', 60, 'Bình Thuận', 'Binh Thuan', 'Tỉnh Bình Thuận', 'Binh Thuan Province', '11.1041572', '108.1832931', '1735379605'),
('49248223-9056-43f9-91e2-31da5b3d7a27', 74, 'Bình Dương', 'Binh Duong', 'Tỉnh Bình Dương', 'Binh Duong Province', '11.1836551', '106.7031737', '1735379605'),
('49721f1f-2327-42ec-829c-939aa8d3e6f8', 45, 'Quảng Trị', 'Quang Tri', 'Tỉnh Quảng Trị', 'Quang Tri Province', '16.7897806', '106.9797431', '1735379605'),
('49d6341d-dec5-4289-9c80-9442f536c367', 86, 'Vĩnh Long', 'Vinh Long', 'Tỉnh Vĩnh Long', 'Vinh Long Province', '10.1203043', '106.0125705', '1735379605'),
('51b87af1-d002-4b74-8255-9fe233ff65cc', 34, 'Thái Bình', 'Thai Binh', 'Tỉnh Thái Bình', 'Thai Binh Province', '20.5296832', '106.3876068', '1735379605'),
('533a0a07-149f-4937-8fcb-1ca455050aa9', 84, 'Trà Vinh', 'Tra Vinh', 'Tỉnh Trà Vinh', 'Tra Vinh Province', '9.8037998', '106.3256808', '1735379605'),
('5fa61ca6-6557-4813-99c7-c8342ebaeeff', 1, 'Hà Nội', 'Ha Noi', 'Thành phố Hà Nội', 'Ha Noi City', '21.0283334', '105.854041', '1735379605'),
('6435c06b-5ec5-422d-bdb3-815558ee8bbc', 49, 'Quảng Nam', 'Quang Nam', 'Tỉnh Quảng Nam', 'Quang Nam Province', '15.5761698', '108.0527132', '1735379605'),
('6e016dd5-7339-4216-84ed-a7b21494dda0', 44, 'Quảng Bình', 'Quang Binh', 'Tỉnh Quảng Bình', 'Quang Binh Province', '17.509599', '106.4004452', '1735379605'),
('6ef3e0c6-772c-4bb4-9a03-fd7f62ca614b', 92, 'Cần Thơ', 'Can Tho', 'Thành phố Cần Thơ', 'Can Tho City', '10.0364634', '105.7875821', '1735379605'),
('71e92f1c-2aa4-4d55-86e2-66435094211b', 15, 'Yên Bái', 'Yen Bai', 'Tỉnh Yên Bái', 'Yen Bai Province', '21.8268679', '104.663122', '1735379605'),
('760924ea-de93-44e1-9e42-583010ce0660', 82, 'Tiền Giang', 'Tien Giang', 'Tỉnh Tiền Giang', 'Tien Giang Province', '10.4030368', '106.361633', '1735379605'),
('7706520e-38ea-4f14-aac9-5c1c5bafeb53', 19, 'Thái Nguyên', 'Thai Nguyen', 'Tỉnh Thái Nguyên', 'Thai Nguyen Province', '21.6498502', '105.8351394', '1735379605'),
('7876720b-d5bb-40ff-a91f-2835dff6b892', 51, 'Quảng Ngãi', 'Quang Ngai', 'Tỉnh Quảng Ngãi', 'Quang Ngai Province', '14.9953739', '108.691729', '1735379605'),
('79e7a8cc-f979-4f62-9e98-cd7781ea922b', 93, 'Hậu Giang', 'Hau Giang', 'Tỉnh Hậu Giang', 'Hau Giang Province', '9.7985063', '105.6379524', '1735379605'),
('7bd7c0ce-8cfd-40ab-8ddf-3888bc8d6f39', 46, 'Thừa Thiên Huế', 'Thua Thien Hue', 'Tỉnh Thừa Thiên Huế', 'Thua Thien Hue Province', '16.3480798', '107.5398913', '1735379605'),
('7dd64cbb-6b84-4322-b694-5206ce03dfc2', 2, 'Hà Giang', 'Ha Giang', 'Tỉnh Hà Giang', 'Ha Giang Province', '22.7336097', '105.0027271', '1735379605'),
('836e642d-8fe2-4091-8e22-5257382d6388', 40, 'Nghệ An', 'Nghe An', 'Tỉnh Nghệ An', 'Nghe An Province', '19.1976001', '105.060676', '1735379605'),
('840ce148-f5d7-4ffd-9035-b6ae5a1a1f15', 52, 'Bình Định', 'Binh Dinh', 'Tỉnh Bình Định', 'Binh Dinh Province', '14.0779378', '108.9898798', '1735379605'),
('8a838494-b62c-40e6-8d49-d3b1f52b2cab', 87, 'Đồng Tháp', 'Dong Thap', 'Tỉnh Đồng Tháp', 'Dong Thap Province', '10.590424', '105.6802341', '1735379605'),
('9072a460-a614-4626-8eb7-c579bd99c32e', 48, 'Đà Nẵng', 'Da Nang', 'Thành phố Đà Nẵng', 'Da Nang City', '16.068', '108.212', '1735379605'),
('95162ccf-33e2-4027-80d2-c375ccf3dc78', 22, 'Quảng Ninh', 'Quang Ninh', 'Tỉnh Quảng Ninh', 'Quang Ninh Province', '21.1718046', '107.2012742', '1735379605'),
('979dbb26-9059-48c8-9dad-e67109a7d5ed', 58, 'Ninh Thuận', 'Ninh Thuan', 'Tỉnh Ninh Thuận', 'Ninh Thuan Province', '11.6965639', '108.8928476', '1735379605'),
('9ae6197d-116d-4d4a-a3f5-c29b5ad035a6', 17, 'Hoà Bình', 'Hoa Binh', 'Tỉnh Hoà Bình', 'Hoa Binh Province', '20.6763365', '105.3759952', '1735379605'),
('a000076b-88b2-4c82-b1f3-48ab1a17139c', 95, 'Bạc Liêu', 'Bac Lieu', 'Tỉnh Bạc Liêu', 'Bac Lieu Province', '9.3298341', '105.509946', '1735379605'),
('ab99c926-1729-4710-8908-d85af31cca48', 31, 'Hải Phòng', 'Hai Phong', 'Thành phố Hải Phòng', 'Hai Phong City', '20.858864', '106.6749591', '1735379605'),
('ac5447ba-3018-410a-8a03-8c0ef782fa9a', 79, 'Hồ Chí Minh', 'Ho Chi Minh', 'Thành phố Hồ Chí Minh', 'Ho Chi Minh City', '10.7763897', '106.7011391', '1735379605'),
('b22ae622-855e-4951-b819-150f50a5de67', 66, 'Đắk Lắk', 'Dak Lak', 'Tỉnh Đắk Lắk', 'Dak Lak Province', '12.8292274', '108.2999058', '1735379605'),
('b585397b-7d8d-40a1-a7dc-090ec60d78ee', 77, 'Bà Rịa - Vũng Tàu', 'Ba Ria - Vung Tau', 'Tỉnh Bà Rịa - Vũng Tàu', 'Ba Ria - Vung Tau Province', '10.5738801', '107.3284362', '1735379605'),
('b8611bfb-2b6f-4619-864c-fb8c36203a99', 54, 'Phú Yên', 'Phu Yen', 'Tỉnh Phú Yên', 'Phu Yen Province', '13.1912633', '109.1273678', '1735379605'),
('bd6e9570-fc0f-4a6c-8bd2-4026ab680697', 75, 'Đồng Nai', 'Dong Nai', 'Tỉnh Đồng Nai', 'Dong Nai Province', '11.0355624', '107.1881076', '1735379605'),
('bde5c9ed-7c05-42c7-ba59-45ad5ed31f80', 26, 'Vĩnh Phúc', 'Vinh Phuc', 'Tỉnh Vĩnh Phúc', 'Vinh Phuc Province', '21.3778689', '105.5758286', '1735379605'),
('bf00db87-a81a-40a3-a6bf-2d39dbdb59c2', 27, 'Bắc Ninh', 'Bac Ninh', 'Tỉnh Bắc Ninh', 'Bac Ninh Province', '21.0955822', '106.1264766', '1735379605'),
('c10d6ba3-3830-4692-9b8e-b84e38172add', 91, 'Kiên Giang', 'Kien Giang', 'Tỉnh Kiên Giang', 'Kien Giang Province', '9.9904962', '105.2435248', '1735379605'),
('c232e55c-eac7-45e0-94be-6f221363b909', 6, 'Bắc Kạn', 'Bac Kan', 'Tỉnh Bắc Kạn', 'Bac Kan Province', '22.2571701', '105.8204437', '1735379605'),
('c3fc461d-d601-45de-8c72-c100a3fb59f8', 72, 'Tây Ninh', 'Tay Ninh', 'Tỉnh Tây Ninh', 'Tay Ninh Province', '11.4019366', '106.1626927', '1735379605'),
('c6760497-d0fc-459b-8b2f-75f0e6fc5ed0', 10, 'Lào Cai', 'Lao Cai', 'Tỉnh Lào Cai', 'Lao Cai Province', '22.3069302', '104.1829592', '1735379605'),
('c81f5446-df68-4520-82c2-e423925274ba', 35, 'Hà Nam', 'Ha Nam', 'Tỉnh Hà Nam', 'Ha Nam Province', '20.5340294', '105.98102482169935', '1735379605'),
('ccb758c1-7d8d-49b5-ac0a-b22386725a89', 68, 'Lâm Đồng', 'Lam Dong', 'Tỉnh Lâm Đồng', 'Lam Dong Province', '11.6614957', '108.1335279', '1735379605'),
('cd930e81-4537-410c-81ce-d751106acd9b', 36, 'Nam Định', 'Nam Dinh', 'Tỉnh Nam Định', 'Nam Dinh Province', '20.2686476', '106.2289075', '1735379605'),
('cf3a5382-d1e2-41b6-94b0-509ebe2524af', 25, 'Phú Thọ', 'Phu Tho', 'Tỉnh Phú Thọ', 'Phu Tho Province', '21.3007538', '105.1349604', '1735379605'),
('d3a6cb0d-2c42-4938-b05f-9bd3f1da7a92', 62, 'Kon Tum', 'Kon Tum', 'Tỉnh Kon Tum', 'Kon Tum Province', '14.6995372', '107.9323831', '1735379605'),
('d7927968-9f8c-4b7d-b13a-eca81375dd6c', 12, 'Lai Châu', 'Lai Chau', 'Tỉnh Lai Châu', 'Lai Chau Province', '22.2921668', '103.1798662', '1735379605'),
('e42e2c7d-81a4-4424-8b93-d059901edcb8', 89, 'An Giang', 'An Giang', 'Tỉnh An Giang', 'An Giang Province', '10.5392057', '105.2312822', '1735379605'),
('e69b1c0e-6236-4285-8002-82ed138c3244', 64, 'Gia Lai', 'Gia Lai', 'Tỉnh Gia Lai', 'Gia Lai Province', '13.8177445', '108.2004015', '1735379605'),
('e9f8b8d6-72f8-415b-bb45-0c1cb01d7ade', 80, 'Long An', 'Long An', 'Tỉnh Long An', 'Long An Province', '10.6983968', '106.1883517', '1735379605'),
('eac6e498-ca00-413d-b1a6-e39c076e9ef6', 94, 'Sóc Trăng', 'Soc Trang', 'Tỉnh Sóc Trăng', 'Soc Trang Province', '9.5628369', '105.9493991', '1735379605'),
('f6bd2a59-e45d-4a1b-a7e0-d61ae0562645', 14, 'Sơn La', 'Son La', 'Tỉnh Sơn La', 'Son La Province', '21.2276769', '104.1575944', '1735379605'),
('fdcc2fa3-a40a-41dd-81ea-8e57859606ff', 70, 'Bình Phước', 'Binh Phuoc', 'Tỉnh Bình Phước', 'Binh Phuoc Province', '11.7543232', '106.9266473', '1735379605'),
('fefb880c-b573-43db-b94e-d0432f577a03', 42, 'Hà Tĩnh', 'Ha Tinh', 'Tỉnh Hà Tĩnh', 'Ha Tinh Province', '18.3504832', '105.7623047', '1735379605');

-- --------------------------------------------------------

--
-- Table structure for table `district`
--

CREATE TABLE `district` (
  `id` varchar(36) NOT NULL,
  `cityId` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `name_en` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `full_name_en` varchar(255) NOT NULL,
  `latitude` varchar(255) NOT NULL,
  `longitude` varchar(255) NOT NULL,
  `created_at` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `created_at`) VALUES
(1, 'admin', 1734085838),
(2, 'user', 1734085846);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `fullName` varchar(255) DEFAULT NULL,
  `roleId` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `created_update` int NOT NULL,
  `city` int NOT NULL,
  `district` int NOT NULL,
  `ward` int NOT NULL,
  `address` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `date` int NOT NULL,
  `avatar` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `fullName`, `roleId`, `created_at`, `created_update`, `city`, `district`, `ward`, `address`, `phone`, `date`, `avatar`) VALUES
(1, 'admin@gmail.com', '$2a$10$S/tKaXHOVHM6sPAt06UJSuT2jfqFAjijssgWH2iOY7i4FdVbd/XlK', 'Admin', 1, 1734085959, 0, 0, 0, 0, '', '', 0, '');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `city`
--
ALTER TABLE `city`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `district`
--
ALTER TABLE `district`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_148f1c944d0fec4114a54984da1` (`cityId`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_368e146b785b574f42ae9e53d5e` (`roleId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `district`
--
ALTER TABLE `district`
  ADD CONSTRAINT `FK_148f1c944d0fec4114a54984da1` FOREIGN KEY (`cityId`) REFERENCES `city` (`id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `FK_368e146b785b574f42ae9e53d5e` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
