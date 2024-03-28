import { styled } from "@linaria/react";
import { FC, RefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { CloseButton } from "../components/CloseButton";
import { FadeAnimation } from "../components/FadeAnimation/FadeAnimation";
import { LegendContentItem, MinimizedReport } from "../components/MinimizedReport";
import { ScrollableContents } from "../components/ScrollableContents";
import {
  BURNED_OVERLAY,
  BURNED_OVERLAY_CONTENT_INDEX,
  BURNED_OVERLAY_MAIN_SCENE,
  REPORT_WIDTH,
  SCENE_LEGEND,
  breakpointMediaQueries,
} from "../constants";
import { SouthernEarthquakeContent } from "../contents/SouthernEarthquakeContent";
import { useNavigationContext } from "../contexts/NavigationContexts";
import { useScenePlayerContext } from "../contexts/ScenePlayerContexts";
import { useEffectSound, useHideAnimation } from "../hooks";
import { useTranslation } from "../i18n/hooks";
import { MainScenes } from "../utils";

type Props = {
  isOpen: boolean;
  isBreakpointMd: boolean;
  onClick: () => void;
  reportRef: RefObject<HTMLDivElement>;
};

const TIMEOUT_SCENE_MINIMIZED_REPORT = 500;

const MainScenesArray = Object.values(MainScenes);

export const StorytellingContainer: FC<Props> = ({
  isOpen,
  onClick,
  isBreakpointMd,
  reportRef,
}) => {
  const {
    navigationState: { currentScene },
  } = useNavigationContext();

  const minimizedReportContent = useRef<HTMLDivElement>(null);
  const [minimizedReportContentHeight, setMinimizedReportContentHeight] = useState(0);

  const onPageTransition = (pageIndex: number) => {
    console.log("onPageTransition", pageIndex);
  };

  const { t } = useTranslation();
  const { navigationState } = useNavigationContext();
  const { shouldSceneDescriptioShow } = useScenePlayerContext();
  const { play } = useEffectSound();

  const title = useMemo(
    () => t(MainScenesArray.find(v => v === navigationState.currentScene) ?? ""),
    [t, navigationState.currentScene],
  );
  const { value: minimizedReportTitle, hide: hideTitle } = useHideAnimation(
    title,
    TIMEOUT_SCENE_MINIMIZED_REPORT,
  );

  const isInBurnedOverlay =
    navigationState.currentScene === BURNED_OVERLAY_MAIN_SCENE &&
    navigationState.currentSceneContentIndex === BURNED_OVERLAY_CONTENT_INDEX;

  const translatedSceneLegends = useMemo(() => {
    const sceneName = isInBurnedOverlay
      ? BURNED_OVERLAY
      : (navigationState.currentScene as MainScenes);
    const nextList = SCENE_LEGEND[sceneName] as LegendContentItem[];
    return nextList.map((next, nextIndex) => ({
      ...next,
      title: t(`${sceneName}_${nextIndex}_legend_title`),
      items: next?.items?.map((v, i) => ({
        ...v,
        label: t(`${sceneName}_${nextIndex}_legend_${i}`),
      })),
    }));
  }, [isInBurnedOverlay, navigationState.currentScene, t]);
  const { value: sceneLegendPropsList, hide: hideLegend } = useHideAnimation(
    translatedSceneLegends,
    TIMEOUT_SCENE_MINIMIZED_REPORT,
  );

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

  const { value: sceneDescriptionProps, hide: hideSceneDescription } = useHideAnimation(
    prevSceneDescriptionProps,
    TIMEOUT_SCENE_MINIMIZED_REPORT,
  );

  useEffect(() => {
    setMinimizedReportContentHeight(minimizedReportContent.current?.clientHeight ?? 0);
  }, [minimizedReportTitle]);

  const handleClickMinimizedReport = useCallback(
    (isOpen: boolean) => {
      if (isOpen) {
        play("on");
      } else {
        play("off");
      }
    },
    [play],
  );

  return (
    <Root
      id="reportContainer"
      duration={TIMEOUT_SCENE_MINIMIZED_REPORT}
      className={
        !isBreakpointMd &&
        (hideTitle || hideLegend || hideSceneDescription || !shouldSceneDescriptioShow)
          ? "hide"
          : ""
      }>
      <MinimizedReportContainer
        duration={TIMEOUT_SCENE_MINIMIZED_REPORT}
        className={!isBreakpointMd && isOpen ? "hide" : ""}>
        <div
          style={{
            minHeight: isBreakpointMd ? 0 : minimizedReportContentHeight,
          }}
          ref={minimizedReportContent}>
          <MinimizedReport
            title={minimizedReportTitle}
            legends={sceneLegendPropsList}
            sourceLabel={sceneDescriptionProps.source.title ?? ""}
            sourceUrl={sceneDescriptionProps.source.url ?? ""}
            description={sceneDescriptionProps.content ?? ""}
            onOpenReport={onClick}
            onClick={handleClickMinimizedReport}
            isDefaultOpen={isBreakpointMd ? shouldSceneDescriptioShow && !isInBurnedOverlay : true}
          />
        </div>
      </MinimizedReportContainer>
      {!isBreakpointMd && (
        <ReportContainer isOpen={isOpen}>
          <CloseButtonContainer>
            <CloseButton onClick={onClick} width={30} height={30} />
          </CloseButtonContainer>
          <ScrollableContents
            ref={reportRef}
            onPageTransition={onPageTransition}
            updateKey={navigationState.currentScene}>
            {[<SouthernEarthquakeContent key="1" scene={currentScene as MainScenes} />]}
          </ScrollableContents>
        </ReportContainer>
      )}
    </Root>
  );
};

const Root = styled(FadeAnimation)`
  position: relative;
  height: 100%;
`;

const ReportContainer = styled.div<{ isOpen: boolean }>`
  position: relative;
  pointer-events: auto;
  transition: transform 500ms ease-out;
  transform: translateX(${({ isOpen }) => (isOpen ? "0" : `${REPORT_WIDTH}px`)});
  max-height: 100svh;
  max-height: 100dvh;
  height: 100%;
  width: ${REPORT_WIDTH}px;
  background: #ffffff;
  box-sizing: border-box;
`;

const MinimizedReportContainer = styled(FadeAnimation)`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: ${REPORT_WIDTH}px;
  display: flex;
  justify-content: end;
  padding-right: 30px;
  box-sizing: border-box;

  ${breakpointMediaQueries.md} {
    position: relative;
    padding-top: 20px;
    padding-right: 0px;
    top: 0;
    width: 100%;
    transform: translateY(0%);
  }
`;

const CloseButtonContainer = styled.div`
  position: absolute;
  top: 30px;
  right: 30px;
  z-index: 1;
`;
