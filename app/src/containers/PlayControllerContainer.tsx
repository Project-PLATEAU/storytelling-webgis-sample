import { styled } from "@linaria/react";
import { uniqBy } from "lodash-es";
import { FC, useCallback, useMemo } from "react";

import { Hamburger } from "../components/icons/Hamburger";
import { PlayController, StepItem } from "../components/PlayController";
import { RoundButton } from "../components/RoundButton";
import { breakpointMediaQueries } from "../constants";
import { useFirstVisitContext } from "../contexts/FirstVisitContexts";
import { useNavigationContext } from "../contexts/NavigationContexts";
import { useScenePlayerContext } from "../contexts/ScenePlayerContexts";
import { useEffectSound, useRefValue } from "../hooks";
import { LayerData } from "../layers";
import { MainScenes, PageName } from "../utils";

import { WAIT_ANIMATION } from "./MapContainer";

type Props = {
  initialLayers: LayerData[];
  onOpenSceneMenu: () => void;
  isSceneMenuOpen: boolean;
};

const EPILOGUE_SCENE = MainScenes.Scene6;
const OPENING_NAME = "OP";
const MAIN_SCENE_ORDER: MainScenes[] = Object.values(MainScenes);

type SceneStep = Omit<StepItem, "duration"> & {
  id?: string;
  contents: (Pick<StepItem, "contents">["contents"][number] & {
    isMain?: boolean;
  })[];
};

export const PlayControllerContainer: FC<Props> = ({
  initialLayers,
  onOpenSceneMenu,
  isSceneMenuOpen,
}) => {
  const { navigationState, setCurrentPage, setCurrentScene, setCurrentSceneContentIndex } =
    useNavigationContext();
  const { playing, toggle, setShouldSceneDescriptionShow } = useScenePlayerContext();
  const { play: playEffectSound } = useEffectSound();
  const { firstVisit } = useFirstVisitContext();
  const { isTutorialCompleted } = firstVisit;

  const steps: SceneStep[] = useMemo(
    () => [
      {
        name: OPENING_NAME,
        contents: [
          {
            duration: 30000, // Dummy duration
          },
        ],
      },
      ...MAIN_SCENE_ORDER.filter(s => s !== EPILOGUE_SCENE).reduce((result, scene) => {
        const targets = initialLayers.filter(l => l.scene.includes(scene));
        const step = {
          id: scene,
          contents: uniqBy(targets, t => t.contentIndex)
            .map(t =>
              t.contentDuration
                ? {
                    isMain: t.isMain,
                    duration: t.contentDuration + WAIT_ANIMATION,
                  }
                : undefined,
            )
            .filter((t): t is NonNullable<typeof t> => !!t),
        };
        result.push(step);
        return result;
      }, [] as SceneStep[]),
      {
        id: EPILOGUE_SCENE,
        name: "EP",
        contents: [
          {
            duration: 30000, // Dummy duration
          },
        ],
      },
    ],
    [initialLayers],
  );

  const currentMainStepIndex = useMemo(
    () => steps.findIndex(s => s.id === navigationState.currentScene),
    [steps, navigationState.currentScene],
  );

  const navigationStateRef = useRefValue(navigationState);
  const handleChangeStep = useCallback(
    (currentMainStepIndex: number, currentContentStepIndex: number) => {
      const currentStep = steps[currentMainStepIndex];

      if (!currentStep) return;

      if (
        currentStep.name === OPENING_NAME &&
        navigationStateRef.current.currentPage !== PageName.Opening
      ) {
        setCurrentPage(PageName.Opening);
        return;
      }

      const mainSceneKey = currentStep.id;
      if (!mainSceneKey) return;
      const nextScene = MAIN_SCENE_ORDER.find(s => s === mainSceneKey);
      if (nextScene) {
        setCurrentScene(nextScene);
        setCurrentSceneContentIndex(currentContentStepIndex);

        const { isMain } = currentStep.contents[currentContentStepIndex] ?? {};
        if (isMain) {
          setShouldSceneDescriptionShow(true);
        } else {
          setShouldSceneDescriptionShow(false);
        }
      }
    },
    [
      steps,
      navigationStateRef,
      setCurrentPage,
      setCurrentScene,
      setCurrentSceneContentIndex,
      setShouldSceneDescriptionShow,
    ],
  );

  const handleOnClickController = useCallback(() => {
    playEffectSound("on");
  }, [playEffectSound]);

  return (
    <Root>
      <PlayControllerWrapper>
        <PlayController
          steps={steps}
          onChangeStep={handleChangeStep}
          currentMainStepIndex={currentMainStepIndex}
          currentContentStepIndex={navigationState.currentSceneContentIndex}
          isPlaying={isTutorialCompleted && playing}
          onClickPlayButton={toggle}
          onClick={handleOnClickController}
        />
        <MenuButtonWrapper id="PcMenuButton">
          <MenuButton className={isSceneMenuOpen ? "hide" : ""} onClick={onOpenSceneMenu}>
            <Hamburger />
          </MenuButton>
        </MenuButtonWrapper>
      </PlayControllerWrapper>
    </Root>
  );
};

const Root = styled.div`
  z-index: 1;
`;

const PlayControllerWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 28px;
`;

const MenuButton = styled(RoundButton)`
  transition:
    opacity 300ms ease-in,
    visibility 300ms ease-in;
  opacity: 1;
  visibility: visible;
  &.hide {
    opacity: 0;
    visibility: hidden;
  }
`;

const MenuButtonWrapper = styled.div`
  ${breakpointMediaQueries.md} {
    display: none;
  }
`;
