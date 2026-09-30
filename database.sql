-- =========================================================================
-- ANTRABUMI 2026 — Complete Database Export (DDL Schema + Initial Data)
-- Generated: 2026-09-30T10:15:07.809Z
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
    `category` VARCHAR(191) NULL,
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
    `type` ENUM('ARTICLE', 'RESEARCH_PUBLICATION', 'STORY') NOT NULL,
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
('cmulbsdfo0000vd7cz85wyrj2', 'ANTRABUMI Admin', 'admin@antrabumi.org', '$2b$12$x56VSUDk08iCUkPNzm41seYoomXgTwsk1p/cHz74ubvoUVy9L6XYO', 'SUPER_ADMIN', 'ACTIVE', NULL, '2026-09-30 09:21:23', '2026-09-28 14:11:09', '2026-09-30 09:21:23');
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
INSERT INTO `Experience` (`id`, `slug`, `type`, `year`, `category`, `location`, `clientName`, `status`, `featured`, `coverMediaId`, `createdById`, `updatedById`, `publishedAt`, `createdAt`, `updatedAt`) VALUES
('cmulbsdn50026vd7c460rm0bo', 'indonesia-digital-ecosystem-assessment-idea', 'EXPERIENCE', 2024, '', '', '', 'PUBLISHED', 0, 'cmumjdtkk0005vd7svhd3ojzf', 'cmulbsdfo0000vd7cz85wyrj2', 'cmulbsdfo0000vd7cz85wyrj2', '2026-09-29 10:31:53', '2026-09-28 14:11:09', '2026-09-29 10:31:53'),
('cmulbsdnn002avd7cyimcwi7g', 'perencanaan-pengelolaan-ekowisata-desa', 'EXPERIENCE', 2023, NULL, NULL, NULL, 'PUBLISHED', 0, NULL, 'cmulbsdfo0000vd7cz85wyrj2', 'cmulbsdfo0000vd7cz85wyrj2', '2026-09-28 14:11:09', '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdnw002evd7cy64wdqh0', 'assessment-training-for-community-development', 'EXPERIENCE', 2023, NULL, NULL, NULL, 'PUBLISHED', 0, NULL, 'cmulbsdfo0000vd7cz85wyrj2', 'cmulbsdfo0000vd7cz85wyrj2', '2026-09-28 14:11:09', '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdo3002ivd7cum0mzx44', 'assessment-pengembangan-batik-ekologis', 'EXPERIENCE', 2022, NULL, NULL, NULL, 'PUBLISHED', 0, NULL, 'cmulbsdfo0000vd7cz85wyrj2', 'cmulbsdfo0000vd7cz85wyrj2', '2026-09-28 14:11:09', '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulbsdob002mvd7cwopr04df', 'prototyping-pengelolaan-sampah-pasar-tradisional', 'EXPERIENCE', 2022, NULL, NULL, NULL, 'PUBLISHED', 0, NULL, 'cmulbsdfo0000vd7cz85wyrj2', 'cmulbsdfo0000vd7cz85wyrj2', '2026-09-28 14:11:09', '2026-09-28 14:11:09', '2026-09-28 14:11:09');
UNLOCK TABLES;

--
-- Dumping data for table `ExperienceTranslation`
--
LOCK TABLES `ExperienceTranslation` WRITE;
INSERT INTO `ExperienceTranslation` (`id`, `experienceId`, `language`, `title`, `excerpt`, `description`, `methodology`, `impact`, `seoTitle`, `seoDescription`, `createdAt`, `updatedAt`) VALUES
('cmulbsdn50027vd7cp2gzy9rr', 'cmulbsdn50026vd7c460rm0bo', 'ID', 'Indonesia Digital Ecosystem Assessment — IDEA', '', '<p></p>', NULL, NULL, NULL, NULL, '2026-09-28 14:11:09', '2026-09-29 10:31:53'),
('cmulbsdn50028vd7cfc0rktz9', 'cmulbsdn50026vd7c460rm0bo', 'EN', 'Indonesia Digital Ecosystem Assessment — IDEA', '', '<p></p>', NULL, NULL, NULL, NULL, '2026-09-28 14:11:09', '2026-09-29 10:31:53'),
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
('cmulbsdok002qvd7czapwonsv', 'sendi-kenia-savitri', 'cmumefqgn0001vdvc1clpe6px', 'PUBLISHED', 1, 'cmulbsdfo0000vd7cz85wyrj2', 'cmulbsdfo0000vd7cz85wyrj2', '2026-09-28 14:11:09', '2026-09-29 10:37:21'),
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
('cmulbsdok002rvd7cvdf68t7o', 'cmulbsdok002qvd7czapwonsv', 'ID', 'Sendi Kenia Savitri, M.Si.', 'M.Si.', 'ketua', 'Download the perfect belitung pictures. Find over 50 of the best free belitung images. Free for commercial use ✓ No attribution required ✓ Copyright-free.', '2026-09-28 14:11:09', '2026-09-29 10:37:21'),
('cmulbsdok002svd7ci6k13nyz', 'cmulbsdok002qvd7czapwonsv', 'EN', 'Sendi Kenia Savitri, M.Si.', 'M.Si.', '', '', '2026-09-28 14:11:09', '2026-09-29 10:37:21'),
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
-- Dumping data for table `Knowledge`
--
LOCK TABLES `Knowledge` WRITE;
INSERT INTO `Knowledge` (`id`, `slug`, `type`, `coverMediaId`, `status`, `featured`, `authorName`, `publicationDate`, `createdById`, `updatedById`, `publishedAt`, `createdAt`, `updatedAt`) VALUES
('cmumcj077000jvdhgonpe10pq', 'asdada', 'STORY', 'cmumcitb1000fvdhghtb22vp5', 'PUBLISHED', 0, NULL, NULL, 'cmulbsdfo0000vd7cz85wyrj2', 'cmulbsdfo0000vd7cz85wyrj2', '2026-09-29 07:19:59', '2026-09-29 07:19:38', '2026-09-29 07:20:29'),
('cmumjzzc30017vd7slefowdqn', 'pengembangan-sosial-media-di-belitung', 'ARTICLE', NULL, 'PUBLISHED', 0, NULL, '2026-09-29 00:00:00', 'cmulbsdfo0000vd7cz85wyrj2', 'cmulbsdfo0000vd7cz85wyrj2', '2026-09-29 10:50:00', '2026-09-29 10:48:47', '2026-09-29 10:50:00');
UNLOCK TABLES;

