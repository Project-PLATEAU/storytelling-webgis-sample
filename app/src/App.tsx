import { FC, PropsWithChildren } from "react";

import { ComposedProvider } from "./contexts/ComposedProvider";
import { I18nProvider } from "./i18n";

export const App: FC<PropsWithChildren> = ({ children }) => {
  return (
    <I18nProvider>
      <ComposedProvider>{children}</ComposedProvider>
    </I18nProvider>
  );
};
