import React from "react";
import type { Preview } from "@storybook/react";
import { I18nProvider } from "../src/i18n/provider";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [
    (Story) => (
      <I18nProvider><Story /></I18nProvider>
    )
  ]
};

export default preview;
