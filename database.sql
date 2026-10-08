-- MySQL schema-only dump generated from database/migrations.
-- Contains no application data or credentials.
-- Import into a newly created, empty MySQL database.
SET NAMES utf8mb4;

create table `User` (`id` varchar(191) not null, `name` varchar(191) not null, `email` varchar(191) not null, `passwordHash` varchar(191) null, `role` enum('SUPER_ADMIN', 'ADMIN', 'EDITOR', 'AUTHOR') not null default 'AUTHOR', `status` enum('ACTIVE', 'INACTIVE', 'SUSPENDED') not null default 'ACTIVE', `imageId` varchar(191) null, `lastLoginAt` datetime(3) null, `createdAt` datetime(3) not null default CURRENT_TIMESTAMP(3), `updatedAt` datetime(3) not null, primary key (`id`)) default character set utf8mb4 collate 'utf8mb4_unicode_ci';

alter table `User` add unique `user_email_unique`(`email`);

alter table `User` add index `user_role_index`(`role`);

alter table `User` add index `user_status_index`(`status`);

alter table `User` add index `user_createdat_index`(`createdAt`);

create table `password_reset_tokens` (`email` varchar(191) not null, `token` varchar(191) not null, `created_at` timestamp null, primary key (`email`)) default character set utf8mb4 collate 'utf8mb4_unicode_ci';

create table `sessions` (`id` varchar(191) not null, `user_id` varchar(191) null, `ip_address` varchar(45) null, `user_agent` text null, `payload` longtext not null, `last_activity` int not null, primary key (`id`)) default character set utf8mb4 collate 'utf8mb4_unicode_ci';

alter table `sessions` add index `sessions_user_id_index`(`user_id`);

alter table `sessions` add index `sessions_last_activity_index`(`last_activity`);

create table `cache` (`key` varchar(191) not null, `value` mediumtext not null, `expiration` int not null, primary key (`key`)) default character set utf8mb4 collate 'utf8mb4_unicode_ci';

create table `cache_locks` (`key` varchar(191) not null, `owner` varchar(191) not null, `expiration` int not null, primary key (`key`)) default character set utf8mb4 collate 'utf8mb4_unicode_ci';

create table `jobs` (`id` bigint unsigned not null auto_increment primary key, `queue` varchar(191) not null, `payload` longtext not null, `attempts` tinyint unsigned not null, `reserved_at` int unsigned null, `available_at` int unsigned not null, `created_at` int unsigned not null) default character set utf8mb4 collate 'utf8mb4_unicode_ci';

alter table `jobs` add index `jobs_queue_index`(`queue`);

create table `job_batches` (`id` varchar(191) not null, `name` varchar(191) not null, `total_jobs` int not null, `pending_jobs` int not null, `failed_jobs` int not null, `failed_job_ids` longtext not null, `options` mediumtext null, `cancelled_at` int null, `created_at` int not null, `finished_at` int null, primary key (`id`)) default character set utf8mb4 collate 'utf8mb4_unicode_ci';

create table `failed_jobs` (`id` bigint unsigned not null auto_increment primary key, `uuid` varchar(191) not null, `connection` text not null, `queue` text not null, `payload` longtext not null, `exception` longtext not null, `failed_at` timestamp not null default CURRENT_TIMESTAMP) default character set utf8mb4 collate 'utf8mb4_unicode_ci';

alter table `failed_jobs` add unique `failed_jobs_uuid_unique`(`uuid`);

create table `Permission` (`id` varchar(191) not null, `key` varchar(191) not null, `description` varchar(191) null, `createdAt` datetime(3) not null default CURRENT_TIMESTAMP(3), `updatedAt` datetime(3) not null, primary key (`id`)) default character set utf8mb4 collate 'utf8mb4_unicode_ci';

alter table `Permission` add unique `permission_key_unique`(`key`);

