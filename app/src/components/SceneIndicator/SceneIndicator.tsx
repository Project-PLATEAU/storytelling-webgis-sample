import { styled } from "@linaria/react";
import { FC } from "react";

import { breakpointMediaQueries } from "../../constants";
import { MainScenes, NavigationState } from "../../utils/types/common";

type SceneIndicatorProps = {
  navigationState: NavigationState;
};

export const SceneIndicator: FC<SceneIndicatorProps> = ({ navigationState }) => {
  return (
    <Root>
      <SceneLabel>SCENE</SceneLabel>
      <div>
        <SceneNumber>{navigationState.currentScene.slice(6)}</SceneNumber>
        <SceneTotal>/ {String(Object.values(MainScenes).length).padStart(2, "0")}</SceneTotal>
      </div>
    </Root>
  );
};

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  ${breakpointMediaQueries.md} {
    display: none;
  }
`;

const SceneLabel = styled.span`
  font-size: 0.8em;
  color: #ffffff;
  font-weight: bold;
`;

const SceneNumber = styled.span`
  font-size: 84px;
  color: #ffffff;
  font-weight: bold;
  line-height: 1;
`;

const SceneTotal = styled.span`
  font-size: 34px;
  color: #ffffff;
  margin-left: 5px;
`;
