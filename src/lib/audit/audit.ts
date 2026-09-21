import { prisma } from "@/lib/db/prisma";
import { AuditAction, Prisma } from "@prisma/client";

export interface CreateAuditLogParams {
  userId?: string | null;
  action: AuditAction;
  entity?: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Record an audit log entry in the database.
 * Never fails caller operations if logging fails.
 */
export async function createAuditLog(
  params: CreateAuditLogParams
): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: params.userId ?? null,
        action: params.action,
        entity: params.entity,
        entityId: params.entityId,
        metadata: (params.metadata as Prisma.InputJsonValue) ?? Prisma.JsonNull,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
      },
    });
  } catch (error) {
    console.error("[AuditLog Error] Failed to create audit log entry:", error);
  }
}
