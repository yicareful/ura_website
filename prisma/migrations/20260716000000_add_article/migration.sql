-- CreateTable
CREATE TABLE `Article` (
    `id` VARCHAR(30) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `subtitle` VARCHAR(255) NULL,
    `category` VARCHAR(20) NOT NULL,
    `author` VARCHAR(255) NULL,
    `excerpt` TEXT NOT NULL,
    `coverTag` VARCHAR(191) NULL,
    `coverMeta` VARCHAR(191) NULL,
    `coverUrl` VARCHAR(512) NULL,
    `content` LONGTEXT NOT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'draft',
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `readMinutes` INTEGER NOT NULL DEFAULT 3,
    `publishedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Article_slug_key`(`slug`),
    INDEX `Article_category_status_idx`(`category`, `status`),
    INDEX `Article_status_publishedAt_idx`(`status`, `publishedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;