create table `ContributionArea` (`id` varchar(191) not null, `slug` varchar(191) not null, `status` enum('DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED') not null default 'DRAFT', `order` int not null default '0', `createdAt` datetime(3) not null default CURRENT_TIMESTAMP(3), `updatedAt` datetime(3) not null, primary key (`id`)) default character set utf8mb4 collate 'utf8mb4_unicode_ci';

alter table `ContributionArea` add unique `contributionarea_slug_unique`(`slug`);

alter table `ContributionArea` add index `contributionarea_status_index`(`status`);

create table `Expertise` (`id` varchar(191) not null, `slug` varchar(191) not null, `name` varchar(191) not null, `description` text null, `createdAt` datetime(3) not null default CURRENT_TIMESTAMP(3), `updatedAt` datetime(3) not null, primary key (`id`)) default character set utf8mb4 collate 'utf8mb4_unicode_ci';

alter table `Expertise` add unique `expertise_slug_unique`(`slug`);

create table `Category` (`id` varchar(191) not null, `slug` varchar(191) not null, `name` varchar(191) not null, `description` text null, `createdAt` datetime(3) not null default CURRENT_TIMESTAMP(3), `updatedAt` datetime(3) not null, primary key (`id`)) default character set utf8mb4 collate 'utf8mb4_unicode_ci';

alter table `Category` add unique `category_slug_unique`(`slug`);

create table `Tag` (`id` varchar(191) not null, `slug` varchar(191) not null, `name` varchar(191) not null, `createdAt` datetime(3) not null default CURRENT_TIMESTAMP(3), `updatedAt` datetime(3) not null, primary key (`id`)) default character set utf8mb4 collate 'utf8mb4_unicode_ci';

alter table `Tag` add unique `tag_slug_unique`(`slug`);

create table `SiteSetting` (`id` varchar(191) not null, `key` varchar(191) not null, `value` longtext null, `language` enum('ID', 'EN') null, `description` varchar(191) null, `createdAt` datetime(3) not null default CURRENT_TIMESTAMP(3), `updatedAt` datetime(3) not null, primary key (`id`)) default character set utf8mb4 collate 'utf8mb4_unicode_ci';

alter table `SiteSetting` add unique `sitesetting_key_unique`(`key`);

alter table `SiteSetting` add index `sitesetting_language_index`(`language`);

create table `NavigationItem` (`id` varchar(191) not null, `label` varchar(191) not null, `url` varchar(191) null, `language` enum('ID', 'EN') not null, `parentId` varchar(191) null, `order` int not null default '0', `visible` tinyint(1) not null default '1', `openInNewTab` tinyint(1) not null default '0', `createdAt` datetime(3) not null default CURRENT_TIMESTAMP(3), `updatedAt` datetime(3) not null, primary key (`id`)) default character set utf8mb4 collate 'utf8mb4_unicode_ci';

alter table `NavigationItem` add constraint `navigationitem_parentid_foreign` foreign key (`parentId`) references `NavigationItem` (`id`) on delete set null on update cascade;

alter table `NavigationItem` add index `navigationitem_language_index`(`language`);

alter table `NavigationItem` add index `navigationitem_parentid_index`(`parentId`);

alter table `NavigationItem` add index `navigationitem_visible_index`(`visible`);

create table `AuditLog` (`id` varchar(191) not null, `userId` varchar(191) null, `action` enum('LOGIN', 'LOGOUT', 'CREATE', 'UPDATE', 'DELETE', 'PUBLISH', 'UNPUBLISH', 'ARCHIVE', 'UPLOAD', 'USER_ROLE_CHANGED', 'SETTING_CHANGED') not null, `entity` varchar(191) null, `entityId` varchar(191) null, `metadata` json null, `ipAddress` varchar(191) null, `userAgent` varchar(191) null, `createdAt` datetime(3) not null default CURRENT_TIMESTAMP(3), primary key (`id`)) default character set utf8mb4 collate 'utf8mb4_unicode_ci';

