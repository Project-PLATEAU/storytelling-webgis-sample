import { FC, PropsWithChildren, useEffect } from "react";
import { I18nextProvider } from "react-i18next";

import i18n from "./load";

export const I18nProvider: FC<PropsWithChildren> = ({ children }) => {
  useEffect(() => {
    const handleLanguageChange = (lang: string) => {
      window.document.getElementsByTagName("html")[0]?.setAttribute("lang", lang);
    };
    i18n.on("languageChanged", handleLanguageChange);

    const lang = window.navigator.language?.split("-")[0] ?? "ja";
    i18n.changeLanguage(lang);

    return () => {
      i18n.off("languageChange", handleLanguageChange);
    };
  }, []);
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};
