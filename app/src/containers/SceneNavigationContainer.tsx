import { styled } from "@linaria/react";
import { FC, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { SceneDescription } from "../components/SceneDescription";
import { SceneDescriptionProps } from "../components/SceneDescription/SceneDescription";
import { SceneNavigation } from "../components/SceneNavigation";
import { breakpointMediaQueries } from "../constants";
import { useNavigationContext } from "../contexts/NavigationContexts";
import { useScenePlayerContext } from "../contexts/ScenePlayerContexts";
import { useHideAnimation } from "../hooks";
import { MainScenes, PageName, PageScenes, SubScenes } from "../utils";

const TIMEOUT_SCENE_DESCRIPTION = 500;

export const SceneNavigationContainer: FC<{
  onClick?: () => void;
  resetTimer: number;
  isSpNavOpen: boolean;
  handleSpNavState: () => void;
}> = ({ onClick, resetTimer, isSpNavOpen, handleSpNavState }) => {
  const { navigationState, setCurrentScene, setCurrentSceneContentIndex } = useNavigationContext();
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const { shouldSceneDescriptioShow } = useScenePlayerContext();

  const handleSetCurrentScene = useCallback(
    (currentScene: PageScenes[PageName]) => {
      setCurrentScene(currentScene);
      setCurrentSceneContentIndex(0);
    },
    [setCurrentScene, setCurrentSceneContentIndex],
  );

  const moveToNextScene = useCallback(() => {
    if (navigationState.currentPage !== PageName.Main) return;
    const currentSceneIndex = Object.values(MainScenes).indexOf(
      navigationState.currentScene as MainScenes,
    );
    const nextSceneIndex = (currentSceneIndex + 1) % Object.values(MainScenes).length;
    const nextScene = Object.values(MainScenes)[nextSceneIndex];
    setCurrentScene(nextScene);
  }, [navigationState, setCurrentScene]);

  const isToshin = navigationState.currentSubScene === SubScenes.Toshin;

  const prevSceneDescriptionProps = useMemo(() => {
    // WORKALOND TO CHECK UNDEFINED.
    const title = t(`${navigationState.currentScene}_source_title`, {
      defaultValue: "NONE",
    });
    const url = t(`${navigationState.currentScene}_source_url`, {
      defaultValue: "NONE",
    });
    return {
      content: t(`${navigationState.currentScene}_description`),
      source: {
        title: title !== "NONE" ? title : undefined,
        url: url !== "NONE" ? url : undefined,
      },
      navigationState: navigationState,
    };
  }, [navigationState, t]);

  const { value: sceneDescriptionProps, hide: hideSceneDescription } =
    useHideAnimation<SceneDescriptionProps>(prevSceneDescriptionProps, TIMEOUT_SCENE_DESCRIPTION);

  return (
    <Root>
      <SceneNavigationWrapper isSpNavOpen={isSpNavOpen}>
        <SceneNavigation
          navigationState={navigationState}
          setCurrentScene={handleSetCurrentScene}
          onClick={onClick}
          resetTimer={resetTimer}
          onNextScene={moveToNextScene}
          isSpNavOpen={isSpNavOpen}
          handleSpNavState={handleSpNavState}
        />
      </SceneNavigationWrapper>
      {!isSpNavOpen && (
        <SceneDescriptionWrapper
          className={!isToshin || hideSceneDescription || !shouldSceneDescriptioShow ? "hide" : ""}>
          <SceneDescription
            {...sceneDescriptionProps}
            lineHeight={language === "en" ? "150%" : "200%"}
          />
        </SceneDescriptionWrapper>
      )}
    </Root>
  );
};

export const SCENE_NAVIGATION_WIDTH = 250;

const Root = styled.div`
  display: flex;
  ${breakpointMediaQueries.md} {
    font-size: 12px;
    line-height: 130%;
    flex-direction: column-reverse;
  }
`;

const SceneNavigationWrapper = styled.div<{ isSpNavOpen: boolean }>`
  z-index: 99;
  max-width: ${SCENE_NAVIGATION_WIDTH}px;
  background: transparent;
  display: flex;
  flex-direction: column;
  margin-left: ${({ isSpNavOpen }) => (isSpNavOpen ? `calc(100vw / 7)` : `20px`)};

  ${breakpointMediaQueries.md} {
    margin-left: ${({ isSpNavOpen }) => (isSpNavOpen ? `calc(100vw / 7)` : `10px`)};
  }
`;

const SceneDescriptionWrapper = styled.div`
  margin-left: 30px;
  opacity: 0;
  animation: ${TIMEOUT_SCENE_DESCRIPTION}ms ease-out 0s fadein;
  animation-fill-mode: forwards;
  @keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  &.hide {
    opacity: 1;
    animation: ${TIMEOUT_SCENE_DESCRIPTION}ms ease-out 0s fadeout;
    animation-fill-mode: forwards;
    @keyframes fadeout {
      from {
        opacity: 1;
      }
      to {
        opacity: 0;
      }
    }
  }

  ${breakpointMediaQueries.md} {
    margin-left: 10px;
    margin-bottom: 10px;
    min-height: 150px; // To prevent CLS
    display: flex;
    align-items: end;
  }
`;
