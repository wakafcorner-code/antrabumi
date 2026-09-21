import { cookies } from "next/headers";
import { Language } from "@prisma/client";
import { LANG_COOKIE } from "./constants";

export * from "./constants";

/** Read the current language preference from the request cookie (server-side). */
export async function getLanguage(): Promise<Language> {
  const cookieStore = await cookies();
  const value = cookieStore.get(LANG_COOKIE)?.value;
  if (value === Language.EN) return Language.EN;
  return Language.ID;
}
