-- CreateTable
CREATE TABLE `KnowledgeMedia` (
    `knowledgeId` VARCHAR(191) NOT NULL,
    `mediaId` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`knowledgeId`, `mediaId`),
    INDEX `KnowledgeMedia_knowledgeId_idx` (`knowledgeId`),
    CONSTRAINT `KnowledgeMedia_knowledgeId_fkey` FOREIGN KEY (`knowledgeId`) REFERENCES `Knowledge` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `KnowledgeMedia_mediaId_fkey` FOREIGN KEY (`mediaId`) REFERENCES `Media` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
