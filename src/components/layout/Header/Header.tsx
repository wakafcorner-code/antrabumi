// Server Component — reads language cookie and settings, passes to client
import React from "react";
import { getLanguage } from "@/lib/i18n/language";
import { findSettingByKey } from "@/server/repositories/settings.repository";
import { HeaderClient } from "./HeaderClient";

export const Header: React.FC = async () => {
  const [currentLanguage, logoSetting, nameSetting] = await Promise.all([
    getLanguage(),
    findSettingByKey("site_logo_url"),
    findSettingByKey("site_name"),
  ]);

  return (
    <HeaderClient
      currentLanguage={currentLanguage}
      logoUrl={logoSetting?.value || "/brand/logo.svg"}
      siteName={nameSetting?.value || "ANTRABUMI"}
    />
  );
};

