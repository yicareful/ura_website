-- CreateTable
CREATE TABLE `Event` (
    `id` VARCHAR(30) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `city` VARCHAR(255) NOT NULL,
    `location` VARCHAR(255) NOT NULL,
    `bannerUrl` VARCHAR(512) NULL,
    `logoUrl` VARCHAR(512) NULL,
    `registrationStart` DATETIME(3) NOT NULL,
    `registrationEnd` DATETIME(3) NOT NULL,
    `eventDate` DATETIME(3) NOT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'draft',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Event_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Group` (
    `id` VARCHAR(30) NOT NULL,
    `eventId` VARCHAR(30) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `distance` DOUBLE NOT NULL,
    `startTime` VARCHAR(20) NOT NULL,
    `cutoffTime` VARCHAR(20) NOT NULL,
    `gender` VARCHAR(10) NOT NULL DEFAULT 'all',
    `minAge` INTEGER NULL,
    `maxAge` INTEGER NULL,
    `capacity` INTEGER NOT NULL,
    `fee` INTEGER NOT NULL,
    `isOpen` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Group_eventId_idx`(`eventId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Runner` (
    `id` VARCHAR(30) NOT NULL,
    `phone` VARCHAR(20) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `uraId` INTEGER NULL,
    `gender` VARCHAR(10) NOT NULL,
    `idCard` VARCHAR(18) NOT NULL,
    `email` VARCHAR(255) NULL,
    `school` VARCHAR(255) NOT NULL,
    `major` VARCHAR(255) NULL,
    `sessionToken` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Runner_phone_key`(`phone`),
    UNIQUE INDEX `Runner_uraId_key`(`uraId`),
    UNIQUE INDEX `Runner_sessionToken_key`(`sessionToken`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Registration` (
    `id` VARCHAR(30) NOT NULL,
    `eventId` VARCHAR(30) NOT NULL,
    `groupId` VARCHAR(30) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `gender` VARCHAR(10) NOT NULL,
    `idCard` VARCHAR(18) NOT NULL,
    `phone` VARCHAR(20) NOT NULL,
    `email` VARCHAR(255) NULL,
    `school` VARCHAR(255) NOT NULL,
    `major` VARCHAR(255) NULL,
    `runnerId` VARCHAR(30) NULL,
    `emergencyContact` VARCHAR(255) NOT NULL,
    `emergencyPhone` VARCHAR(20) NOT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'pending_payment',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Registration_eventId_idx`(`eventId`),
    INDEX `Registration_groupId_idx`(`groupId`),
    INDEX `Registration_idCard_phone_idx`(`idCard`, `phone`),
    UNIQUE INDEX `Registration_eventId_groupId_idCard_key`(`eventId`, `groupId`, `idCard`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Group` ADD CONSTRAINT `Group_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Registration` ADD CONSTRAINT `Registration_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Registration` ADD CONSTRAINT `Registration_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `Group`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Registration` ADD CONSTRAINT `Registration_runnerId_fkey` FOREIGN KEY (`runnerId`) REFERENCES `Runner`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;