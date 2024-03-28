import type { Preview } from "@storybook/react";
import i18n from "./i18next";

const preview: Preview = {
  globals: {
    locale: "en",
    locales: {
      en: "English",
      ja: "日本語",
    },
  },
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    i18n,
  },
};

export default preview;
