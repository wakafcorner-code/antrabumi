"use server";

import { revalidatePath } from "next/cache";
import { Role, AuditAction } from "@prisma/client";
import { requireUser } from "@/lib/auth/context";
import { createAuditLog } from "@/lib/audit/audit";
import { findSettingByKey, upsertSetting } from "@/server/repositories/settings.repository";
import { HomeSectionsContent, DEFAULT_HOME_CONTENT } from "@/types/home-content";

const SETTING_KEY_HOME_CONTENT = "home_sections_content";

/**
 * Get all homepage sections content from SiteSetting or fallback defaults.
 */
export async function getHomeContentAction(): Promise<HomeSectionsContent> {
  try {
    const setting = await findSettingByKey(SETTING_KEY_HOME_CONTENT);
    if (!setting?.value) {
      return DEFAULT_HOME_CONTENT;
    }

    const parsed = JSON.parse(setting.value);
    if (parsed && typeof parsed === "object") {
      return {
        whyUs: { ...DEFAULT_HOME_CONTENT.whyUs, ...(parsed.whyUs || {}) },
        about: { ...DEFAULT_HOME_CONTENT.about, ...(parsed.about || {}) },
        pillars: Array.isArray(parsed.pillars) && parsed.pillars.length > 0 ? parsed.pillars : DEFAULT_HOME_CONTENT.pillars,
        growth: {
          ...DEFAULT_HOME_CONTENT.growth,
          ...(parsed.growth || {}),
          timeline: Array.isArray(parsed.growth?.timeline) && parsed.growth.timeline.length > 0
            ? parsed.growth.timeline
            : DEFAULT_HOME_CONTENT.growth.timeline,
        },
        framework: {
          ...DEFAULT_HOME_CONTENT.framework,
          ...(parsed.framework || {}),
          steps: Array.isArray(parsed.framework?.steps) && parsed.framework.steps.length > 0
            ? parsed.framework.steps
            : DEFAULT_HOME_CONTENT.framework.steps,
        },
        cta: { ...DEFAULT_HOME_CONTENT.cta, ...(parsed.cta || {}) },
      };
    }

    return DEFAULT_HOME_CONTENT;
  } catch (error) {
    console.error("[getHomeContentAction] Error:", error);
    return DEFAULT_HOME_CONTENT;
  }
}

/**
 * Save homepage sections content to SiteSetting.
 */
export async function saveHomeContentAction(
  content: HomeSectionsContent
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await requireUser(Role.EDITOR);

    if (!content || typeof content !== "object") {
      return { success: false, error: "Data konten tidak valid." };
    }

    await upsertSetting(SETTING_KEY_HOME_CONTENT, JSON.stringify(content));

    await createAuditLog({
      userId: user.id,
      action: AuditAction.UPDATE,
      entity: "SiteSetting",
      entityId: "home_sections_content",
      metadata: { updatedSections: Object.keys(content) },
    });

    revalidatePath("/");
    revalidatePath("/admin/beranda");

    return { success: true };
  } catch (error) {
    console.error("[saveHomeContentAction] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Gagal menyimpan konten beranda.",
    };
  }
}
