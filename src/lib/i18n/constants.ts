import { Language } from "@prisma/client";

export const LANG_COOKIE = "antrabumi_lang";
export const DEFAULT_LANG: Language = Language.ID;

/** Label map for display purposes (client & server safe). */
export const LANG_LABELS: Record<Language, string> = {
  [Language.ID]: "ID",
  [Language.EN]: "EN",
};
