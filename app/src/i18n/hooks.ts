import { useTranslation as useNextTranslation } from "react-i18next";

export const useTranslation = () => {
  return useNextTranslation("translation");
};
