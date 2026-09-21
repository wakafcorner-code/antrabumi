/**
 * prisma/reset-admin-password.ts
 *
 * One-time script to re-hash the admin password with bcrypt.
 * Run with: npx tsx prisma/reset-admin-password.ts
 */

import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/auth/password";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL ?? "admin@antrabumi.org";
  const plainPassword = process.env.SEED_ADMIN_PASSWORD ?? "change-me-in-production";

  const hashed = await hashPassword(plainPassword);

  const user = await prisma.user.update({
    where: { email },
    data: { passwordHash: hashed },
  });

  console.log(`[ok] Password re-hashed (bcrypt) for: ${user.email}`);
}

main()
  .catch((e) => {
    console.error("[error]", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
