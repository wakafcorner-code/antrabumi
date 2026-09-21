"use server";

import { cookies } from "next/headers";
import { Language } from "@prisma/client";
import { LANG_COOKIE } from "@/lib/i18n/constants";

/** Server Action — sets the language cookie and reloads. Called from LanguageToggle. */
export async function setLanguageAction(lang: Language): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(LANG_COOKIE, lang, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: "lax",
    httpOnly: false, // readable client-side if needed
  });
}
