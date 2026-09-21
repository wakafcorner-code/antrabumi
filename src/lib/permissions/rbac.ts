import { Role } from "@prisma/client";

export const ROLE_HIERARCHY: Record<Role, number> = {
  [Role.AUTHOR]: 1,
  [Role.EDITOR]: 2,
  [Role.ADMIN]: 3,
  [Role.SUPER_ADMIN]: 4,
};

export type PermissionAction =
  | "view:dashboard"
  | "content:create"
  | "content:edit"
  | "content:publish"
  | "content:archive"
  | "media:manage"
  | "messages:manage"
  | "users:manage"
  | "settings:manage"
  | "roles:manage"
  | "audit_logs:view";

export interface PermissionContext {
  isOwner?: boolean;
}

/**
 * Check if a role meets or exceeds a target role level.
 */
export function hasMinimumRole(userRole: Role, minimumRole: Role): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[minimumRole];
}

/**
 * Check if a role can view the admin dashboard.
 * All authenticated roles can view dashboard.
 */
export function canViewDashboard(role: Role): boolean {
  return hasMinimumRole(role, Role.AUTHOR);
}

/**
 * Check if a role can create new content items.
 * All roles can create content.
 */
export function canCreateContent(role: Role): boolean {
  return hasMinimumRole(role, Role.AUTHOR);
}

/**
 * Check if a role can edit a given content item.
 * AUTHOR can only edit their own content.
 * EDITOR, ADMIN, and SUPER_ADMIN can edit all content.
 */
export function canEditContent(role: Role, isOwner: boolean = false): boolean {
  if (role === Role.AUTHOR) {
    return isOwner;
  }
  return hasMinimumRole(role, Role.EDITOR);
}

/**
 * Check if a role can publish content publicly.
 * Only EDITOR, ADMIN, and SUPER_ADMIN can publish.
 * AUTHOR can NOT publish.
 */
export function canPublishContent(role: Role): boolean {
  return hasMinimumRole(role, Role.EDITOR);
}

/**
 * Check if a role can archive content.
 * AUTHOR can archive own draft/unsubmitted content.
 * EDITOR, ADMIN, SUPER_ADMIN can archive any content.
 */
export function canArchiveContent(
  role: Role,
  isOwner: boolean = false
): boolean {
  if (role === Role.AUTHOR) {
    return isOwner;
  }
  return hasMinimumRole(role, Role.EDITOR);
}

/**
 * Check if a role can manage the media library.
 * AUTHOR has limited access; EDITOR, ADMIN, SUPER_ADMIN have full access.
 */
export function canManageMedia(role: Role): boolean {
  return hasMinimumRole(role, Role.EDITOR);
}

/**
 * Check if a role can view and process contact messages.
 * Only EDITOR, ADMIN, and SUPER_ADMIN can manage messages.
 */
export function canManageMessages(role: Role): boolean {
  return hasMinimumRole(role, Role.EDITOR);
}

/**
 * Check if a role can view and manage CMS users.
 * Only ADMIN and SUPER_ADMIN can manage users.
 */
export function canManageUsers(role: Role): boolean {
  return hasMinimumRole(role, Role.ADMIN);
}

/**
 * Check if a role can change site configuration and settings.
 * Only ADMIN and SUPER_ADMIN can manage settings.
 */
export function canManageSettings(role: Role): boolean {
  return hasMinimumRole(role, Role.ADMIN);
}

/**
 * Check if a role can assign or change user roles.
 * Only SUPER_ADMIN has full role management.
 */
export function canManageRoles(role: Role): boolean {
  return role === Role.SUPER_ADMIN;
}

/**
 * Check if a role can view audit logs.
 * Only ADMIN and SUPER_ADMIN can view audit logs.
 */
export function canViewAuditLogs(role: Role): boolean {
  return hasMinimumRole(role, Role.ADMIN);
}

/**
 * Centralized authorization check: can(role, action, context)
 */
export function can(
  role: Role,
  action: PermissionAction,
  context?: PermissionContext
): boolean {
  const isOwner = context?.isOwner ?? false;

  switch (action) {
    case "view:dashboard":
      return canViewDashboard(role);
    case "content:create":
      return canCreateContent(role);
    case "content:edit":
      return canEditContent(role, isOwner);
    case "content:publish":
      return canPublishContent(role);
    case "content:archive":
      return canArchiveContent(role, isOwner);
    case "media:manage":
      return canManageMedia(role);
    case "messages:manage":
      return canManageMessages(role);
    case "users:manage":
      return canManageUsers(role);
    case "settings:manage":
      return canManageSettings(role);
    case "roles:manage":
      return canManageRoles(role);
    case "audit_logs:view":
      return canViewAuditLogs(role);
    default:
      return false;
  }
}
