import i18next from "i18next";
import HttpApi from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

i18next
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(HttpApi) // passes i18n down to react-i18next
  .init({
    fallbackLng: "ja",
    // allow keys to be phrases having `:`, `.`
    nsSeparator: false,
    keySeparator: false,
    returnEmptyString: false,
    returnNull: false,
    backend: {
      loadPath: function (lng: string, ns: string) {
        return `locales/${lng}/${ns}.json`;
      },
    },
  });

export default i18next;
