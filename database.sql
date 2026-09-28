-- =========================================================================
-- ANTRABUMI 2026 — Complete Database Export (DDL Schema + Initial Data)
-- Generated: 2026-09-28T15:18:55.447Z
-- Target Engine: MySQL 8+ / MariaDB 10.4+ (phpMyAdmin, cPanel, VPS, Cloud SQL)
-- Default Charset: utf8mb4 / utf8mb4_unicode_ci
-- =========================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NULL,
    `role` ENUM('SUPER_ADMIN', 'ADMIN', 'EDITOR', 'AUTHOR') NOT NULL DEFAULT 'AUTHOR',
    `status` ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED') NOT NULL DEFAULT 'ACTIVE',
    `imageId` VARCHAR(191) NULL,
    `lastLoginAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    INDEX `User_role_idx`(`role`),
    INDEX `User_status_idx`(`status`),
    INDEX `User_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Permission` (
    `id` VARCHAR(191) NOT NULL,
    `key` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Permission_key_key`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Page` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `language` ENUM('ID', 'EN') NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `excerpt` TEXT NULL,
    `content` LONGTEXT NULL,
    `heroTitle` VARCHAR(191) NULL,
    `heroDescription` VARCHAR(191) NULL,
    `heroMediaId` VARCHAR(191) NULL,
    `status` ENUM('DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    `seoTitle` VARCHAR(191) NULL,
    `seoDescription` TEXT NULL,
    `ogImageId` VARCHAR(191) NULL,
    `publishedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Page_status_idx`(`status`),
    INDEX `Page_language_idx`(`language`),
    INDEX `Page_publishedAt_idx`(`publishedAt`),
    UNIQUE INDEX `Page_slug_language_key`(`slug`, `language`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ContributionArea` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `status` ENUM('DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    `order` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ContributionArea_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ContributionAreaTranslation` (
    `id` VARCHAR(191) NOT NULL,
    `contributionAreaId` VARCHAR(191) NOT NULL,
    `language` ENUM('ID', 'EN') NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `imageId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ContributionAreaTranslation_language_idx`(`language`),
    UNIQUE INDEX `ContributionAreaTranslation_contributionAreaId_language_key`(`contributionAreaId`, `language`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Experience` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL DEFAULT 'EXPERIENCE',
    `year` INTEGER NULL,
    `location` VARCHAR(191) NULL,
    `clientName` VARCHAR(191) NULL,
    `status` ENUM('DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `coverMediaId` VARCHAR(191) NULL,
    `createdById` VARCHAR(191) NOT NULL,
    `updatedById` VARCHAR(191) NOT NULL,
    `publishedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Experience_slug_key`(`slug`),
    INDEX `Experience_type_idx`(`type`),
    INDEX `Experience_status_idx`(`status`),
    INDEX `Experience_year_idx`(`year`),
    INDEX `Experience_featured_idx`(`featured`),
    INDEX `Experience_publishedAt_idx`(`publishedAt`),
    INDEX `Experience_createdById_idx`(`createdById`),
    INDEX `Experience_updatedById_idx`(`updatedById`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ExperienceTranslation` (
    `id` VARCHAR(191) NOT NULL,
    `experienceId` VARCHAR(191) NOT NULL,
    `language` ENUM('ID', 'EN') NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `excerpt` TEXT NULL,
    `description` LONGTEXT NULL,
    `methodology` LONGTEXT NULL,
    `impact` LONGTEXT NULL,
    `seoTitle` VARCHAR(191) NULL,
    `seoDescription` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ExperienceTranslation_language_idx`(`language`),
    UNIQUE INDEX `ExperienceTranslation_experienceId_language_key`(`experienceId`, `language`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ExperienceMetric` (
    `id` VARCHAR(191) NOT NULL,
    `experienceId` VARCHAR(191) NOT NULL,
    `label` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `unit` VARCHAR(191) NULL,
    `order` INTEGER NOT NULL DEFAULT 0,

    INDEX `ExperienceMetric_experienceId_idx`(`experienceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ExperienceContributionArea` (
    `experienceId` VARCHAR(191) NOT NULL,
    `contributionAreaId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`experienceId`, `contributionAreaId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ExperienceMedia` (
    `experienceId` VARCHAR(191) NOT NULL,
    `mediaId` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`experienceId`, `mediaId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Person` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `imageId` VARCHAR(191) NULL,
    `status` ENUM('DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    `order` INTEGER NOT NULL DEFAULT 0,
    `createdById` VARCHAR(191) NOT NULL,
    `updatedById` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Person_slug_key`(`slug`),
    INDEX `Person_status_idx`(`status`),
    INDEX `Person_createdById_idx`(`createdById`),
    INDEX `Person_updatedById_idx`(`updatedById`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PersonTranslation` (
    `id` VARCHAR(191) NOT NULL,
    `personId` VARCHAR(191) NOT NULL,
    `language` ENUM('ID', 'EN') NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `degree` VARCHAR(191) NULL,
    `role` VARCHAR(191) NULL,
    `biography` LONGTEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `PersonTranslation_personId_language_key`(`personId`, `language`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Expertise` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Expertise_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PersonExpertise` (
    `personId` VARCHAR(191) NOT NULL,
    `expertiseId` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`personId`, `expertiseId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Knowledge` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `type` ENUM('RESEARCH', 'ASSESSMENT', 'REPORT', 'PUBLICATION', 'ARTICLE', 'STORY', 'INSIGHT') NOT NULL,
    `coverMediaId` VARCHAR(191) NULL,
    `status` ENUM('DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `authorName` VARCHAR(191) NULL,
    `publicationDate` DATETIME(3) NULL,
    `createdById` VARCHAR(191) NOT NULL,
    `updatedById` VARCHAR(191) NOT NULL,
    `publishedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Knowledge_slug_key`(`slug`),
    INDEX `Knowledge_type_idx`(`type`),
    INDEX `Knowledge_status_idx`(`status`),
    INDEX `Knowledge_publicationDate_idx`(`publicationDate`),
    INDEX `Knowledge_featured_idx`(`featured`),
    INDEX `Knowledge_createdById_idx`(`createdById`),
    INDEX `Knowledge_updatedById_idx`(`updatedById`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `KnowledgeTranslation` (
    `id` VARCHAR(191) NOT NULL,
    `knowledgeId` VARCHAR(191) NOT NULL,
    `language` ENUM('ID', 'EN') NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `excerpt` TEXT NULL,
    `content` LONGTEXT NULL,
    `seoTitle` VARCHAR(191) NULL,
    `seoDescription` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `KnowledgeTranslation_language_idx`(`language`),
    UNIQUE INDEX `KnowledgeTranslation_knowledgeId_language_key`(`knowledgeId`, `language`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Category_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `KnowledgeCategory` (
    `knowledgeId` VARCHAR(191) NOT NULL,
    `categoryId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`knowledgeId`, `categoryId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tag` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Tag_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `KnowledgeTag` (
    `knowledgeId` VARCHAR(191) NOT NULL,
    `tagId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`knowledgeId`, `tagId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ExperienceKnowledge` (
    `experienceId` VARCHAR(191) NOT NULL,
    `knowledgeId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`experienceId`, `knowledgeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `KnowledgeContributionArea` (
    `knowledgeId` VARCHAR(191) NOT NULL,
    `contributionAreaId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`knowledgeId`, `contributionAreaId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `KnowledgeDownload` (
    `id` VARCHAR(191) NOT NULL,
    `knowledgeId` VARCHAR(191) NOT NULL,
    `mediaId` VARCHAR(191) NOT NULL,
    `label` VARCHAR(191) NULL,
    `order` INTEGER NOT NULL DEFAULT 0,

    INDEX `KnowledgeDownload_knowledgeId_idx`(`knowledgeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Media` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('IMAGE', 'DOCUMENT', 'VIDEO', 'AUDIO', 'OTHER') NOT NULL,
    `filename` VARCHAR(191) NOT NULL,
    `originalName` VARCHAR(191) NULL,
    `mimeType` VARCHAR(191) NOT NULL,
    `size` BIGINT NOT NULL,
    `width` INTEGER NULL,
    `height` INTEGER NULL,
    `storageKey` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NULL,
    `altText` VARCHAR(191) NULL,
    `caption` TEXT NULL,
    `attribution` TEXT NULL,
    `uploadedById` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Media_type_idx`(`type`),
    INDEX `Media_uploadedById_idx`(`uploadedById`),
    INDEX `Media_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Partner` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `logoMediaId` VARCHAR(191) NULL,
    `website` VARCHAR(191) NULL,
    `category` VARCHAR(191) NULL,
    `status` ENUM('DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    `order` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Partner_slug_key`(`slug`),
    INDEX `Partner_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ContactMessage` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `organization` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `subject` VARCHAR(191) NOT NULL,
    `message` TEXT NOT NULL,
    `areaOfInterest` VARCHAR(191) NULL,
    `status` ENUM('NEW', 'READ', 'IN_PROGRESS', 'RESOLVED', 'ARCHIVED') NOT NULL DEFAULT 'NEW',
    `assignedToId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ContactMessage_status_idx`(`status`),
    INDEX `ContactMessage_createdAt_idx`(`createdAt`),
    INDEX `ContactMessage_email_idx`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NavigationItem` (
    `id` VARCHAR(191) NOT NULL,
    `label` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NULL,
    `language` ENUM('ID', 'EN') NOT NULL,
    `parentId` VARCHAR(191) NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `visible` BOOLEAN NOT NULL DEFAULT true,
    `openInNewTab` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `NavigationItem_language_idx`(`language`),
    INDEX `NavigationItem_parentId_idx`(`parentId`),
    INDEX `NavigationItem_visible_idx`(`visible`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SiteSetting` (
    `id` VARCHAR(191) NOT NULL,
    `key` VARCHAR(191) NOT NULL,
    `value` LONGTEXT NULL,
    `language` ENUM('ID', 'EN') NULL,
    `description` VARCHAR(191) NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `SiteSetting_key_key`(`key`),
    INDEX `SiteSetting_language_idx`(`language`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AuditLog` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `action` ENUM('LOGIN', 'LOGOUT', 'CREATE', 'UPDATE', 'DELETE', 'PUBLISH', 'UNPUBLISH', 'ARCHIVE', 'UPLOAD', 'USER_ROLE_CHANGED', 'SETTING_CHANGED') NOT NULL,
    `entity` VARCHAR(191) NULL,
    `entityId` VARCHAR(191) NULL,
    `metadata` JSON NULL,
    `ipAddress` VARCHAR(191) NULL,
    `userAgent` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `AuditLog_userId_idx`(`userId`),
    INDEX `AuditLog_action_idx`(`action`),
    INDEX `AuditLog_entity_idx`(`entity`),
    INDEX `AuditLog_entityId_idx`(`entityId`),
    INDEX `AuditLog_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_imageId_fkey` FOREIGN KEY (`imageId`) REFERENCES `Media`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Page` ADD CONSTRAINT `Page_heroMediaId_fkey` FOREIGN KEY (`heroMediaId`) REFERENCES `Media`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Page` ADD CONSTRAINT `Page_ogImageId_fkey` FOREIGN KEY (`ogImageId`) REFERENCES `Media`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ContributionAreaTranslation` ADD CONSTRAINT `ContributionAreaTranslation_contributionAreaId_fkey` FOREIGN KEY (`contributionAreaId`) REFERENCES `ContributionArea`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ContributionAreaTranslation` ADD CONSTRAINT `ContributionAreaTranslation_imageId_fkey` FOREIGN KEY (`imageId`) REFERENCES `Media`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Experience` ADD CONSTRAINT `Experience_coverMediaId_fkey` FOREIGN KEY (`coverMediaId`) REFERENCES `Media`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Experience` ADD CONSTRAINT `Experience_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Experience` ADD CONSTRAINT `Experience_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExperienceTranslation` ADD CONSTRAINT `ExperienceTranslation_experienceId_fkey` FOREIGN KEY (`experienceId`) REFERENCES `Experience`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExperienceMetric` ADD CONSTRAINT `ExperienceMetric_experienceId_fkey` FOREIGN KEY (`experienceId`) REFERENCES `Experience`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExperienceContributionArea` ADD CONSTRAINT `ExperienceContributionArea_experienceId_fkey` FOREIGN KEY (`experienceId`) REFERENCES `Experience`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExperienceContributionArea` ADD CONSTRAINT `ExperienceContributionArea_contributionAreaId_fkey` FOREIGN KEY (`contributionAreaId`) REFERENCES `ContributionArea`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExperienceMedia` ADD CONSTRAINT `ExperienceMedia_experienceId_fkey` FOREIGN KEY (`experienceId`) REFERENCES `Experience`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExperienceMedia` ADD CONSTRAINT `ExperienceMedia_mediaId_fkey` FOREIGN KEY (`mediaId`) REFERENCES `Media`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Person` ADD CONSTRAINT `Person_imageId_fkey` FOREIGN KEY (`imageId`) REFERENCES `Media`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Person` ADD CONSTRAINT `Person_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Person` ADD CONSTRAINT `Person_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PersonTranslation` ADD CONSTRAINT `PersonTranslation_personId_fkey` FOREIGN KEY (`personId`) REFERENCES `Person`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PersonExpertise` ADD CONSTRAINT `PersonExpertise_personId_fkey` FOREIGN KEY (`personId`) REFERENCES `Person`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PersonExpertise` ADD CONSTRAINT `PersonExpertise_expertiseId_fkey` FOREIGN KEY (`expertiseId`) REFERENCES `Expertise`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Knowledge` ADD CONSTRAINT `Knowledge_coverMediaId_fkey` FOREIGN KEY (`coverMediaId`) REFERENCES `Media`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Knowledge` ADD CONSTRAINT `Knowledge_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Knowledge` ADD CONSTRAINT `Knowledge_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `KnowledgeTranslation` ADD CONSTRAINT `KnowledgeTranslation_knowledgeId_fkey` FOREIGN KEY (`knowledgeId`) REFERENCES `Knowledge`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `KnowledgeCategory` ADD CONSTRAINT `KnowledgeCategory_knowledgeId_fkey` FOREIGN KEY (`knowledgeId`) REFERENCES `Knowledge`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `KnowledgeCategory` ADD CONSTRAINT `KnowledgeCategory_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `KnowledgeTag` ADD CONSTRAINT `KnowledgeTag_knowledgeId_fkey` FOREIGN KEY (`knowledgeId`) REFERENCES `Knowledge`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `KnowledgeTag` ADD CONSTRAINT `KnowledgeTag_tagId_fkey` FOREIGN KEY (`tagId`) REFERENCES `Tag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExperienceKnowledge` ADD CONSTRAINT `ExperienceKnowledge_experienceId_fkey` FOREIGN KEY (`experienceId`) REFERENCES `Experience`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExperienceKnowledge` ADD CONSTRAINT `ExperienceKnowledge_knowledgeId_fkey` FOREIGN KEY (`knowledgeId`) REFERENCES `Knowledge`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `KnowledgeContributionArea` ADD CONSTRAINT `KnowledgeContributionArea_knowledgeId_fkey` FOREIGN KEY (`knowledgeId`) REFERENCES `Knowledge`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `KnowledgeContributionArea` ADD CONSTRAINT `KnowledgeContributionArea_contributionAreaId_fkey` FOREIGN KEY (`contributionAreaId`) REFERENCES `ContributionArea`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `KnowledgeDownload` ADD CONSTRAINT `KnowledgeDownload_knowledgeId_fkey` FOREIGN KEY (`knowledgeId`) REFERENCES `Knowledge`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `KnowledgeDownload` ADD CONSTRAINT `KnowledgeDownload_mediaId_fkey` FOREIGN KEY (`mediaId`) REFERENCES `Media`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Media` ADD CONSTRAINT `Media_uploadedById_fkey` FOREIGN KEY (`uploadedById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Partner` ADD CONSTRAINT `Partner_logoMediaId_fkey` FOREIGN KEY (`logoMediaId`) REFERENCES `Media`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ContactMessage` ADD CONSTRAINT `ContactMessage_assignedToId_fkey` FOREIGN KEY (`assignedToId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NavigationItem` ADD CONSTRAINT `NavigationItem_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `NavigationItem`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AuditLog` ADD CONSTRAINT `AuditLog_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;


-- =========================================================================
-- INITIAL & SEED DATA
-- =========================================================================

--
-- Dumping data for table `User`
--
LOCK TABLES `User` WRITE;
INSERT INTO `User` (`id`, `name`, `email`, `passwordHash`, `role`, `status`, `imageId`, `lastLoginAt`, `createdAt`, `updatedAt`) VALUES
('cmulbsdfo0000vd7cz85wyrj2', 'ANTRABUMI Admin', 'admin@antrabumi.org', '$2b$12$x56VSUDk08iCUkPNzm41seYoomXgTwsk1p/cHz74ubvoUVy9L6XYO', 'SUPER_ADMIN', 'ACTIVE', NULL, '2026-09-28 14:19:50', '2026-09-28 14:11:09', '2026-09-28 14:19:50');
UNLOCK TABLES;

--
-- Dumping data for table `Permission`
--
LOCK TABLES `Permission` WRITE;
INSERT INTO `Permission` (`id`, `key`, `description`, `createdAt`, `updatedAt`) VALUES
('cmulbsdkk001fvd7celuy8cce', 'dashboard.view', NULL, '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdkq001gvd7ct15itmq0', 'pages.read', NULL, '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdks001hvd7c7k68q6rw', 'pages.write', NULL, '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdkw001ivd7csr5kypb1', 'experiences.read', NULL, '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdl0001jvd7cxn8ir7we', 'experiences.write', NULL, '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdl2001kvd7czwyubloy', 'experiences.publish', NULL, '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdl5001lvd7c7blxikmt', 'people.read', NULL, '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdl7001mvd7c4e0k4a38', 'people.write', NULL, '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdl9001nvd7ch02ltvut', 'knowledge.read', NULL, '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdlb001ovd7cv83oyams', 'knowledge.write', NULL, '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdlf001pvd7c4a0i1d8w', 'knowledge.publish', NULL, '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdlh001qvd7cvj6oa4nv', 'media.read', NULL, '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdlk001rvd7c8p200dba', 'media.write', NULL, '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdlm001svd7cfgb6xz2t', 'messages.read', NULL, '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdlo001tvd7c8ijg38k1', 'messages.update', NULL, '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdlr001uvd7casve0ju3', 'users.manage', NULL, '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdlt001vvd7cbmfbtb9z', 'settings.manage', NULL, '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdlx001wvd7cmbix4eki', 'audit_logs.read', NULL, '2026-09-28 14:11:09', '2026-09-28 14:11:09');
UNLOCK TABLES;

--
-- Dumping data for table `Expertise`
--
LOCK TABLES `Expertise` WRITE;
INSERT INTO `Expertise` (`id`, `slug`, `name`, `description`, `createdAt`, `updatedAt`) VALUES
('cmulbsdg90001vd7cvzzb7jx5', 'community-development', 'Community Development', NULL, '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdgi0002vd7cji6nmbcg', 'gedsi', 'GEDSI', NULL, '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdgo0003vd7c1skfaqck', 'research-assessment', 'Research & Assessment', NULL, '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdgs0004vd7cxk8e7c6h', 'communication', 'Communication', NULL, '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdgx0005vd7ctw3y8n73', 'conservation', 'Conservation', NULL, '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdh10006vd7c5ndhfxhy', 'policy', 'Policy', NULL, '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdh40007vd7ci69w5njj', 'climate-sustainability', 'Climate & Sustainability', NULL, '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdh70008vd7cwztgcmjx', 'partnership', 'Partnership', NULL, '2026-09-28 14:11:09', '2026-09-28 14:11:09');
UNLOCK TABLES;

--
-- Dumping data for table `ContributionArea`
--
LOCK TABLES `ContributionArea` WRITE;
INSERT INTO `ContributionArea` (`id`, `slug`, `status`, `order`, `createdAt`, `updatedAt`) VALUES
('cmulbsdhd0009vd7cfrl3wkek', 'conservation-climate-sustainability', 'DRAFT', 1, '2026-09-28 14:11:09', '2026-09-28 14:28:40'),
('cmulbsdhx000evd7ch6a7bv03', 'program-strategy', 'DRAFT', 2, '2026-09-28 14:11:09', '2026-09-28 14:28:40'),
('cmulbsdic000jvd7c6vdl5wwh', 'partnership-collaboration', 'DRAFT', 3, '2026-09-28 14:11:09', '2026-09-28 14:28:40'),
('cmulbsdio000ovd7cqpllygv1', 'media-storytelling-campaign', 'DRAFT', 4, '2026-09-28 14:11:09', '2026-09-28 14:28:40'),
('cmulbsdiy000tvd7crbuqdxol', 'community-development', 'DRAFT', 5, '2026-09-28 14:11:09', '2026-09-28 14:28:40'),
('cmulbsdj9000yvd7cg59f1n72', 'research-assessment-knowledge', 'DRAFT', 6, '2026-09-28 14:11:09', '2026-09-28 14:28:40');
UNLOCK TABLES;

--
-- Dumping data for table `ContributionAreaTranslation`
--
LOCK TABLES `ContributionAreaTranslation` WRITE;
INSERT INTO `ContributionAreaTranslation` (`id`, `contributionAreaId`, `language`, `title`, `description`, `imageId`, `createdAt`, `updatedAt`) VALUES
('cmulbsdhk000bvd7coxw9zduj', 'cmulbsdhd0009vd7cfrl3wkek', 'ID', 'Conservation, Climate & Sustainability', NULL, NULL, '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdhs000dvd7c42prjbti', 'cmulbsdhd0009vd7cfrl3wkek', 'EN', 'Conservation, Climate & Sustainability', NULL, NULL, '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdi2000gvd7cc4av6icr', 'cmulbsdhx000evd7ch6a7bv03', 'ID', 'Program & Strategy', NULL, NULL, '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdi8000ivd7cpwvfln8c', 'cmulbsdhx000evd7ch6a7bv03', 'EN', 'Program & Strategy', NULL, NULL, '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdif000lvd7ct8lf01ek', 'cmulbsdic000jvd7c6vdl5wwh', 'ID', 'Partnership & Collaboration', NULL, NULL, '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdii000nvd7c00cdyn79', 'cmulbsdic000jvd7c6vdl5wwh', 'EN', 'Partnership & Collaboration', NULL, NULL, '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdis000qvd7c2oq6usvf', 'cmulbsdio000ovd7cqpllygv1', 'ID', 'Media, Storytelling & Campaign', NULL, NULL, '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdiv000svd7cxygkljk8', 'cmulbsdio000ovd7cqpllygv1', 'EN', 'Media, Storytelling & Campaign', NULL, NULL, '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdj3000vvd7cvtjopy96', 'cmulbsdiy000tvd7crbuqdxol', 'ID', 'Community Development', NULL, NULL, '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdj6000xvd7c3phrhyb9', 'cmulbsdiy000tvd7crbuqdxol', 'EN', 'Community Development', NULL, NULL, '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdjb0010vd7c47ujxov7', 'cmulbsdj9000yvd7cg59f1n72', 'ID', 'Research, Assessment & Knowledge', NULL, NULL, '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdje0012vd7c2760ebz1', 'cmulbsdj9000yvd7cg59f1n72', 'EN', 'Research, Assessment & Knowledge', NULL, NULL, '2026-09-28 14:11:09', '2026-09-28 14:11:09');
UNLOCK TABLES;

--
-- Dumping data for table `Experience`
--
LOCK TABLES `Experience` WRITE;
INSERT INTO `Experience` (`id`, `slug`, `type`, `year`, `location`, `clientName`, `status`, `featured`, `coverMediaId`, `createdById`, `updatedById`, `publishedAt`, `createdAt`, `updatedAt`) VALUES
('cmulbsdn50026vd7c460rm0bo', 'indonesia-digital-ecosystem-assessment-idea', 'EXPERIENCE', 2024, NULL, NULL, 'PUBLISHED', 0, NULL, 'cmulbsdfo0000vd7cz85wyrj2', 'cmulbsdfo0000vd7cz85wyrj2', '2026-09-28 14:11:09', '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdnn002avd7cyimcwi7g', 'perencanaan-pengelolaan-ekowisata-desa', 'EXPERIENCE', 2023, NULL, NULL, 'PUBLISHED', 0, NULL, 'cmulbsdfo0000vd7cz85wyrj2', 'cmulbsdfo0000vd7cz85wyrj2', '2026-09-28 14:11:09', '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdnw002evd7cy64wdqh0', 'assessment-training-for-community-development', 'EXPERIENCE', 2023, NULL, NULL, 'PUBLISHED', 0, NULL, 'cmulbsdfo0000vd7cz85wyrj2', 'cmulbsdfo0000vd7cz85wyrj2', '2026-09-28 14:11:09', '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdo3002ivd7cum0mzx44', 'assessment-pengembangan-batik-ekologis', 'EXPERIENCE', 2022, NULL, NULL, 'PUBLISHED', 0, NULL, 'cmulbsdfo0000vd7cz85wyrj2', 'cmulbsdfo0000vd7cz85wyrj2', '2026-09-28 14:11:09', '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdob002mvd7cwopr04df', 'prototyping-pengelolaan-sampah-pasar-tradisional', 'EXPERIENCE', 2022, NULL, NULL, 'PUBLISHED', 0, NULL, 'cmulbsdfo0000vd7cz85wyrj2', 'cmulbsdfo0000vd7cz85wyrj2', '2026-09-28 14:11:09', '2026-09-28 14:11:09', '2026-09-28 14:11:09');
UNLOCK TABLES;

--
-- Dumping data for table `ExperienceTranslation`
--
LOCK TABLES `ExperienceTranslation` WRITE;
INSERT INTO `ExperienceTranslation` (`id`, `experienceId`, `language`, `title`, `excerpt`, `description`, `methodology`, `impact`, `seoTitle`, `seoDescription`, `createdAt`, `updatedAt`) VALUES
('cmulbsdn50027vd7cp2gzy9rr', 'cmulbsdn50026vd7c460rm0bo', 'ID', 'Indonesia Digital Ecosystem Assessment — IDEA', NULL, NULL, NULL, NULL, NULL, NULL, '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdn50028vd7cfc0rktz9', 'cmulbsdn50026vd7c460rm0bo', 'EN', 'Indonesia Digital Ecosystem Assessment — IDEA', NULL, NULL, NULL, NULL, NULL, NULL, '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdnn002bvd7cfnvh5sq5', 'cmulbsdnn002avd7cyimcwi7g', 'ID', 'Perencanaan Pengelolaan Ekowisata Desa', NULL, NULL, NULL, NULL, NULL, NULL, '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdnn002cvd7c30ia9ec6', 'cmulbsdnn002avd7cyimcwi7g', 'EN', 'Village Ecotourism Management Planning', NULL, NULL, NULL, NULL, NULL, NULL, '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdnx002fvd7czw7x57si', 'cmulbsdnw002evd7cy64wdqh0', 'ID', 'Assessment Training for Community Development', NULL, NULL, NULL, NULL, NULL, NULL, '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdnx002gvd7cp2gjxfyr', 'cmulbsdnw002evd7cy64wdqh0', 'EN', 'Assessment Training for Community Development', NULL, NULL, NULL, NULL, NULL, NULL, '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdo3002jvd7cdrd3oluu', 'cmulbsdo3002ivd7cum0mzx44', 'ID', 'Assessment Pengembangan Batik Ekologis', NULL, NULL, NULL, NULL, NULL, NULL, '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdo3002kvd7ckuy6bolb', 'cmulbsdo3002ivd7cum0mzx44', 'EN', 'Ecological Batik Development Assessment', NULL, NULL, NULL, NULL, NULL, NULL, '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdob002nvd7cfdl9xqxa', 'cmulbsdob002mvd7cwopr04df', 'ID', 'Prototyping Pengelolaan Sampah Pasar Tradisional', NULL, NULL, NULL, NULL, NULL, NULL, '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdob002ovd7cc3nf3r7d', 'cmulbsdob002mvd7cwopr04df', 'EN', 'Traditional Market Waste Management Prototyping', NULL, NULL, NULL, NULL, NULL, NULL, '2026-09-28 14:11:09', '2026-09-28 14:11:09');
UNLOCK TABLES;

--
-- Dumping data for table `Person`
--
LOCK TABLES `Person` WRITE;
INSERT INTO `Person` (`id`, `slug`, `imageId`, `status`, `order`, `createdById`, `updatedById`, `createdAt`, `updatedAt`) VALUES
('cmulbsdok002qvd7czapwonsv', 'sendi-kenia-savitri', NULL, 'PUBLISHED', 1, 'cmulbsdfo0000vd7cz85wyrj2', 'cmulbsdfo0000vd7cz85wyrj2', '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdov002uvd7cy6yhnmbe', 'ade-afrilian-saputra', NULL, 'PUBLISHED', 2, 'cmulbsdfo0000vd7cz85wyrj2', 'cmulbsdfo0000vd7cz85wyrj2', '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdp5002yvd7cmhmbzmie', 'anna-agustina', NULL, 'PUBLISHED', 3, 'cmulbsdfo0000vd7cz85wyrj2', 'cmulbsdfo0000vd7cz85wyrj2', '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdpb0032vd7cnh6ihu1c', 'yando-zakaria', NULL, 'PUBLISHED', 4, 'cmulbsdfo0000vd7cz85wyrj2', 'cmulbsdfo0000vd7cz85wyrj2', '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdph0036vd7cco1f6ajd', 'sekar-mira-c-herandarudewi', NULL, 'PUBLISHED', 5, 'cmulbsdfo0000vd7cz85wyrj2', 'cmulbsdfo0000vd7cz85wyrj2', '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdpo003avd7cvvutus94', 'arya-kusumo-harwinanto', NULL, 'PUBLISHED', 6, 'cmulbsdfo0000vd7cz85wyrj2', 'cmulbsdfo0000vd7cz85wyrj2', '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdpt003evd7ca2ds16sj', 'shaniya-utamidita', NULL, 'PUBLISHED', 7, 'cmulbsdfo0000vd7cz85wyrj2', 'cmulbsdfo0000vd7cz85wyrj2', '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdpz003ivd7chxohezxi', 'suluh-gembyeng-ciptadi', NULL, 'PUBLISHED', 8, 'cmulbsdfo0000vd7cz85wyrj2', 'cmulbsdfo0000vd7cz85wyrj2', '2026-09-28 14:11:09', '2026-09-28 14:11:09');
UNLOCK TABLES;

--
-- Dumping data for table `PersonTranslation`
--
LOCK TABLES `PersonTranslation` WRITE;
INSERT INTO `PersonTranslation` (`id`, `personId`, `language`, `name`, `degree`, `role`, `biography`, `createdAt`, `updatedAt`) VALUES
('cmulbsdok002rvd7cvdf68t7o', 'cmulbsdok002qvd7czapwonsv', 'ID', 'Sendi Kenia Savitri, M.Si.', 'M.Si.', NULL, NULL, '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdok002svd7ci6k13nyz', 'cmulbsdok002qvd7czapwonsv', 'EN', 'Sendi Kenia Savitri, M.Si.', 'M.Si.', NULL, NULL, '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdov002vvd7cxq0s7rl9', 'cmulbsdov002uvd7cy6yhnmbe', 'ID', 'Ade Afrilian Saputra, M.M.Sus.', 'M.M.Sus.', NULL, NULL, '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdov002wvd7c2db4yed1', 'cmulbsdov002uvd7cy6yhnmbe', 'EN', 'Ade Afrilian Saputra, M.M.Sus.', 'M.M.Sus.', NULL, NULL, '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdp5002zvd7cwvliyv44', 'cmulbsdp5002yvd7cmhmbzmie', 'ID', 'Anna Agustina, Ph.D.', 'Ph.D.', NULL, NULL, '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdp50030vd7cvn4ygfkz', 'cmulbsdp5002yvd7cmhmbzmie', 'EN', 'Anna Agustina, Ph.D.', 'Ph.D.', NULL, NULL, '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdpb0033vd7cbx4n8we3', 'cmulbsdpb0032vd7cnh6ihu1c', 'ID', 'Yando Zakaria', NULL, NULL, NULL, '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdpc0034vd7c8kotac1s', 'cmulbsdpb0032vd7cnh6ihu1c', 'EN', 'Yando Zakaria', NULL, NULL, NULL, '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdph0037vd7chljwe8ri', 'cmulbsdph0036vd7cco1f6ajd', 'ID', 'Sekar Mira C. Herandarudewi, M.Si.', 'M.Si.', NULL, NULL, '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdph0038vd7c9md1i1y8', 'cmulbsdph0036vd7cco1f6ajd', 'EN', 'Sekar Mira C. Herandarudewi, M.Si.', 'M.Si.', NULL, NULL, '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdpo003bvd7cqo419q9g', 'cmulbsdpo003avd7cvvutus94', 'ID', 'Arya Kusumo Harwinanto, S.I.Kom.', 'S.I.Kom.', NULL, NULL, '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdpo003cvd7ckgykaomb', 'cmulbsdpo003avd7cvvutus94', 'EN', 'Arya Kusumo Harwinanto, S.I.Kom.', 'S.I.Kom.', NULL, NULL, '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdpt003fvd7cxbw6hf5s', 'cmulbsdpt003evd7ca2ds16sj', 'ID', 'Shaniya Utamidita, M.S.', 'M.S.', NULL, NULL, '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdpt003gvd7cj2u61cou', 'cmulbsdpt003evd7ca2ds16sj', 'EN', 'Shaniya Utamidita, M.S.', 'M.S.', NULL, NULL, '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdpz003jvd7cz52khgyl', 'cmulbsdpz003ivd7chxohezxi', 'ID', 'Suluh Gembyeng Ciptadi, M.Si.', 'M.Si.', NULL, NULL, '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdpz003kvd7cbqyetn3q', 'cmulbsdpz003ivd7chxohezxi', 'EN', 'Suluh Gembyeng Ciptadi, M.Si.', 'M.Si.', NULL, NULL, '2026-09-28 14:11:09', '2026-09-28 14:11:09');
UNLOCK TABLES;

--
-- Dumping data for table `Media`
--
LOCK TABLES `Media` WRITE;
INSERT INTO `Media` (`id`, `type`, `filename`, `originalName`, `mimeType`, `size`, `width`, `height`, `storageKey`, `url`, `altText`, `caption`, `attribution`, `uploadedById`, `createdAt`, `updatedAt`) VALUES
('cmulc495g0003vdhgkrtgef0l', 'IMAGE', '1790605223743-whatsapp-image-2026-08-27-at-13-16-59-18496e59.jpeg', 'WhatsApp Image 2026-08-27 at 13.16.59.jpeg', 'image/jpeg', 255299, NULL, NULL, '1790605223743-whatsapp-image-2026-08-27-at-13-16-59-18496e59.jpeg', '/uploads/1790605223743-whatsapp-image-2026-08-27-at-13-16-59-18496e59.jpeg', NULL, NULL, NULL, 'cmulbsdfo0000vd7cz85wyrj2', '2026-09-28 14:20:23', '2026-09-28 14:20:23');
UNLOCK TABLES;

--
-- Dumping data for table `SiteSetting`
--
LOCK TABLES `SiteSetting` WRITE;
INSERT INTO `SiteSetting` (`id`, `key`, `value`, `language`, `description`, `updatedAt`, `createdAt`) VALUES
('cmulbsdjh0013vd7cd50p30if', 'site.name', NULL, NULL, 'Organization name', '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdjo0014vd7c4zuobs0e', 'site.tagline', NULL, NULL, 'Organization tagline', '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdjr0015vd7co1dejyyu', 'site.description', NULL, NULL, 'Organization description', '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdjt0016vd7ccfd2kdk9', 'site.email', NULL, NULL, 'Contact email', '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdjv0017vd7cydddvv4z', 'site.phone', NULL, NULL, 'Contact phone', '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdjy0018vd7cgeobka7t', 'site.address', NULL, NULL, 'Organization address', '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdk30019vd7c9hxu61wm', 'site.instagram', NULL, NULL, 'Instagram handle', '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdk6001avd7ci15pffcl', 'site.linkedin', NULL, NULL, 'LinkedIn URL', '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdk8001bvd7c7oak7q82', 'site.website', NULL, NULL, 'Organization website URL', '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdka001cvd7c9ec2g0yj', 'seo.defaultTitle', NULL, NULL, 'Default SEO page title', '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdkd001dvd7cr9s2bbtm', 'seo.defaultDescription', NULL, NULL, 'Default SEO meta description', '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdkf001evd7c43taukbn', 'seo.defaultOgImage', NULL, NULL, 'Default OG image media ID', '2026-09-28 14:11:09', '2026-09-28 14:11:09');
UNLOCK TABLES;

--
-- Dumping data for table `NavigationItem`
--
LOCK TABLES `NavigationItem` WRITE;
INSERT INTO `NavigationItem` (`id`, `label`, `url`, `language`, `parentId`, `order`, `visible`, `openInNewTab`, `createdAt`, `updatedAt`) VALUES
('cmulbsdm3001xvd7cobx5c2eh', 'Tentang', '/tentang', 'ID', NULL, 1, 1, 0, '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdm7001yvd7ct41trrd7', 'Inisiatif', '/inisiatif', 'ID', NULL, 2, 1, 0, '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdma001zvd7ck3rh5g6m', 'Pengetahuan', '/pengetahuan', 'ID', NULL, 3, 1, 0, '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdme0020vd7cpb0ahqsh', 'Kolaborasi', '/kolaborasi', 'ID', NULL, 4, 1, 0, '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdmh0021vd7cd05qlbu1', 'About', '/about', 'EN', NULL, 1, 1, 0, '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdml0022vd7cuh6st7p2', 'Initiatives', '/initiatives', 'EN', NULL, 2, 1, 0, '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdmo0023vd7cm1g4z8ca', 'Knowledge', '/knowledge', 'EN', NULL, 3, 1, 0, '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdms0024vd7cmh9ukxa6', 'Collaboration', '/collaboration', 'EN', NULL, 4, 1, 0, '2026-09-28 14:11:09', '2026-09-28 14:11:09');
UNLOCK TABLES;

SET FOREIGN_KEY_CHECKS = 1;

-- =========================================================================
-- END OF DUMP
-- =========================================================================
