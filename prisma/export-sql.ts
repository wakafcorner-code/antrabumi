import { PrismaClient } from "@prisma/client";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

function escapeSql(val: any): string {
  if (val === null || val === undefined) return "NULL";
  if (typeof val === "boolean") return val ? "1" : "0";
  if (typeof val === "number") return String(val);
  if (typeof val === "bigint") return String(val);
  if (val instanceof Date) return `'${val.toISOString().slice(0, 19).replace("T", " ")}'`;
  if (typeof val === "object") {
    return `'${JSON.stringify(val).replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, (char) => {
      switch (char) {
        case "\0": return "\\0";
        case "\x08": return "\\b";
        case "\x09": return "\\t";
        case "\x1a": return "\\z";
        case "\n": return "\\n";
        case "\r": return "\\r";
        case "\"": case "'": case "\\": case "%": return "\\" + char;
        default: return char;
      }
    })}'`;
  }
  const str = String(val).replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, (char) => {
    switch (char) {
      case "\0": return "\\0";
      case "\x08": return "\\b";
      case "\x09": return "\\t";
      case "\x1a": return "\\z";
      case "\n": return "\\n";
      case "\r": return "\\r";
      case "\"": case "'": case "\\": case "%": return "\\" + char;
      default: return char;
    }
  });
  return `'${str}'`;
}

async function dumpTable(tableName: string, modelGetter: () => Promise<any[]>): Promise<string> {
  try {
    const records = await modelGetter();
    if (!records || records.length === 0) return "";
    
    const columns = Object.keys(records[0]);
    let sql = `\n--\n-- Dumping data for table \`${tableName}\`\n--\n`;
    sql += `LOCK TABLES \`${tableName}\` WRITE;\n`;
    
    const rows = records.map((record) => {
      const vals = columns.map((col) => escapeSql(record[col]));
      return `(${vals.join(", ")})`;
    });

    sql += `INSERT INTO \`${tableName}\` (\`${columns.join("`, `")}\`) VALUES\n${rows.join(",\n")};\n`;
    sql += `UNLOCK TABLES;\n`;
    return sql;
  } catch (err: any) {
    console.warn(`Could not dump ${tableName}:`, err.message);
    return "";
  }
}

async function main() {
  console.log("1. Generating DDL with Prisma...");
  const ddl = execSync(
    "npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script",
    { encoding: "utf-8" }
  );

  console.log("2. Dumping table data...");
  let dataSql = "\n-- =========================================================================\n";
  dataSql += "-- INITIAL & SEED DATA\n";
  dataSql += "-- =========================================================================\n";

  dataSql += await dumpTable("User", () => prisma.user.findMany());
  dataSql += await dumpTable("Permission", () => prisma.permission.findMany());
  dataSql += await dumpTable("Expertise", () => prisma.expertise.findMany());
  dataSql += await dumpTable("ContributionArea", () => prisma.contributionArea.findMany());
  dataSql += await dumpTable("ContributionAreaTranslation", () => prisma.contributionAreaTranslation.findMany());
  dataSql += await dumpTable("Experience", () => prisma.experience.findMany());
  dataSql += await dumpTable("ExperienceTranslation", () => prisma.experienceTranslation.findMany());
  dataSql += await dumpTable("ExperienceMetric", () => prisma.experienceMetric.findMany());
  dataSql += await dumpTable("ExperienceContributionArea", () => prisma.experienceContributionArea.findMany());
  dataSql += await dumpTable("ExperienceMedia", () => prisma.experienceMedia.findMany());
  dataSql += await dumpTable("ExperienceKnowledge", () => prisma.experienceKnowledge.findMany());
  dataSql += await dumpTable("Person", () => prisma.person.findMany());
  dataSql += await dumpTable("PersonTranslation", () => prisma.personTranslation.findMany());
  dataSql += await dumpTable("PersonExpertise", () => prisma.personExpertise.findMany());
  dataSql += await dumpTable("Category", () => prisma.category.findMany());
  dataSql += await dumpTable("Knowledge", () => prisma.knowledge.findMany());
  dataSql += await dumpTable("KnowledgeTranslation", () => prisma.knowledgeTranslation.findMany());
  dataSql += await dumpTable("KnowledgeCategory", () => prisma.knowledgeCategory.findMany());
  dataSql += await dumpTable("Tag", () => prisma.tag.findMany());
  dataSql += await dumpTable("KnowledgeTag", () => prisma.knowledgeTag.findMany());
  dataSql += await dumpTable("KnowledgeContributionArea", () => prisma.knowledgeContributionArea.findMany());
  dataSql += await dumpTable("KnowledgeDownload", () => prisma.knowledgeDownload.findMany());
  dataSql += await dumpTable("KnowledgeMedia", () => prisma.knowledgeMedia.findMany());
  dataSql += await dumpTable("Media", () => prisma.media.findMany());
  dataSql += await dumpTable("Partner", () => prisma.partner.findMany());
  dataSql += await dumpTable("SiteSetting", () => prisma.siteSetting.findMany());
  dataSql += await dumpTable("NavigationItem", () => prisma.navigationItem.findMany());
  dataSql += await dumpTable("Page", () => prisma.page.findMany());
  dataSql += await dumpTable("ContactMessage", () => prisma.contactMessage.findMany());
  dataSql += await dumpTable("AuditLog", () => prisma.auditLog.findMany());

  const header = `-- =========================================================================
-- ANTRABUMI 2026 — Complete Database Export (DDL Schema + Initial Data)
-- Generated: ${new Date().toISOString()}
-- Target Engine: MySQL 8+ / MariaDB 10.4+ (phpMyAdmin, cPanel, VPS, Cloud SQL)
-- Default Charset: utf8mb4 / utf8mb4_unicode_ci
-- =========================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

`;

  const footer = `
SET FOREIGN_KEY_CHECKS = 1;

-- =========================================================================
-- END OF DUMP
-- =========================================================================
`;

  const finalSql = header + ddl + dataSql + footer;
  const outPath = path.resolve(process.cwd(), "database.sql");
  fs.writeFileSync(outPath, finalSql, { encoding: "utf-8" });
  console.log(`[ok] Successfully generated database.sql (${finalSql.length} bytes)`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