alter table `AuditLog` add constraint `auditlog_userid_foreign` foreign key (`userId`) references `User` (`id`) on delete set null on update cascade;

alter table `AuditLog` add index `auditlog_userid_index`(`userId`);

alter table `AuditLog` add index `auditlog_action_index`(`action`);

alter table `AuditLog` add index `auditlog_entity_index`(`entity`);

alter table `AuditLog` add index `auditlog_entityid_index`(`entityId`);

alter table `AuditLog` add index `auditlog_createdat_index`(`createdAt`);

create table `Media` (`id` varchar(191) not null, `type` enum('IMAGE', 'DOCUMENT', 'VIDEO', 'AUDIO', 'OTHER') not null, `filename` varchar(191) not null, `originalName` varchar(191) null, `mimeType` varchar(191) not null, `size` bigint not null, `width` int null, `height` int null, `storageKey` varchar(191) not null, `url` varchar(191) null, `altText` varchar(191) null, `caption` text null, `attribution` text null, `uploadedById` varchar(191) not null, `createdAt` datetime(3) not null default CURRENT_TIMESTAMP(3), `updatedAt` datetime(3) not null, primary key (`id`)) default character set utf8mb4 collate 'utf8mb4_unicode_ci';

alter table `Media` add constraint `media_uploadedbyid_foreign` foreign key (`uploadedById`) references `User` (`id`) on delete restrict on update cascade;

alter table `Media` add index `media_type_index`(`type`);

alter table `Media` add index `media_uploadedbyid_index`(`uploadedById`);

alter table `Media` add index `media_createdat_index`(`createdAt`);

alter table `User` add constraint `user_imageid_foreign` foreign key (`imageId`) references `Media` (`id`) on delete set null on update cascade;

create table `Page` (`id` varchar(191) not null, `slug` varchar(191) not null, `language` enum('ID', 'EN') not null, `title` varchar(191) not null, `excerpt` text null, `content` longtext null, `heroTitle` varchar(191) null, `heroDescription` varchar(191) null, `heroMediaId` varchar(191) null, `status` enum('DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED') not null default 'DRAFT', `seoTitle` varchar(191) null, `seoDescription` text null, `ogImageId` varchar(191) null, `publishedAt` datetime(3) null, `createdAt` datetime(3) not null default CURRENT_TIMESTAMP(3), `updatedAt` datetime(3) not null, primary key (`id`)) default character set utf8mb4 collate 'utf8mb4_unicode_ci';

alter table `Page` add unique `page_slug_language_unique`(`slug`, `language`);

alter table `Page` add constraint `page_heromediaid_foreign` foreign key (`heroMediaId`) references `Media` (`id`) on delete set null on update cascade;

alter table `Page` add constraint `page_ogimageid_foreign` foreign key (`ogImageId`) references `Media` (`id`) on delete set null on update cascade;

alter table `Page` add index `page_language_index`(`language`);

alter table `Page` add index `page_status_index`(`status`);

alter table `Page` add index `page_publishedat_index`(`publishedAt`);

create table `ContributionAreaTranslation` (`id` varchar(191) not null, `contributionAreaId` varchar(191) not null, `language` enum('ID', 'EN') not null, `title` varchar(191) not null, `description` text null, `imageId` varchar(191) null, `createdAt` datetime(3) not null default CURRENT_TIMESTAMP(3), `updatedAt` datetime(3) not null, primary key (`id`)) default character set utf8mb4 collate 'utf8mb4_unicode_ci';

alter table `ContributionAreaTranslation` add unique `contributionareatranslation_contributionareaid_language_unique`(`contributionAreaId`, `language`);

alter table `ContributionAreaTranslation` add constraint `contributionareatranslation_contributionareaid_foreign` foreign key (`contributionAreaId`) references `ContributionArea` (`id`) on delete cascade on update cascade;

alter table `ContributionAreaTranslation` add constraint `contributionareatranslation_imageid_foreign` foreign key (`imageId`) references `Media` (`id`) on delete set null on update cascade;