--
-- Dumping data for table `KnowledgeTranslation`
--
LOCK TABLES `KnowledgeTranslation` WRITE;
INSERT INTO `KnowledgeTranslation` (`id`, `knowledgeId`, `language`, `title`, `excerpt`, `content`, `seoTitle`, `seoDescription`, `createdAt`, `updatedAt`) VALUES
('cmumcj078000kvdhglr0o1mfc', 'cmumcj077000jvdhgonpe10pq', 'ID', 'asdada', 'asdadl ajdajd;an', '<p>asknfaljfbakfna;kjfn</p>', NULL, NULL, '2026-09-29 07:19:38', '2026-09-29 07:20:29'),
('cmumck3js000svdhg7g9aplt0', 'cmumcj077000jvdhgonpe10pq', 'EN', '', '', '<p></p>', NULL, NULL, '2026-09-29 07:20:29', '2026-09-29 07:20:29'),
('cmumjzzc30018vd7srpvl28cu', 'cmumjzzc30017vd7slefowdqn', 'ID', 'pengembangan sosial media di belitung', 'Connecting Knowledge, Nature, and Communities.\r\nKami bekerja di ruang kolaborasi yang menghubungkan pengetahuan, alam, dan masyarakat untuk menciptakan perubahan yang relevan dan berkelanjutan.\r\n\r\nTentang ANTRABUMI →\r\nMari Berkolaborasi\r\nBelitung, Indonesia', '<h2><strong>Persoalan tidak pernah berdiri sendiri.</strong></h2><p>Banyak persoalan pembangunan dan lingkungan berada di antara pengetahuan, alam, kebijakan, dan kehidupan masyarakat. ANTRABUMI hadir untuk bekerja di ruang tersebut—menghubungkan berbagai perspektif, mempertemukan pengetahuan dengan pengalaman di lapangan, dan membangun proses kolaboratif untuk menemukan jalan yang relevan.</p>', NULL, NULL, '2026-09-29 10:48:47', '2026-09-29 10:49:48'),
('cmumk1an1001ivd7s8qjfmw3e', 'cmumjzzc30017vd7slefowdqn', 'EN', '', '', '<p></p>', NULL, NULL, '2026-09-29 10:49:48', '2026-09-29 10:49:48');
UNLOCK TABLES;

--
-- Dumping data for table `KnowledgeDownload`
--
LOCK TABLES `KnowledgeDownload` WRITE;
INSERT INTO `KnowledgeDownload` (`id`, `knowledgeId`, `mediaId`, `label`, `order`) VALUES
('cmunr59r0000zvdnged5tlauo', 'cmumcj077000jvdhgonpe10pq', 'cmunr59h9000vvdngbi9ahldf', NULL, 0);
UNLOCK TABLES;

