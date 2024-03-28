import { styled } from "@linaria/react";
import { FC, useCallback } from "react";

import { MainScenes } from "../../utils";

import { BurnedContent } from "./BurnedContent";
import { DestroyedContent } from "./DestroyedContent";
import { LiquefactionContent } from "./LiquefactionContent";
import { SeismicContent } from "./SeismicContent";
import { Tokyo23Content } from "./Tokyo23Content";

export const SouthernEarthquakeContent: FC<{ scene: MainScenes }> = ({ scene }) => {
  const renderContent = useCallback(() => {
    switch (scene) {
      case MainScenes.Scene1:
        return <Tokyo23Content />;
      case MainScenes.Scene2:
        return <SeismicContent />;
      case MainScenes.Scene3:
        return <DestroyedContent />;
      case MainScenes.Scene4:
        return <BurnedContent />;
      case MainScenes.Scene5:
        return <LiquefactionContent />;
    }
  }, [scene]);

  return <Root>{renderContent()}</Root>;
};

const Root = styled.div``;