alter table `ContributionAreaTranslation` add index `contributionareatranslation_language_index`(`language`);

create table `Experience` (`id` varchar(191) not null, `slug` varchar(191) not null, `type` varchar(191) not null default 'EXPERIENCE', `year` int null, `category` varchar(191) null, `location` varchar(191) null, `clientName` varchar(191) null, `status` enum('DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED') not null default 'DRAFT', `featured` tinyint(1) not null default '0', `coverMediaId` varchar(191) null, `createdById` varchar(191) not null, `updatedById` varchar(191) not null, `publishedAt` datetime(3) null, `createdAt` datetime(3) not null default CURRENT_TIMESTAMP(3), `updatedAt` datetime(3) not null, primary key (`id`)) default character set utf8mb4 collate 'utf8mb4_unicode_ci';

alter table `Experience` add constraint `experience_covermediaid_foreign` foreign key (`coverMediaId`) references `Media` (`id`) on delete set null on update cascade;

alter table `Experience` add constraint `experience_createdbyid_foreign` foreign key (`createdById`) references `User` (`id`) on delete restrict on update cascade;

alter table `Experience` add constraint `experience_updatedbyid_foreign` foreign key (`updatedById`) references `User` (`id`) on delete restrict on update cascade;

alter table `Experience` add unique `experience_slug_unique`(`slug`);

alter table `Experience` add index `experience_type_index`(`type`);

alter table `Experience` add index `experience_year_index`(`year`);

alter table `Experience` add index `experience_status_index`(`status`);

alter table `Experience` add index `experience_featured_index`(`featured`);

alter table `Experience` add index `experience_createdbyid_index`(`createdById`);

alter table `Experience` add index `experience_updatedbyid_index`(`updatedById`);

alter table `Experience` add index `experience_publishedat_index`(`publishedAt`);

create table `ExperienceTranslation` (`id` varchar(191) not null, `experienceId` varchar(191) not null, `language` enum('ID', 'EN') not null, `title` varchar(191) not null, `excerpt` text null, `description` longtext null, `methodology` longtext null, `impact` longtext null, `seoTitle` varchar(191) null, `seoDescription` text null, `createdAt` datetime(3) not null default CURRENT_TIMESTAMP(3), `updatedAt` datetime(3) not null, primary key (`id`)) default character set utf8mb4 collate 'utf8mb4_unicode_ci';

alter table `ExperienceTranslation` add unique `experiencetranslation_experienceid_language_unique`(`experienceId`, `language`);

alter table `ExperienceTranslation` add constraint `experiencetranslation_experienceid_foreign` foreign key (`experienceId`) references `Experience` (`id`) on delete cascade on update cascade;

alter table `ExperienceTranslation` add index `experiencetranslation_language_index`(`language`);

create table `ExperienceMetric` (`id` varchar(191) not null, `experienceId` varchar(191) not null, `label` varchar(191) not null, `value` varchar(191) not null, `unit` varchar(191) null, `order` int not null default '0', primary key (`id`)) default character set utf8mb4 collate 'utf8mb4_unicode_ci';

alter table `ExperienceMetric` add constraint `experiencemetric_experienceid_foreign` foreign key (`experienceId`) references `Experience` (`id`) on delete cascade on update cascade;

alter table `ExperienceMetric` add index `experiencemetric_experienceid_index`(`experienceId`);

create table `Person` (`id` varchar(191) not null, `slug` varchar(191) not null, `imageId` varchar(191) null, `status` enum('DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED') not null default 'DRAFT', `order` int not null default '0', `createdById` varchar(191) not null, `updatedById` varchar(191) not null, `createdAt` datetime(3) not null default CURRENT_TIMESTAMP(3), `updatedAt` datetime(3) not null, primary key (`id`)) default character set utf8mb4 collate 'utf8mb4_unicode_ci';

alter table `Person` add constraint `person_imageid_foreign` foreign key (`imageId`) references `Media` (`id`) on delete set null on update cascade;

