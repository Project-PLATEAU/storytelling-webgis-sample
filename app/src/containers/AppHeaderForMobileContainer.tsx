import { styled } from "@linaria/react";
import { FC, useCallback } from "react";

import { AppHeaderForMobile } from "../components/AppHeader/AppHeaderForMobile";
import { useNavigationContext } from "../contexts/NavigationContexts";
import { Area, MainScenes, SubScenes, PageName } from "../utils";

export type SelectedArea = Area;

type Props = {
  onChangeSubScene?: (subScene?: SubScenes) => void;
  onOpenSceneMenu: () => void;
};

export const AppHeaderForMobileContainer: FC<Props> = ({ onChangeSubScene, onOpenSceneMenu }) => {
  const { navigationState, setCurrentSubScene } = useNavigationContext();

  const isOpening = navigationState.currentPage === PageName.Opening;

  const handleChangeSubScene = useCallback(
    (v: boolean) => {
      const subScene = v ? SubScenes.Tama : SubScenes.Toshin;
      setCurrentSubScene(subScene);
      onChangeSubScene?.(subScene);
    },
    [setCurrentSubScene, onChangeSubScene],
  );

  return (
    <Root>
      <AppHeaderForMobile
        isSwitchButtonActive={navigationState.currentSubScene === SubScenes.Tama}
        onChangeSubScene={handleChangeSubScene}
        showSwitchSubSceneButton={
          navigationState.currentScene !== MainScenes.Scene1 &&
          navigationState.currentScene !== MainScenes.Scene6
        }
        isOpening={isOpening}
        onOpenSceneMenu={onOpenSceneMenu}
      />
    </Root>
  );
};

const Root = styled.div`
  transition: width 500ms ease-out;
  z-index: 1;
  width: 100%;
`;