--
-- Dumping data for table `Media`
--
LOCK TABLES `Media` WRITE;
INSERT INTO `Media` (`id`, `type`, `filename`, `originalName`, `mimeType`, `size`, `width`, `height`, `storageKey`, `url`, `altText`, `caption`, `attribution`, `uploadedById`, `createdAt`, `updatedAt`) VALUES
('cmulc495g0003vdhgkrtgef0l', 'IMAGE', '1790605223743-whatsapp-image-2026-08-27-at-13-16-59-18496e59.jpeg', 'WhatsApp Image 2026-08-27 at 13.16.59.jpeg', 'image/jpeg', 255299, NULL, NULL, '1790605223743-whatsapp-image-2026-08-27-at-13-16-59-18496e59.jpeg', '/uploads/1790605223743-whatsapp-image-2026-08-27-at-13-16-59-18496e59.jpeg', NULL, NULL, NULL, 'cmulbsdfo0000vd7cz85wyrj2', '2026-09-28 14:20:23', '2026-09-28 14:20:23'),
('cmulealpk0007vdhgie2zdm6s', 'IMAGE', '1790608879204-f10f7e355118ff6de40e8eb4f0d57896-433c0650.jpg', 'f10f7e355118ff6de40e8eb4f0d57896.jpg', 'image/jpeg', 43230, NULL, NULL, '1790608879204-f10f7e355118ff6de40e8eb4f0d57896-433c0650.jpg', '/uploads/1790608879204-f10f7e355118ff6de40e8eb4f0d57896-433c0650.jpg', NULL, NULL, NULL, 'cmulbsdfo0000vd7cz85wyrj2', '2026-09-28 15:21:19', '2026-09-28 15:21:19'),
('cmumcitb1000fvdhghtb22vp5', 'IMAGE', '1790666369240-f10f7e355118ff6de40e8eb4f0d57896-f04e5c5b.jpg', 'f10f7e355118ff6de40e8eb4f0d57896.jpg', 'image/jpeg', 43230, NULL, NULL, '1790666369240-f10f7e355118ff6de40e8eb4f0d57896-f04e5c5b.jpg', '/uploads/1790666369240-f10f7e355118ff6de40e8eb4f0d57896-f04e5c5b.jpg', NULL, NULL, NULL, 'cmulbsdfo0000vd7cz85wyrj2', '2026-09-29 07:19:29', '2026-09-29 07:19:29'),
('cmumefqgn0001vdvc1clpe6px', 'IMAGE', '1790669584819-whatsapp-image-2026-08-07-at-22-04-46-e891f1fc.jpeg', 'WhatsApp Image 2026-08-07 at 22.04.46.jpeg', 'image/jpeg', 85647, NULL, NULL, '1790669584819-whatsapp-image-2026-08-07-at-22-04-46-e891f1fc.jpeg', '/uploads/1790669584819-whatsapp-image-2026-08-07-at-22-04-46-e891f1fc.jpeg', NULL, NULL, NULL, 'cmulbsdfo0000vd7cz85wyrj2', '2026-09-29 08:13:04', '2026-09-29 08:13:04'),
('cmumjdtkk0005vd7svhd3ojzf', 'IMAGE', '1790677893129-chatgpt-image-aug-14-2026-10_02_51-pm-1--ebf2a0a4.png', 'ChatGPT Image Aug 14, 2026, 10_02_51 PM (1).png', 'image/png', 54833, NULL, NULL, '1790677893129-chatgpt-image-aug-14-2026-10_02_51-pm-1--ebf2a0a4.png', '/uploads/1790677893129-chatgpt-image-aug-14-2026-10_02_51-pm-1--ebf2a0a4.png', NULL, NULL, NULL, 'cmulbsdfo0000vd7cz85wyrj2', '2026-09-29 10:31:33', '2026-09-29 10:31:33'),
('cmumjqlsn000vvd7s6gwjvdhm', 'IMAGE', '1790678490062-dpkxyk-9-lhstususqkrjx1minfi2hpd3v9bef-2nhejbidkih-0e432dc4.jpg', 'DpKxYk-9-lHSTususqKRjX1minFi2Hpd3V9BeF-2NHejbiDKIHZ7vmR_KRGYrXrp6WFphW9AiPnSdjG7cwKDEr62CluljuwrRLP_WRNC2JLkGSckV2hZifXrpleurqiCipPRsrZG8Q8ibiYvdUeQng9m50IlvvZM719T0_kOefRMMU9I1M4mMYQ4Krj3g4C', 'image/jpeg', 123490, NULL, NULL, '1790678490062-dpkxyk-9-lhstususqkrjx1minfi2hpd3v9bef-2nhejbidkih-0e432dc4.jpg', '/uploads/1790678490062-dpkxyk-9-lhstususqkrjx1minfi2hpd3v9bef-2nhejbidkih-0e432dc4.jpg', NULL, NULL, NULL, 'cmulbsdfo0000vd7cz85wyrj2', '2026-09-29 10:41:30', '2026-09-29 10:41:30'),
('cmumjr03x000zvd7s7f2wzu6p', 'IMAGE', '1790678508612-seberang-9113a578.jpg', 'seberang.jpg', 'image/jpeg', 1130694, NULL, NULL, '1790678508612-seberang-9113a578.jpg', '/uploads/1790678508612-seberang-9113a578.jpg', NULL, NULL, NULL, 'cmulbsdfo0000vd7cz85wyrj2', '2026-09-29 10:41:48', '2026-09-29 10:41:48'),
('cmumk07qe001cvd7s6qwsgq41', 'IMAGE', '1790678938209-rafale-8b98aec6.jpg', 'Rafale.jpg', 'image/jpeg', 18701, NULL, NULL, '1790678938209-rafale-8b98aec6.jpg', '/uploads/1790678938209-rafale-8b98aec6.jpg', NULL, NULL, NULL, 'cmulbsdfo0000vd7cz85wyrj2', '2026-09-29 10:48:58', '2026-09-29 10:48:58'),
('cmunr59h9000vvdngbi9ahldf', 'DOCUMENT', '1790751396949-buku-jurnal-harian-kebiasaan-anak-hebat-indonesia--9e20f1f0.pdf', 'Buku-Jurnal-Harian-Kebiasaan-Anak-Hebat-Indonesia-Lembar-Kerja-Pembelajaran-Mendalam-Hijau-Ilustrasi-Al.pdf', 'application/pdf', 9835229, NULL, NULL, '1790751396949-buku-jurnal-harian-kebiasaan-anak-hebat-indonesia--9e20f1f0.pdf', '/uploads/1790751396949-buku-jurnal-harian-kebiasaan-anak-hebat-indonesia--9e20f1f0.pdf', NULL, NULL, NULL, 'cmulbsdfo0000vd7cz85wyrj2', '2026-09-30 06:56:37', '2026-09-30 06:56:37');
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
('cmulbsdkf001evd7c43taukbn', 'seo.defaultOgImage', NULL, NULL, 'Default OG image media ID', '2026-09-28 14:11:09', '2026-09-28 14:11:09'),
('cmulebcju000avdhgbsdbpjke', 'home_hero_slider_config', '{\"autoplay\":true,\"intervalMs\":4000,\"transitionEffect\":\"slide\",\"pauseOnHover\":false}', NULL, NULL, '2026-09-29 10:41:54', '2026-09-28 15:21:53'),
('cmulebcjv000bvdhgm5s3o02p', 'home_hero_slides', '[{\"id\":\"slide-1\",\"tagline\":\"ANTRABUMI — Organisasi Independen\",\"taglineEn\":\"ANTRABUMI — Independent Organization\",\"title\":\"Connecting Knowledge, Nature, & Communities.\",\"titleEn\":\"Connecting Knowledge, Nature, & Communities.\",\"subtitle\":\"Organisasi independen yang bekerja di persimpangan pengetahuan, alam, dan komunitas — menghubungkan riset, pengalaman lapangan, dan kolaborasi untuk perubahan yang bermakna.\",\"subtitleEn\":\"An independent organization working at the intersection of knowledge, nature, and communities — connecting research, field experience, and collaboration for meaningful change.\",\"primaryCtaText\":\"Hubungi Kami\",\"primaryCtaTextEn\":\"Contact Us\",\"primaryCtaLink\":\"/kolaborasi#kontak\",\"secondaryCtaText\":\"Tentang ANTRABUMI\",\"secondaryCtaTextEn\":\"About ANTRABUMI\",\"secondaryCtaLink\":\"/tentang\",\"imageUrl\":\"https://images.unsplash.com/photo-1789700537304-c291bfc38ad9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0fHx8ZW58MHx8fHx8\",\"order\":1,\"isActive\":true},{\"id\":\"slide-2\",\"tagline\":\"Pendekatan Kami — 01 Listen to 05 Learn\",\"taglineEn\":\"Our Framework — 01 Listen to 05 Learn\",\"title\":\"Menjembatani Riset & Tindakan Nyata di Lapangan.\",\"titleEn\":\"Bridging Research & Real Action in the Field.\",\"subtitle\":\"Setiap kolaborasi dimulai dari memahami konteks, bukan menawarkan solusi instan. Kami mempertemukan bukti ilmiah dengan kearifan komunitas lokal.\",\"subtitleEn\":\"Every collaboration begins with understanding context, not offering instant solutions. We bridge scientific evidence with local community knowledge.\",\"primaryCtaText\":\"Lihat Inisiatif\",\"primaryCtaTextEn\":\"View Initiatives\",\"primaryCtaLink\":\"/inisiatif\",\"secondaryCtaText\":\"Kerangka Kerja\",\"secondaryCtaTextEn\":\"Our Framework\",\"secondaryCtaLink\":\"/tentang#framework\",\"imageUrl\":\"/uploads/1790678490062-dpkxyk-9-lhstususqkrjx1minfi2hpd3v9bef-2nhejbidkih-0e432dc4.jpg\",\"order\":2,\"isActive\":true},{\"id\":\"slide-3\",\"tagline\":\"Pusat Pengetahuan — Knowledge Hub\",\"taglineEn\":\"Knowledge Hub — Evidence-Based Learning\",\"title\":\"Mendokumentasikan Pembelajaran untuk Keberlanjutan.\",\"titleEn\":\"Documenting Lessons for Long-Term Sustainability.\",\"subtitle\":\"Publikasi, laporan asesmen lapangan, dan artikel mendalam untuk mendukung pengambilan keputusan yang lebih inklusif dan berkelanjutan.\",\"subtitleEn\":\"Publications, field assessments, and in-depth articles supporting more inclusive and sustainable decision-making.\",\"primaryCtaText\":\"Eksplorasi Pengetahuan\",\"primaryCtaTextEn\":\"Explore Knowledge\",\"primaryCtaLink\":\"/pengetahuan\",\"secondaryCtaText\":\"Bermitra dengan Kami\",\"secondaryCtaTextEn\":\"Partner with Us\",\"secondaryCtaLink\":\"/kolaborasi\",\"imageUrl\":\"/uploads/1790678508612-seberang-9113a578.jpg\",\"order\":3,\"isActive\":true}]', NULL, NULL, '2026-09-29 10:41:54', '2026-09-28 15:21:53'),
('cmumj9zmu0001vd7sb185u1wg', 'home_sections_content', '{\"whyUs\":{\"badge\":\"01 — MENGAPA KAMI HADIR\",\"badgeEn\":\"01 — WHY WE EXIST\",\"title\":\"Perubahan yang berarti lahir ketika pengetahuan, alam, dan masyarakat saling terhubung.\",\"titleEn\":\"Change becomes meaningful when knowledge, nature, and communities are connected.\",\"leadText\":\"Indonesia memiliki kekayaan alam, pengetahuan lokal, dan masyarakat yang terus mencari cara untuk beradaptasi. Namun, berbagai tantangan lingkungan dan pembangunan masih sering ditangani secara terpisah.\\n\\nPengetahuan tidak selalu menjadi aksi. Pengalaman di lapangan belum selalu menjadi pembelajaran. Dan solusi tidak selalu tumbuh bersama mereka yang akan menjalaninya.\",\"leadTextEn\":\"Indonesia possesses rich nature, local knowledge, and communities continuously seeking ways to adapt. However, environmental and developmental challenges are still often addressed in silos.\\n\\nKnowledge does not always translate into action. Field experiences do not always become learning. And solutions do not always grow with those who will live them.\",\"bridgeTitle\":\"ANTRABUMI Hadir untuk menjembatani ruang tersebut.\",\"bridgeTitleEn\":\"ANTRABUMI Exists to Bridge That Space.\",\"bridgeText\":\"Kami menghubungkan riset, pengalaman, pengetahuan lokal, dan kolaborasi untuk memahami persoalan, mengembangkan solusi, dan mendukung perubahan yang relevan bagi manusia dan alam.\",\"bridgeTextEn\":\"We connect research, field experience, local knowledge, and cross-sector collaboration to understand issues holistically, develop contextual solutions, and support meaningful change for people and nature.\",\"imageUrl\":\"https://zjglidcehtsqqqhbdxyp.supabase.co/storage/v1/object/public/atourin/images/wilayah/bangka-belitung-1583143777.jpg?x-image-process=image/resize,p_100,limit_1/imageslim\"},\"about\":{\"badge\":\"02 — TENTANG ANTRABUMI\",\"badgeEn\":\"02 — ABOUT ANTRABUMI\",\"title\":\"Menghubungkan pengetahuan menjadi aksi, dan kolaborasi menjadi perubahan.\",\"titleEn\":\"Connecting knowledge into action, and collaboration into change.\",\"description\":\"ANTRABUMI adalah organisasi independen yang bekerja di persimpangan pengetahuan, alam, dan masyarakat. Kami mempertemukan pengalaman lapangan, riset, pengetahuan lokal, dan berbagai perspektif untuk memahami persoalan secara lebih utuh dan mengembangkan pendekatan yang kontekstual.\",\"descriptionEn\":\"ANTRABUMI is an independent organization working at the intersection of knowledge, nature, and communities. We bring together field experience, research, local knowledge, and diverse perspectives to understand challenges holistically and develop contextual approaches.\",\"secondaryText\":\"Kami bekerja bersama komunitas, pemerintah, akademisi, organisasi masyarakat sipil, sektor swasta, dan mitra pembangunan untuk membangun perubahan yang lebih terhubung dan berkelanjutan.\",\"secondaryTextEn\":\"We collaborate with communities, government, academia, civil society, the private sector, and development partners to foster more connected and sustainable change.\",\"diagramUrl\":\"/images/home/pillars-diagram.svg\"},\"pillars\":[{\"id\":\"01\",\"key\":\"KNOWLEDGE\",\"label\":\"Pengetahuan\",\"labelEn\":\"Knowledge\",\"description\":\"Riset, pembelajaran dari lapangan, dan integrasi pengetahuan lokal untuk melahirkan pendekatan yang kontekstual dan bermakna.\",\"descriptionEn\":\"Research, field learning, and integration of local knowledge to produce contextual and meaningful approaches.\"},{\"id\":\"02\",\"key\":\"NATURE\",\"label\":\"Alam\",\"labelEn\":\"Nature\",\"description\":\"Konservasi, keberlanjutan ekologis, dan mitigasi iklim yang berbasiskan pemahaman ekosistem nyata di lapangan.\",\"descriptionEn\":\"Conservation, ecological sustainability, and climate mitigation grounded in real ecosystem understanding from the field.\"},{\"id\":\"03\",\"key\":\"COMMUNITIES\",\"label\":\"Masyarakat / Komunitas\",\"labelEn\":\"Communities\",\"description\":\"Pengembangan komunitas, inklusi sosial (GEDSI), dan kemitraan kolaboratif lintas sektor yang berpijak pada konteks lokal.\",\"descriptionEn\":\"Community development, social inclusion (GEDSI), and collaborative cross-sector partnerships rooted in local context.\"}],\"growth\":{\"badge\":\"03 — BAGAIMANA KAMI BERTUMBUH\",\"badgeEn\":\"03 — HOW WE GROW\",\"title\":\"Setiap langkah memperluas pengalaman. Setiap pengalaman membentuk cara kami bekerja.\",\"titleEn\":\"Every step expands experience. Every experience shapes how we work.\",\"leadText\":\"ANTRABUMI tumbuh dari perjalanan yang dimulai pada tahun 2021. Berbagai pengalaman di lapangan, kolaborasi lintas sektor, dan proses belajar bersama menjadi fondasi yang membentuk identitas organisasi ini.\\n\\nHari ini, perjalanan tersebut terus berlanjut melalui ANTRABUMI sebagai ruang kolaborasi yang menghubungkan pengetahuan, alam, dan masyarakat untuk menciptakan perubahan yang relevan dan berkelanjutan.\",\"leadTextEn\":\"ANTRABUMI grew from a journey that began in 2021. Diverse field experiences, cross-sector collaborations, and mutual learning have become the foundation shaping this organization\'s identity.\",\"timeline\":[{\"year\":\"2021\",\"label\":\"Awal Perjalanan\",\"labelEn\":\"The Beginning\",\"description\":\"PT Antar Bumi Sahawahita didirikan sebagai awal perjalanan membangun pengalaman dan kolaborasi di bidang lingkungan dan pembangunan berkelanjutan.\",\"descriptionEn\":\"PT Antar Bumi Sahawahita was established as the beginning of building field experience and collaboration.\"},{\"year\":\"2022\",\"label\":\"Belajar dari Lapangan\",\"labelEn\":\"Learning from the Field\",\"description\":\"Memperluas pengalaman melalui penelitian, pendampingan masyarakat, dan berbagai inisiatif konservasi di lapangan.\",\"descriptionEn\":\"Expanding experience through research, community mentoring, and grassroots conservation initiatives.\"},{\"year\":\"2023\",\"label\":\"Memperluas Kolaborasi\",\"labelEn\":\"Expanding Collaboration\",\"description\":\"Membangun kolaborasi bersama komunitas, pemerintah, akademisi, sektor swasta, dan organisasi masyarakat sipil.\",\"descriptionEn\":\"Forging collaborations with communities, government, academia, private sector, and civil society.\"},{\"year\":\"2024\",\"label\":\"Memperkuat Pendekatan\",\"labelEn\":\"Strengthening Our Approach\",\"description\":\"Memperkuat pendekatan yang menghubungkan pengetahuan, konservasi, dan pengembangan masyarakat dalam berbagai program.\",\"descriptionEn\":\"Strengthening methodologies that connect knowledge, conservation, and community development across programs.\"},{\"year\":\"2025\",\"label\":\"Membentuk Identitas\",\"labelEn\":\"Forming an Identity\",\"description\":\"Menyatukan pengalaman dan jejaring sebagai fondasi lahirnya identitas ANTRABUMI.\",\"descriptionEn\":\"Consolidating field experiences and networks as the foundation of the ANTRABUMI identity.\"},{\"year\":\"2026\",\"label\":\"A New Chapter\",\"labelEn\":\"A New Chapter\",\"description\":\"ANTRABUMI diperkenalkan sebagai institusi yang menghubungkan pengetahuan, alam, dan masyarakat melalui kolaborasi yang lebih luas.\",\"descriptionEn\":\"ANTRABUMI is introduced as an institution connecting knowledge, nature, and communities through wider collaboration.\"}]},\"framework\":{\"badge\":\"04 — CARA KAMI BEKERJA\",\"badgeEn\":\"04 — HOW WE WORK\",\"title\":\"Setiap kolaborasi dimulai dengan memahami konteks, bukan menawarkan solusi.\",\"titleEn\":\"Every collaboration begins with understanding context, not offering solutions.\",\"leadText\":\"ANTRABUMI menghubungkan berbagai pihak untuk merancang solusi yang relevan dengan kebutuhan di lapangan. Kami percaya bahwa perubahan yang bertahan dibangun melalui proses yang terbuka, kolaboratif, dan terus belajar dari setiap pengalaman.\",\"leadTextEn\":\"ANTRABUMI connects diverse stakeholders to design solutions relevant to on-the-ground needs. We believe enduring change is built through open, collaborative processes.\",\"steps\":[{\"step\":\"01\",\"title\":\"LISTEN\",\"desc\":\"Memahami konteks dan mendengarkan kebutuhan lapangan sebelum menawarkan solusi.\",\"descEn\":\"Understanding context and listening to grassroots needs before offering solutions.\"},{\"step\":\"02\",\"title\":\"CONNECT\",\"desc\":\"Menghubungkan perspektif yang beragam, pengetahuan lokal, dan bukti riset ilmiah.\",\"descEn\":\"Connecting diverse perspectives, local wisdom, and scientific research evidence.\"},{\"step\":\"03\",\"title\":\"CO-CREATE\",\"desc\":\"Merancang pendekatan dan solusi bersama komunitas serta pemangku kepentingan terkait.\",\"descEn\":\"Designing approaches and solutions collaboratively with communities and stakeholders.\"},{\"step\":\"04\",\"title\":\"ACT\",\"desc\":\"Menjalankan program dan inisiatif nyata secara kontekstual dan bertanggung jawab.\",\"descEn\":\"Executing real programs and contextual initiatives responsibly on the ground.\"},{\"step\":\"05\",\"title\":\"LEARN\",\"desc\":\"Mendokumentasikan, merefleksikan, dan mengintegrasikan pembelajaran untuk keberlanjutan.\",\"descEn\":\"Documenting, reflecting on, and integrating lessons learned for long-term sustainability.\"}],\"gedsiTitle\":\"GEDSI sebagai Pendekatan\",\"gedsiTitleEn\":\"GEDSI as an Approach\",\"gedsiText\":\"Gender Equality, Disability and Social Inclusion (GEDSI) menjadi bagian dari cara kami memahami konteks, melibatkan masyarakat, dan merancang solusi. Kami memastikan keberagaman perspektif, pengalaman, akses, dan kebutuhan menjadi bagian dari proses dan pengambilan keputusan.\",\"gedsiTextEn\":\"Gender Equality, Disability and Social Inclusion (GEDSI) is integral to how we understand context, engage communities, and design solutions. We ensure diverse perspectives, accessibility, and needs inform every decision.\"},\"cta\":{\"badge\":\"KOLABORASI & KEMITRAAN\",\"badgeEn\":\"COLLABORATION & PARTNERSHIP\",\"title\":\"Mari Terhubung & Berkolaborasi untuk Perubahan Nyata.\",\"titleEn\":\"Let\'s Connect & Collaborate for Meaningful Change.\",\"description\":\"ANTRABUMI membuka ruang kolaborasi lintas sektor bersama komunitas, akademisi, pemerintah, lembaga swadaya, dan mitra pembangunan.\",\"descriptionEn\":\"ANTRABUMI welcomes cross-sector collaboration with communities, academia, government, civil society, and development partners.\",\"primaryButtonText\":\"Mulai Kolaborasi\",\"primaryButtonTextEn\":\"Start Collaborating\",\"primaryButtonLink\":\"/kolaborasi#kontak\",\"secondaryButtonText\":\"Pelajari Lebih Lanjut\",\"secondaryButtonTextEn\":\"Learn More\",\"secondaryButtonLink\":\"/tentang\"}}', NULL, NULL, '2026-09-29 10:28:34', '2026-09-29 10:28:34'),
('cmumkrjg0001svd7s6j0z3fcu', 'site_name', 'ANTRABUMI', NULL, NULL, '2026-09-29 12:36:41', '2026-09-29 11:10:13'),
('cmumkrjg0001tvd7sq1yvoewe', 'site_tagline', 'Connecting Knowledge, Nature, & Communities.', NULL, NULL, '2026-09-29 12:36:41', '2026-09-29 11:10:13'),
('cmumkrjg0001uvd7stghsobe0', 'site_logo_url', '/brand/logo.svg', NULL, NULL, '2026-09-29 12:36:41', '2026-09-29 11:10:13'),
('cmumkrjg1001vvd7s9oagrlm4', 'site_logo_dark_url', '/brand/logo-white.svg', NULL, NULL, '2026-09-29 12:36:41', '2026-09-29 11:10:13'),
('cmumkrjg1001wvd7s8jxtpfth', 'contact_email', 'hello@antrabumi.org', NULL, NULL, '2026-09-29 12:36:41', '2026-09-29 11:10:13'),
('cmumkrjg1001xvd7s865un3nq', 'contact_phone', '+62-823-3038-7505', NULL, NULL, '2026-09-29 12:36:41', '2026-09-29 11:10:13'),
('cmumkrjg1001yvd7seb73cvcp', 'contact_address', 'TRIGHA Creative Hub, Sudirman St, 08, Belitung', NULL, NULL, '2026-09-29 12:36:41', '2026-09-29 11:10:13'),
('cmumkrjg1001zvd7sgf1zowxu', 'instagram_url', 'https://instagram.com/antrabumi_org', NULL, NULL, '2026-09-29 12:36:41', '2026-09-29 11:10:13'),
('cmumkrjg10020vd7ssa3mdhgu', 'linkedin_url', 'https://linkedin.com/company/antrabumi', NULL, NULL, '2026-09-29 12:36:41', '2026-09-29 11:10:13'),
('cmumkrjg20021vd7s885bzvkf', 'youtube_url', 'https://www.youtube.com/@zharifdk3455', NULL, NULL, '2026-09-29 12:36:41', '2026-09-29 11:10:13'),
('cmumkrjg30022vd7sexfufce5', 'twitter_url', '', NULL, NULL, '2026-09-29 12:36:41', '2026-09-29 11:10:13'),
('cmumkrjg30023vd7s9eg9c3sq', 'facebook_url', '', NULL, NULL, '2026-09-29 12:36:41', '2026-09-29 11:10:13'),
('cmumkrjg40024vd7spcocarjt', 'whatsapp_url', 'http://wa.me/6287755121107', NULL, NULL, '2026-09-29 12:36:41', '2026-09-29 11:10:13');
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