alter table `Person` add constraint `person_createdbyid_foreign` foreign key (`createdById`) references `User` (`id`) on delete restrict on update cascade;

alter table `Person` add constraint `person_updatedbyid_foreign` foreign key (`updatedById`) references `User` (`id`) on delete restrict on update cascade;

alter table `Person` add unique `person_slug_unique`(`slug`);

alter table `Person` add index `person_status_index`(`status`);

alter table `Person` add index `person_createdbyid_index`(`createdById`);

alter table `Person` add index `person_updatedbyid_index`(`updatedById`);

create table `PersonTranslation` (`id` varchar(191) not null, `personId` varchar(191) not null, `language` enum('ID', 'EN') not null, `name` varchar(191) not null, `degree` varchar(191) null, `role` varchar(191) null, `biography` longtext null, `createdAt` datetime(3) not null default CURRENT_TIMESTAMP(3), `updatedAt` datetime(3) not null, primary key (`id`)) default character set utf8mb4 collate 'utf8mb4_unicode_ci';

alter table `PersonTranslation` add unique `persontranslation_personid_language_unique`(`personId`, `language`);

alter table `PersonTranslation` add constraint `persontranslation_personid_foreign` foreign key (`personId`) references `Person` (`id`) on delete cascade on update cascade;

create table `Knowledge` (`id` varchar(191) not null, `slug` varchar(191) not null, `type` enum('ARTICLE', 'RESEARCH_PUBLICATION', 'STORY') not null, `coverMediaId` varchar(191) null, `status` enum('DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED') not null default 'DRAFT', `featured` tinyint(1) not null default '0', `authorName` varchar(191) null, `publicationDate` datetime(3) null, `createdById` varchar(191) not null, `updatedById` varchar(191) not null, `publishedAt` datetime(3) null, `createdAt` datetime(3) not null default CURRENT_TIMESTAMP(3), `updatedAt` datetime(3) not null, primary key (`id`)) default character set utf8mb4 collate 'utf8mb4_unicode_ci';

alter table `Knowledge` add constraint `knowledge_covermediaid_foreign` foreign key (`coverMediaId`) references `Media` (`id`) on delete set null on update cascade;

alter table `Knowledge` add constraint `knowledge_createdbyid_foreign` foreign key (`createdById`) references `User` (`id`) on delete restrict on update cascade;

alter table `Knowledge` add constraint `knowledge_updatedbyid_foreign` foreign key (`updatedById`) references `User` (`id`) on delete restrict on update cascade;

alter table `Knowledge` add unique `knowledge_slug_unique`(`slug`);

alter table `Knowledge` add index `knowledge_type_index`(`type`);

alter table `Knowledge` add index `knowledge_status_index`(`status`);

alter table `Knowledge` add index `knowledge_featured_index`(`featured`);

alter table `Knowledge` add index `knowledge_publicationdate_index`(`publicationDate`);

alter table `Knowledge` add index `knowledge_createdbyid_index`(`createdById`);

alter table `Knowledge` add index `knowledge_updatedbyid_index`(`updatedById`);

create table `KnowledgeTranslation` (`id` varchar(191) not null, `knowledgeId` varchar(191) not null, `language` enum('ID', 'EN') not null, `title` varchar(191) not null, `excerpt` text null, `content` longtext null, `seoTitle` varchar(191) null, `seoDescription` text null, `createdAt` datetime(3) not null default CURRENT_TIMESTAMP(3), `updatedAt` datetime(3) not null, primary key (`id`)) default character set utf8mb4 collate 'utf8mb4_unicode_ci';

alter table `KnowledgeTranslation` add unique `knowledgetranslation_knowledgeid_language_unique`(`knowledgeId`, `language`);

alter table `KnowledgeTranslation` add constraint `knowledgetranslation_knowledgeid_foreign` foreign key (`knowledgeId`) references `Knowledge` (`id`) on delete cascade on update cascade;

