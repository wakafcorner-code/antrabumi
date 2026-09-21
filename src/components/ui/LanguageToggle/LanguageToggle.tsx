"use client";

import React, { useTransition, useOptimistic } from "react";
import { Language } from "@prisma/client";
import { setLanguageAction } from "@/lib/i18n/actions";
import { LANG_LABELS } from "@/lib/i18n/constants";

interface LanguageToggleProps {
  current: Language;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({ current }) => {
  const [isPending, startTransition] = useTransition();
  const [optimisticLang, setOptimisticLang] = useOptimistic(current);

  const handleSwitch = (lang: Language) => {
    if (lang === optimisticLang || isPending) return;
    startTransition(async () => {
      setOptimisticLang(lang);
      await setLanguageAction(lang);
      // Reload to re-render server components with new language
      window.location.reload();
    });
  };

  const languages: Language[] = [Language.ID, Language.EN];

  return (
    <div
      role="group"
      aria-label="Pilih bahasa"
      className="flex items-center rounded-full border border-neutral-200 bg-neutral-50 p-0.5"
    >
      {languages.map((lang) => {
        const isActive = optimisticLang === lang;
        return (
          <button
            key={lang}
            type="button"
            onClick={() => handleSwitch(lang)}
            disabled={isPending}
            aria-pressed={isActive}
            aria-label={`Bahasa ${LANG_LABELS[lang]}`}
            className={[
              "rounded-full px-3 py-1 text-xs font-semibold transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
              isActive
                ? "bg-neutral-900 text-white shadow-sm"
                : "text-neutral-500 hover:text-neutral-800",
              isPending ? "cursor-wait opacity-60" : "cursor-pointer",
            ].join(" ")}
          >
            {LANG_LABELS[lang]}
          </button>
        );
      })}
    </div>
  );
};