--
-- Dumping data for table `ContactMessage`
--
LOCK TABLES `ContactMessage` WRITE;
INSERT INTO `ContactMessage` (`id`, `name`, `email`, `organization`, `phone`, `subject`, `message`, `areaOfInterest`, `status`, `assignedToId`, `createdAt`, `updatedAt`) VALUES
('cmumj5x9f0000vd7sjvfzvix9', 'Belitung', 'admin@antrabumi.org', 'hkm', 'p0898o8y69', 'lerjasama', 'ufkhcdjg', '[General Inquiry] ESG & Sustainability', 'NEW', NULL, '2026-09-29 10:25:25', '2026-09-29 10:25:25'),
('cmumk6qqs001nvd7s2ahh5qy9', 'wahyu', 'admin@antrabumi.org', 'hkm', '9861762175', 'kerjasama project', 'pembangunan wisata', '[Project Collaboration] ESG & Sustainability', 'NEW', NULL, '2026-09-29 10:54:02', '2026-09-29 10:54:02');
UNLOCK TABLES;

--
-- Dumping data for table `AuditLog`
--
LOCK TABLES `AuditLog` WRITE;
INSERT INTO `AuditLog` (`id`, `userId`, `action`, `entity`, `entityId`, `metadata`, `ipAddress`, `userAgent`, `createdAt`) VALUES
('cmulc3jo20001vdhg02r662w0', 'cmulbsdfo0000vd7cz85wyrj2', 'LOGIN', 'User', 'cmulbsdfo0000vd7cz85wyrj2', '{\"email\":\"admin@antrabumi.org\",\"role\":\"SUPER_ADMIN\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36', '2026-09-28 14:19:50'),
('cmulc49640005vdhgkgsis7li', 'cmulbsdfo0000vd7cz85wyrj2', 'UPLOAD', 'Media', 'cmulc495g0003vdhgkrtgef0l', '{\"filename\":\"1790605223743-whatsapp-image-2026-08-27-at-13-16-59-18496e59.jpeg\",\"originalName\":\"WhatsApp Image 2026-08-27 at 13.16.59.jpeg\",\"mimeType\":\"image/jpeg\",\"size\":255299}', NULL, NULL, '2026-09-28 14:20:23'),
('cmulealpu0009vdhgq0v55g9g', 'cmulbsdfo0000vd7cz85wyrj2', 'UPLOAD', 'Media', 'cmulealpk0007vdhgie2zdm6s', '{\"filename\":\"1790608879204-f10f7e355118ff6de40e8eb4f0d57896-433c0650.jpg\",\"originalName\":\"f10f7e355118ff6de40e8eb4f0d57896.jpg\",\"mimeType\":\"image/jpeg\",\"size\":43230}', NULL, NULL, '2026-09-28 15:21:19'),
('cmulebck4000dvdhgr7em3owe', 'cmulbsdfo0000vd7cz85wyrj2', 'UPDATE', 'SiteSetting', 'home_hero_slider', '{\"slideCount\":3,\"autoplay\":true,\"intervalMs\":6000}', NULL, NULL, '2026-09-28 15:21:54'),
('cmumcitbc000hvdhgzk8tgzc1', 'cmulbsdfo0000vd7cz85wyrj2', 'UPLOAD', 'Media', 'cmumcitb1000fvdhghtb22vp5', '{\"filename\":\"1790666369240-f10f7e355118ff6de40e8eb4f0d57896-f04e5c5b.jpg\",\"originalName\":\"f10f7e355118ff6de40e8eb4f0d57896.jpg\",\"mimeType\":\"image/jpeg\",\"size\":43230}', NULL, NULL, '2026-09-29 07:19:29'),
('cmumcj07k000mvdhgoogonbi6', 'cmulbsdfo0000vd7cz85wyrj2', 'CREATE', 'Knowledge', 'cmumcj077000jvdhgonpe10pq', NULL, NULL, NULL, '2026-09-29 07:19:38'),
('cmumcjgs7000ovdhgmwqasm6g', 'cmulbsdfo0000vd7cz85wyrj2', 'PUBLISH', 'Knowledge', 'cmumcj077000jvdhgonpe10pq', '{\"status\":\"PUBLISHED\"}', NULL, NULL, '2026-09-29 07:19:59'),
('cmumck3jz000uvdhgru3c2mfp', 'cmulbsdfo0000vd7cz85wyrj2', 'UPDATE', 'Knowledge', 'cmumcj077000jvdhgonpe10pq', NULL, NULL, NULL, '2026-09-29 07:20:29'),
('cmumefqgw0003vdvc3e2bla96', 'cmulbsdfo0000vd7cz85wyrj2', 'UPLOAD', 'Media', 'cmumefqgn0001vdvc1clpe6px', '{\"filename\":\"1790669584819-whatsapp-image-2026-08-07-at-22-04-46-e891f1fc.jpeg\",\"originalName\":\"WhatsApp Image 2026-08-07 at 22.04.46.jpeg\",\"mimeType\":\"image/jpeg\",\"size\":85647}', NULL, NULL, '2026-09-29 08:13:04'),
('cmumefsmr0009vdvcuatll26y', 'cmulbsdfo0000vd7cz85wyrj2', 'UPDATE', 'Person', 'cmulbsdok002qvd7czapwonsv', NULL, NULL, NULL, '2026-09-29 08:13:07'),
('cmumeglmq000fvdvc2eozsj87', 'cmulbsdfo0000vd7cz85wyrj2', 'UPDATE', 'Person', 'cmulbsdok002qvd7czapwonsv', NULL, NULL, NULL, '2026-09-29 08:13:45'),
('cmumempes000lvdvcekb0zmwq', 'cmulbsdfo0000vd7cz85wyrj2', 'UPDATE', 'Person', 'cmulbsdok002qvd7czapwonsv', NULL, NULL, NULL, '2026-09-29 08:18:30'),
('cmumj9zo10003vd7ss7ui6a5x', 'cmulbsdfo0000vd7cz85wyrj2', 'UPDATE', 'SiteSetting', 'home_sections_content', '{\"updatedSections\":[\"whyUs\",\"about\",\"pillars\",\"growth\",\"framework\",\"cta\"]}', NULL, NULL, '2026-09-29 10:28:34'),
('cmumjdtlu0007vd7so0nk3bn9', 'cmulbsdfo0000vd7cz85wyrj2', 'UPLOAD', 'Media', 'cmumjdtkk0005vd7svhd3ojzf', '{\"filename\":\"1790677893129-chatgpt-image-aug-14-2026-10_02_51-pm-1--ebf2a0a4.png\",\"originalName\":\"ChatGPT Image Aug 14, 2026, 10_02_51 PM (1).png\",\"mimeType\":\"image/png\",\"size\":54833}', NULL, NULL, '2026-09-29 10:31:33'),
('cmumjdtno000dvd7sec1zbucv', 'cmulbsdfo0000vd7cz85wyrj2', 'UPDATE', 'Experience', 'cmulbsdn50026vd7c460rm0bo', '{\"slug\":\"indonesia-digital-ecosystem-assessment-idea\"}', NULL, NULL, '2026-09-29 10:31:33'),
('cmumje8u5000jvd7srwfc072f', 'cmulbsdfo0000vd7cz85wyrj2', 'UPDATE', 'Experience', 'cmulbsdn50026vd7c460rm0bo', '{\"slug\":\"indonesia-digital-ecosystem-assessment-idea\"}', NULL, NULL, '2026-09-29 10:31:53'),
('cmumjl9vi000pvd7svo3a3ulz', 'cmulbsdfo0000vd7cz85wyrj2', 'UPDATE', 'Person', 'cmulbsdok002qvd7czapwonsv', NULL, NULL, NULL, '2026-09-29 10:37:21'),
('cmumjq7wl000tvd7stm8mbq0o', 'cmulbsdfo0000vd7cz85wyrj2', 'UPDATE', 'SiteSetting', 'home_hero_slider', '{\"slideCount\":3,\"autoplay\":true,\"intervalMs\":4000}', NULL, NULL, '2026-09-29 10:41:12'),
('cmumjqltq000xvd7s6r1qo7o1', 'cmulbsdfo0000vd7cz85wyrj2', 'UPLOAD', 'Media', 'cmumjqlsn000vvd7s6gwjvdhm', '{\"filename\":\"1790678490062-dpkxyk-9-lhstususqkrjx1minfi2hpd3v9bef-2nhejbidkih-0e432dc4.jpg\",\"originalName\":\"DpKxYk-9-lHSTususqKRjX1minFi2Hpd3V9BeF-2NHejbiDKIHZ7vmR_KRGYrXrp6WFphW9AiPnSdjG7cwKDEr62CluljuwrRLP_WRNC2JLkGSckV2hZifXrpleurqiCipPRsrZG8Q8ibiYvdUeQng9m50IlvvZM719T0_kOefRMMU9I1M4mMYQ4Krj3g4C\",\"mimeType\":\"image/jpeg\",\"size\":123490}', NULL, NULL, '2026-09-29 10:41:30'),
('cmumjr0450011vd7s4lw5zxaz', 'cmulbsdfo0000vd7cz85wyrj2', 'UPLOAD', 'Media', 'cmumjr03x000zvd7s7f2wzu6p', '{\"filename\":\"1790678508612-seberang-9113a578.jpg\",\"originalName\":\"seberang.jpg\",\"mimeType\":\"image/jpeg\",\"size\":1130694}', NULL, NULL, '2026-09-29 10:41:48'),
('cmumjr4qy0015vd7shznd2hdx', 'cmulbsdfo0000vd7cz85wyrj2', 'UPDATE', 'SiteSetting', 'home_hero_slider', '{\"slideCount\":3,\"autoplay\":true,\"intervalMs\":4000}', NULL, NULL, '2026-09-29 10:41:54'),
('cmumjzzd9001avd7sj4tetczz', 'cmulbsdfo0000vd7cz85wyrj2', 'CREATE', 'Knowledge', 'cmumjzzc30017vd7slefowdqn', NULL, NULL, NULL, '2026-09-29 10:48:47'),
('cmumk07qy001evd7spb1l8xr8', 'cmulbsdfo0000vd7cz85wyrj2', 'UPLOAD', 'Media', 'cmumk07qe001cvd7s6qwsgq41', '{\"filename\":\"1790678938209-rafale-8b98aec6.jpg\",\"originalName\":\"Rafale.jpg\",\"mimeType\":\"image/jpeg\",\"size\":18701}', NULL, NULL, '2026-09-29 10:48:58'),
('cmumk1anh001kvd7s4u5rwmov', 'cmulbsdfo0000vd7cz85wyrj2', 'UPDATE', 'Knowledge', 'cmumjzzc30017vd7slefowdqn', NULL, NULL, NULL, '2026-09-29 10:49:48'),
('cmumk1jpr001mvd7sr6h1fgiq', 'cmulbsdfo0000vd7cz85wyrj2', 'PUBLISH', 'Knowledge', 'cmumjzzc30017vd7slefowdqn', '{\"status\":\"PUBLISHED\"}', NULL, NULL, '2026-09-29 10:50:00'),
('cmumk8rz8001pvd7ssjhrmhs1', 'cmulbsdfo0000vd7cz85wyrj2', 'LOGOUT', 'User', 'cmulbsdfo0000vd7cz85wyrj2', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36', '2026-09-29 10:55:37'),
('cmumk9sty001rvd7sr0wl8omd', 'cmulbsdfo0000vd7cz85wyrj2', 'LOGIN', 'User', 'cmulbsdfo0000vd7cz85wyrj2', '{\"email\":\"admin@antrabumi.org\",\"role\":\"SUPER_ADMIN\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36', '2026-09-29 10:56:25'),
('cmumkrjie0026vd7sazz4l563', 'cmulbsdfo0000vd7cz85wyrj2', 'UPDATE', 'SiteSetting', 'bulk', '{\"keys\":[\"site_name\",\"site_tagline\",\"site_logo_url\",\"site_logo_dark_url\",\"contact_email\",\"contact_phone\",\"contact_address\",\"instagram_url\",\"linkedin_url\",\"youtube_url\",\"twitter_url\",\"facebook_url\",\"whatsapp_url\"]}', NULL, NULL, '2026-09-29 11:10:13'),
('cmumntjgw000evdng2nflu3na', 'cmulbsdfo0000vd7cz85wyrj2', 'UPDATE', 'SiteSetting', 'bulk', '{\"keys\":[\"site_name\",\"site_tagline\",\"site_logo_url\",\"site_logo_dark_url\",\"contact_email\",\"contact_phone\",\"contact_address\",\"instagram_url\",\"linkedin_url\",\"youtube_url\",\"twitter_url\",\"facebook_url\",\"whatsapp_url\"]}', NULL, NULL, '2026-09-29 12:35:45'),
('cmumnuqed000tvdngxtnt76r4', 'cmulbsdfo0000vd7cz85wyrj2', 'UPDATE', 'SiteSetting', 'bulk', '{\"keys\":[\"site_name\",\"site_tagline\",\"site_logo_url\",\"site_logo_dark_url\",\"contact_email\",\"contact_phone\",\"contact_address\",\"instagram_url\",\"linkedin_url\",\"youtube_url\",\"twitter_url\",\"facebook_url\",\"whatsapp_url\"]}', NULL, NULL, '2026-09-29 12:36:41'),
('cmunr59ju000xvdnguoy0owud', 'cmulbsdfo0000vd7cz85wyrj2', 'UPLOAD', 'Media', 'cmunr59h9000vvdngbi9ahldf', '{\"filename\":\"1790751396949-buku-jurnal-harian-kebiasaan-anak-hebat-indonesia--9e20f1f0.pdf\",\"originalName\":\"Buku-Jurnal-Harian-Kebiasaan-Anak-Hebat-Indonesia-Lembar-Kerja-Pembelajaran-Mendalam-Hijau-Ilustrasi-Al.pdf\",\"mimeType\":\"application/pdf\",\"size\":9835229}', NULL, NULL, '2026-09-30 06:56:37'),
('cmunr59r70011vdngsaydw12o', 'cmulbsdfo0000vd7cz85wyrj2', 'UPDATE', 'Knowledge', 'cmumcj077000jvdhgonpe10pq', '{\"action\":\"attach_pdf\",\"mediaId\":\"cmunr59h9000vvdngbi9ahldf\"}', NULL, NULL, '2026-09-30 06:56:37'),
('cmunwbg3v0001vdasq4aoj3uw', 'cmulbsdfo0000vd7cz85wyrj2', 'LOGIN', 'User', 'cmulbsdfo0000vd7cz85wyrj2', '{\"email\":\"admin@antrabumi.org\",\"role\":\"SUPER_ADMIN\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36', '2026-09-30 09:21:24');
UNLOCK TABLES;

SET FOREIGN_KEY_CHECKS = 1;

-- =========================================================================
-- END OF DUMP
-- =========================================================================