alter table `KnowledgeTranslation` add index `knowledgetranslation_language_index`(`language`);

create table `Partner` (`id` varchar(191) not null, `name` varchar(191) not null, `slug` varchar(191) not null, `description` text null, `logoMediaId` varchar(191) null, `website` varchar(191) null, `category` varchar(191) null, `status` enum('DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED') not null default 'DRAFT', `order` int not null default '0', `createdAt` datetime(3) not null default CURRENT_TIMESTAMP(3), `updatedAt` datetime(3) not null, primary key (`id`)) default character set utf8mb4 collate 'utf8mb4_unicode_ci';

alter table `Partner` add constraint `partner_logomediaid_foreign` foreign key (`logoMediaId`) references `Media` (`id`) on delete set null on update cascade;

alter table `Partner` add unique `partner_slug_unique`(`slug`);

alter table `Partner` add index `partner_status_index`(`status`);

create table `ContactMessage` (`id` varchar(191) not null, `name` varchar(191) not null, `email` varchar(191) not null, `organization` varchar(191) null, `phone` varchar(191) null, `subject` varchar(191) not null, `message` text not null, `areaOfInterest` varchar(191) null, `status` enum('NEW', 'READ', 'IN_PROGRESS', 'RESOLVED', 'ARCHIVED') not null default 'NEW', `assignedToId` varchar(191) null, `createdAt` datetime(3) not null default CURRENT_TIMESTAMP(3), `updatedAt` datetime(3) not null, primary key (`id`)) default character set utf8mb4 collate 'utf8mb4_unicode_ci';

alter table `ContactMessage` add constraint `contactmessage_assignedtoid_foreign` foreign key (`assignedToId`) references `User` (`id`) on delete set null on update cascade;

alter table `ContactMessage` add index `contactmessage_email_index`(`email`);

alter table `ContactMessage` add index `contactmessage_status_index`(`status`);

alter table `ContactMessage` add index `contactmessage_createdat_index`(`createdAt`);

create table `ExperienceContributionArea` (`experienceId` varchar(191) not null, `contributionAreaId` varchar(191) not null, primary key (`experienceId`, `contributionAreaId`)) default character set utf8mb4 collate 'utf8mb4_unicode_ci';

alter table `ExperienceContributionArea` add constraint `experiencecontributionarea_experienceid_foreign` foreign key (`experienceId`) references `Experience` (`id`) on delete cascade on update cascade;

alter table `ExperienceContributionArea` add constraint `experiencecontributionarea_contributionareaid_foreign` foreign key (`contributionAreaId`) references `ContributionArea` (`id`) on delete cascade on update cascade;

create table `ExperienceMedia` (`experienceId` varchar(191) not null, `mediaId` varchar(191) not null, `order` int not null default '0', primary key (`experienceId`, `mediaId`)) default character set utf8mb4 collate 'utf8mb4_unicode_ci';

alter table `ExperienceMedia` add constraint `experiencemedia_experienceid_foreign` foreign key (`experienceId`) references `Experience` (`id`) on delete cascade on update cascade;

alter table `ExperienceMedia` add constraint `experiencemedia_mediaid_foreign` foreign key (`mediaId`) references `Media` (`id`) on delete cascade on update cascade;

create table `PersonExpertise` (`personId` varchar(191) not null, `expertiseId` varchar(191) not null, `order` int not null default '0', primary key (`personId`, `expertiseId`)) default character set utf8mb4 collate 'utf8mb4_unicode_ci';

alter table `PersonExpertise` add constraint `personexpertise_personid_foreign` foreign key (`personId`) references `Person` (`id`) on delete cascade on update cascade;

alter table `PersonExpertise` add constraint `personexpertise_expertiseid_foreign` foreign key (`expertiseId`) references `Expertise` (`id`) on delete cascade on update cascade;

create table `KnowledgeCategory` (`knowledgeId` varchar(191) not null, `categoryId` varchar(191) not null, primary key (`knowledgeId`, `categoryId`)) default character set utf8mb4 collate 'utf8mb4_unicode_ci';

