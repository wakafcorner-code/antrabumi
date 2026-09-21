"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { Role, AuditAction } from "@prisma/client";
import { requireUser } from "@/lib/auth/context";
import { createAuditLog } from "@/lib/audit/audit";
import { findSettingByKey, upsertSetting } from "@/server/repositories/settings.repository";
import {
  HeroSlide,
  HeroSliderConfig,
  DEFAULT_HERO_CONFIG,
  DEFAULT_HERO_SLIDES,
} from "@/types/hero";

const SETTING_KEY_SLIDES = "home_hero_slides";
const SETTING_KEY_CONFIG = "home_hero_slider_config";

const slideSchema = z.object({
  id: z.string(),
  tagline: z.string().default(""),
  taglineEn: z.string().optional(),
  title: z.string().min(1, "Judul slide wajib diisi"),
  titleEn: z.string().optional(),
  subtitle: z.string().default(""),
  subtitleEn: z.string().optional(),
  primaryCtaText: z.string().optional(),
  primaryCtaTextEn: z.string().optional(),
  primaryCtaLink: z.string().optional(),
  secondaryCtaText: z.string().optional(),
  secondaryCtaTextEn: z.string().optional(),
  secondaryCtaLink: z.string().optional(),
  imageUrl: z.string().optional(),
  order: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

const sliderConfigSchema = z.object({
  autoplay: z.boolean(),
  intervalMs: z.number().int().min(2000).max(30000),
  transitionEffect: z.enum(["fade", "slide"]),
  pauseOnHover: z.boolean(),
});

/**
 * Fetch hero slider slides and configuration from database or fallback defaults.
 */
export async function getHeroSliderDataAction(): Promise<{
  slides: HeroSlide[];
  config: HeroSliderConfig;
}> {
  try {
    const [slidesSetting, configSetting] = await Promise.all([
      findSettingByKey(SETTING_KEY_SLIDES),
      findSettingByKey(SETTING_KEY_CONFIG),
    ]);

    let slides: HeroSlide[] = DEFAULT_HERO_SLIDES;
    if (slidesSetting?.value) {
      try {
        const parsed = JSON.parse(slidesSetting.value);
        if (Array.isArray(parsed) && parsed.length > 0) {
          slides = parsed;
        }
      } catch {
        // use default
      }
    }

    let config: HeroSliderConfig = DEFAULT_HERO_CONFIG;
    if (configSetting?.value) {
      try {
        const parsed = JSON.parse(configSetting.value);
        if (parsed && typeof parsed === "object") {
          config = { ...DEFAULT_HERO_CONFIG, ...parsed };
        }
      } catch {
        // use default
      }
    }

    return { slides, config };
  } catch (error) {
    console.error("[getHeroSliderDataAction] Error:", error);
    return { slides: DEFAULT_HERO_SLIDES, config: DEFAULT_HERO_CONFIG };
  }
}

/**
 * Save hero slider slides and configuration to database.
 */
export async function saveHeroSliderAction(payload: {
  slides: HeroSlide[];
  config: HeroSliderConfig;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await requireUser(Role.EDITOR);

    const parsedSlides = z.array(slideSchema).safeParse(payload.slides);
    if (!parsedSlides.success) {
      return {
        success: false,
        error: "Format data slide tidak valid: " + parsedSlides.error.issues[0]?.message,
      };
    }

    const parsedConfig = sliderConfigSchema.safeParse(payload.config);
    if (!parsedConfig.success) {
      return {
        success: false,
        error: "Format konfigurasi slider tidak valid: " + parsedConfig.error.issues[0]?.message,
      };
    }

    // Save to SiteSetting
    await Promise.all([
      upsertSetting(SETTING_KEY_SLIDES, JSON.stringify(parsedSlides.data)),
      upsertSetting(SETTING_KEY_CONFIG, JSON.stringify(parsedConfig.data)),
    ]);

    // Record audit log
    await createAuditLog({
      userId: user.id,
      action: AuditAction.UPDATE,
      entity: "SiteSetting",
      entityId: "home_hero_slider",
      metadata: {
        slideCount: parsedSlides.data.length,
        autoplay: parsedConfig.data.autoplay,
        intervalMs: parsedConfig.data.intervalMs,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/hero");

    return { success: true };
  } catch (error) {
    console.error("[saveHeroSliderAction] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Gagal menyimpan pengaturan Hero Slider.",
    };
  }
}
