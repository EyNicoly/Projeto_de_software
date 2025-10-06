DROP DATABASE IF EXISTS `site_treinos`;

CREATE DATABASE `site_treinos` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `site_treinos`;

CREATE TABLE `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE
) ENGINE=InnoDB;