alter table `KnowledgeCategory` add constraint `knowledgecategory_knowledgeid_foreign` foreign key (`knowledgeId`) references `Knowledge` (`id`) on delete cascade on update cascade;

alter table `KnowledgeCategory` add constraint `knowledgecategory_categoryid_foreign` foreign key (`categoryId`) references `Category` (`id`) on delete cascade on update cascade;

create table `KnowledgeTag` (`knowledgeId` varchar(191) not null, `tagId` varchar(191) not null, primary key (`knowledgeId`, `tagId`)) default character set utf8mb4 collate 'utf8mb4_unicode_ci';

alter table `KnowledgeTag` add constraint `knowledgetag_knowledgeid_foreign` foreign key (`knowledgeId`) references `Knowledge` (`id`) on delete cascade on update cascade;

alter table `KnowledgeTag` add constraint `knowledgetag_tagid_foreign` foreign key (`tagId`) references `Tag` (`id`) on delete cascade on update cascade;

create table `ExperienceKnowledge` (`experienceId` varchar(191) not null, `knowledgeId` varchar(191) not null, primary key (`experienceId`, `knowledgeId`)) default character set utf8mb4 collate 'utf8mb4_unicode_ci';

alter table `ExperienceKnowledge` add constraint `experienceknowledge_experienceid_foreign` foreign key (`experienceId`) references `Experience` (`id`) on delete cascade on update cascade;

alter table `ExperienceKnowledge` add constraint `experienceknowledge_knowledgeid_foreign` foreign key (`knowledgeId`) references `Knowledge` (`id`) on delete cascade on update cascade;

create table `KnowledgeContributionArea` (`knowledgeId` varchar(191) not null, `contributionAreaId` varchar(191) not null, primary key (`knowledgeId`, `contributionAreaId`)) default character set utf8mb4 collate 'utf8mb4_unicode_ci';

alter table `KnowledgeContributionArea` add constraint `knowledgecontributionarea_knowledgeid_foreign` foreign key (`knowledgeId`) references `Knowledge` (`id`) on delete cascade on update cascade;

alter table `KnowledgeContributionArea` add constraint `knowledgecontributionarea_contributionareaid_foreign` foreign key (`contributionAreaId`) references `ContributionArea` (`id`) on delete cascade on update cascade;

create table `KnowledgeDownload` (`id` varchar(191) not null, `knowledgeId` varchar(191) not null, `mediaId` varchar(191) not null, `label` varchar(191) null, `order` int not null default '0', primary key (`id`)) default character set utf8mb4 collate 'utf8mb4_unicode_ci';

alter table `KnowledgeDownload` add constraint `knowledgedownload_knowledgeid_foreign` foreign key (`knowledgeId`) references `Knowledge` (`id`) on delete cascade on update cascade;

alter table `KnowledgeDownload` add constraint `knowledgedownload_mediaid_foreign` foreign key (`mediaId`) references `Media` (`id`) on delete cascade on update cascade;

alter table `KnowledgeDownload` add index `knowledgedownload_knowledgeid_index`(`knowledgeId`);

create table `KnowledgeMedia` (`knowledgeId` varchar(191) not null, `mediaId` varchar(191) not null, `order` int not null default '0', primary key (`knowledgeId`, `mediaId`)) default character set utf8mb4 collate 'utf8mb4_unicode_ci';

alter table `KnowledgeMedia` add index `knowledgemedia_knowledgeid_index`(`knowledgeId`);

alter table `KnowledgeMedia` add constraint `knowledgemedia_knowledgeid_foreign` foreign key (`knowledgeId`) references `Knowledge` (`id`) on delete cascade on update cascade;

alter table `KnowledgeMedia` add constraint `knowledgemedia_mediaid_foreign` foreign key (`mediaId`) references `Media` (`id`) on delete cascade on update cascade;
