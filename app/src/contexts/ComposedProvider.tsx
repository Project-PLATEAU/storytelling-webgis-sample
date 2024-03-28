import { FC, PropsWithChildren } from "react";

import { BurnedOverlayProvider } from "./BurnedOverlayContexts";
import { FirstVisitProvider } from "./FirstVisitContexts";
import { MarkerDataProvider } from "./MarkerContexts";
import { NavigationProvider } from "./NavigationContexts";
import { ScenePlayerProvider } from "./ScenePlayerContexts";
import { SoundProvider } from "./SoundContexts";

const composeComponents = (...components: FC<PropsWithChildren<any>>[]) => {
  if (components.length === 0) {
    return (arg: any) => arg;
  }
  if (components.length === 1) {
    return components[0];
  }
  return components.reduce((A, B) => {
    const WrappedComponent = (props: PropsWithChildren<any>) => (
      <A>
        <B {...props} />
      </A>
    );
    WrappedComponent.displayName = `Wrapped(${A.displayName || A.name})+(${
      B.displayName || B.name
    })`;
    return WrappedComponent;
  });
};

export const ComposedProvider = composeComponents(
  FirstVisitProvider,
  SoundProvider,
  NavigationProvider,
  MarkerDataProvider,
  ScenePlayerProvider,
  BurnedOverlayProvider,
);
