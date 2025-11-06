-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 06, 2025 at 09:57 AM
-- Server version: 10.1.38-MariaDB
-- PHP Version: 7.3.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `auto_click`
--

-- --------------------------------------------------------

--
-- Table structure for table `proxy`
--

CREATE TABLE `proxy` (
  `id` int(11) NOT NULL,
  `host` varchar(255) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `user_proxy` varchar(255) DEFAULT NULL,
  `pass_proxy` varchar(255) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  `port` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `proxy`
--

INSERT INTO `proxy` (`id`, `host`, `created_at`, `user_proxy`, `pass_proxy`, `userId`, `port`) VALUES
(2, '198.23.239.134', 1754896990, 'fpkkmquz', 'hh4q5mpyf5g5', 1, '6540'),
(3, '45.38.107.97', 1754897031, 'fpkkmquz', 'hh4q5mpyf5g5', 1, '6014'),
(4, '207.244.217.165', 1754897042, 'fpkkmquz', 'hh4q5mpyf5g5', 1, '6712'),
(5, '107.172.163.27', 1754897055, 'fpkkmquz', 'hh4q5mpyf5g5', 1, '6543'),
(6, '104.222.161.211', 1754897070, 'fpkkmquz', 'hh4q5mpyf5g5', 1, '6343'),
(7, '64.137.96.74', 1754897084, 'fpkkmquz', 'hh4q5mpyf5g5', 1, '6641'),
(8, '216.10.27.159', 1754897097, 'fpkkmquz', 'hh4q5mpyf5g5', 1, '6837'),
(9, '136.0.207.84', 1754897106, 'fpkkmquz', 'hh4q5mpyf5g5', 1, '6661'),
(10, '142.147.128.93', 1754897187, 'fpkkmquz', 'hh4q5mpyf5g5', 1, '6593'),
(11, '23.95.150.145', 1754900492, 'fpkkmquz', 'hh4q5mpyf5g5', 1, '6114');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `created_at`) VALUES
(1, 'admin', 1754882329),
(2, 'user', 1754882335);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `fullName` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `roleId` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `isDeleted` tinyint(4) NOT NULL DEFAULT '0',
  `online` tinyint(4) NOT NULL DEFAULT '0',
  `ngaySinh` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `phone`, `fullName`, `avatar`, `roleId`, `created_at`, `isDeleted`, `online`, `ngaySinh`) VALUES
(1, 'admin@gmail.com', '$2a$10$niUCVRHLkU3m1z6EzumII.RR5hkYEr6d.XYGgPvmbCSWx.MTOjIpq', '', 'Admin', NULL, 1, 1754882450, 0, 1, ''),
(2, 'user@gmail.com', '$2a$10$k5cDgeG.pNNnuG/L2ihTOebcq0G1aYyGAaIZ3BHnGmiXwkQJTID1m', '', 'user', NULL, 2, 1754882616, 0, 1, '');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `proxy`
--
ALTER TABLE `proxy`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_ff9cbf90288fe0deab571baa128` (`userId`);

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
-- AUTO_INCREMENT for table `proxy`
--
ALTER TABLE `proxy`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `proxy`
--
ALTER TABLE `proxy`
  ADD CONSTRAINT `FK_ff9cbf90288fe0deab571baa128` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `FK_368e146b785b574f42ae9e53d5e` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
