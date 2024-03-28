import { styled } from "@linaria/react";
import { FC } from "react";

import { SceneIndicator } from "../components/SceneIndicator";
import { breakpointMediaQueries } from "../constants";
import { useNavigationContext } from "../contexts/NavigationContexts";
import { LayerData } from "../layers";

import { PlayControllerContainer } from "./PlayControllerContainer";
import { ZoomContainer } from "./ZoomContainer";

type Props = {
  additionalWidth: number;
  lng?: number;
  lat?: number;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  initialLayers: LayerData[];
  isTutorialCompleted: boolean;
  onOpenSceneMenu: () => void;
  isSceneMenuOpen: boolean;
};

export const AppFooterContainer: FC<Props> = ({
  additionalWidth,
  onZoomIn,
  onZoomOut,
  initialLayers,
  isTutorialCompleted,
  onOpenSceneMenu,
  isSceneMenuOpen,
}) => {
  const { navigationState } = useNavigationContext();

  return (
    <Root additionalWidth={additionalWidth}>
      {isTutorialCompleted && (
        <StyledSceneIndicator>
          <SceneIndicator navigationState={navigationState} />
        </StyledSceneIndicator>
      )}
      <ControllerContainer>
        <ControllerContainerInner>
          <PlayControllerContainer
            initialLayers={initialLayers}
            onOpenSceneMenu={onOpenSceneMenu}
            isSceneMenuOpen={isSceneMenuOpen}
          />
        </ControllerContainerInner>
      </ControllerContainer>
      <ZoomPosition>
        {isTutorialCompleted && <ZoomContainer onZoomIn={onZoomIn} onZoomOut={onZoomOut} />}
      </ZoomPosition>
    </Root>
  );
};

const Root = styled.div<{ additionalWidth: number }>`
  transition: width 500ms ease-out;
  width: ${({ additionalWidth }) => `calc(100vw - ${additionalWidth}px)`};
  z-index: 1;
  display: grid;
  grid-template: "indicator controller zoom" auto / auto 1fr auto;
  align-items: end;
  box-sizing: border-box;
  padding: 0 40px 25px 25px;
  ${breakpointMediaQueries.md} {
    display: none;
  }
`;

const ControllerContainer = styled.div`
  grid-area: controller;
  margin: 0 20px;
  margin-top: 20px;
  width: 100%;
`;

const ControllerContainerInner = styled.div`
  max-width: 744px;
  margin: 0 auto;
`;

const StyledSceneIndicator = styled.div`
  margin-bottom: -8px;
  grid-area: indicator;
`;

const ZoomPosition = styled.div`
  grid-area: zoom;
`;
