import { FlyToInterpolator, MapViewState } from "@deck.gl/core/typed";
import { styled } from "@linaria/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ViewState } from "react-map-gl";

import { CloseButton } from "../components/CloseButton";
import { Float } from "../components/Float";
import { REPORT_WIDTH, breakPoint, breakpointMediaQueries } from "../constants";
import { SouthernEarthquakeContent } from "../contents/SouthernEarthquakeContent";
import { useFirstVisitContext } from "../contexts/FirstVisitContexts";
import { useNavigationContext } from "../contexts/NavigationContexts";
import { useScenePlayerContext } from "../contexts/ScenePlayerContexts";
import { useEffectSound, useMediaQuery, useRefValue } from "../hooks";
import { LAYERS } from "../layers";
import { MapRef } from "../map";
import { MainScenes, PageName } from "../utils/types/common";

import { AppFooterContainer } from "./AppFooterContainer";
import { AppHeaderContainer, SelectedArea } from "./AppHeaderContainer";
import { AppHeaderForMobileContainer } from "./AppHeaderForMobileContainer";
import { BGMContainer } from "./BGMContainer";
import { EpilogueContainer } from "./EpilogueContainer";
import { InfoboxContainer } from "./InfoboxContainer";
import { MapContainer } from "./MapContainer";
import { OpeningContainer } from "./OpeningContainer";
import { PlayControllerContainer } from "./PlayControllerContainer";
import { SceneMenuModalContainer } from "./SceneMenuModalContainer";
import { StorytellingContainer } from "./StorytellingContainer";

export const ViewContainer = () => {
  const { navigationState } = useNavigationContext();
  const { firstVisit } = useFirstVisitContext();
  const { isTutorialCompleted } = firstVisit;
  const isOpening = navigationState.currentPage === PageName.Opening;
  const isEpilogue = navigationState.currentScene === MainScenes.Scene6;
  const initialLayers = LAYERS;
  const { playing: isScenePlaying, play: playScene, stop: stopScene } = useScenePlayerContext();
  const { play } = useEffectSound();

  const [isReportOpen, setIsReportOpen] = useState(false);

  const [isSceneMenuOpen, setIsSceneMenuOpen] = useState(false);
  const handleOpenSceneMenu = useCallback(() => {
    play("on");
    setIsSceneMenuOpen(true);
  }, [play]);
  const handleCloseSceneMenu = useCallback(() => {
    play("on");
    setIsSceneMenuOpen(false);
  }, [play]);

  const isBreakpointMd = useMediaQuery(`(max-width: ${breakPoint.md}px)`);

  const isReportOpenRef = useRefValue(isReportOpen);
  const isScenePlayingRef = useRefValue(isScenePlaying);
  const isStopedSceneByReportOpen = useRef(false);
  const handleReportToggle = useCallback(() => {
    if (isReportOpenRef.current) {
      play("off");
    } else {
      play("on");
    }

    reportRef.current?.scrollTo(0, 0);

    // Stop scene only in mobile
    const next = !isReportOpenRef.current;
    if (isBreakpointMd && next && isScenePlayingRef.current) {
      stopScene();
      isStopedSceneByReportOpen.current = true;
    }
    if (isBreakpointMd && !next && isStopedSceneByReportOpen.current) {
      playScene();
      isStopedSceneByReportOpen.current = false;
    }

    setIsReportOpen(next);
  }, [isBreakpointMd, playScene, stopScene, play, isReportOpenRef, isScenePlayingRef]);

  const reportRef = useRef<HTMLDivElement>(null);

  const handleEffectSoundForClick = useCallback(() => {
    play("on");
  }, [play]);

  const handleEffectSoundForChange = useCallback(() => {
    play("on");
  }, [play]);

  const [viewState, setViewState] = useState<Partial<ViewState> | undefined>();

  // TODO: Handle fly to
  const handleChangeArea = useCallback(
    (area?: SelectedArea) => {
      handleEffectSoundForChange();
      if (area) {
        setViewState(v => ({
          ...v,
          longitude: area.lon,
          latitude: area.lat,
          zoom: 15,
          transitionDuration: 300,
          transitionInterpolator: new FlyToInterpolator(),
        }));
      }
    },
    [handleEffectSoundForChange],
  );

  const handleViewStateChange = useCallback((_viewState: MapViewState) => {}, []);

  const handleChangeSubScene = useCallback(() => {
    play("on");
  }, [play]);

  const mapRef = useRef<MapRef>(null);
  const handleZoomIn = useCallback(() => {
    handleEffectSoundForClick();
    mapRef.current?.zoom(1.5);
  }, [handleEffectSoundForClick]);
  const handleZoomOut = useCallback(() => {
    handleEffectSoundForClick();
    mapRef.current?.zoom(-1.5);
  }, [handleEffectSoundForClick]);

  const additionalWidth = isReportOpen ? REPORT_WIDTH : 0;

  // Report should be closed if main scene is changed
  useEffect(() => {
    setIsReportOpen(false);
  }, [navigationState.currentScene]);

  const [zIndexMinimizedReport, setZIndexMinimizedReport] = useState(isSceneMenuOpen ? 3 : 5);
  useEffect(() => {
    if (isSceneMenuOpen) {
      setZIndexMinimizedReport(3);
    } else {
      const timer = setTimeout(() => setZIndexMinimizedReport(5));
      return () => clearTimeout(timer);
    }
  }, [isSceneMenuOpen]);

  useEffect(() => {
    if (isOpening) return;
    const html = window.document.querySelector("html");
    if (!html) return;
    html.style.backgroundColor = "#E6E6FA";
  }, [isOpening]);

  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--app-vh", `${vh}px`);
    };

    setVH();
  }, []);

  return (
    <Root>
      <MapContainer
        initialLayers={initialLayers}
        ref={mapRef}
        onViewStateChange={handleViewStateChange}
        onSelectFeature={handleEffectSoundForClick}
        isReportOpen={isReportOpen}
        isBreakpointMd={isBreakpointMd}
        viewState={viewState}
      />

      {isOpening && (
        <OpeningContainer>
          {isBreakpointMd ? (
            <AppHeaderForMobileContainer
              onChangeSubScene={handleChangeSubScene}
              onOpenSceneMenu={handleOpenSceneMenu}
            />
          ) : (
            <AppHeaderContainer
              additionalWidth={additionalWidth}
              onClick={handleEffectSoundForClick}
              onChangeArea={handleChangeArea}
              onChangeLanguage={handleEffectSoundForChange}
              onChangeSubScene={handleChangeSubScene}
              isBreakpointMd={isBreakpointMd}
            />
          )}
        </OpeningContainer>
      )}

      {!isOpening && isEpilogue && (
        <EpilogueContainer>
          {isBreakpointMd ? (
            <AppHeaderForMobileContainer
              onChangeSubScene={handleChangeSubScene}
              onOpenSceneMenu={handleOpenSceneMenu}
            />
          ) : (
            <AppHeaderContainer
              additionalWidth={additionalWidth}
              onClick={handleEffectSoundForClick}
              onChangeArea={handleChangeArea}
              onChangeLanguage={handleEffectSoundForChange}
              onChangeSubScene={handleChangeSubScene}
              isBreakpointMd={isBreakpointMd}
            />
          )}
        </EpilogueContainer>
      )}

      {!isOpening && !isEpilogue && (
        <Float
          name="header"
          direction="y"
          from="-100%"
          to="0"
          duration={1000}
          delay={300}
          zIndex={4}>
          {isBreakpointMd ? (
            <AppHeaderForMobileContainer
              onChangeSubScene={handleChangeSubScene}
              onOpenSceneMenu={handleOpenSceneMenu}
            />
          ) : (
            <AppHeaderContainer
              additionalWidth={additionalWidth}
              onClick={handleEffectSoundForClick}
              onChangeArea={handleChangeArea}
              onChangeLanguage={handleEffectSoundForChange}
              onChangeSubScene={handleChangeSubScene}
              isBreakpointMd={isBreakpointMd}
              isTitleWhite={isSceneMenuOpen}
            />
          )}
        </Float>
      )}

      {!isOpening && !isEpilogue && (
        <Float
          name="report"
          direction={isBreakpointMd ? "y" : "x"}
          from="100%"
          to="0"
          duration={1000}
          delay={300}
          zIndex={zIndexMinimizedReport}>
          <StorytellingContainer
            reportRef={reportRef}
            isOpen={isReportOpen}
            onClick={handleReportToggle}
            isBreakpointMd={isBreakpointMd}
          />
        </Float>
      )}
      {!isOpening && isBreakpointMd && !isEpilogue && (
        <Float
          name="controller"
          direction="y"
          from="100%"
          to="0"
          duration={1000}
          delay={300}
          zIndex={4}>
          <ControllerPosition>
            <PlayControllerContainer
              initialLayers={initialLayers}
              onOpenSceneMenu={handleOpenSceneMenu}
              isSceneMenuOpen={isSceneMenuOpen}
            />
          </ControllerPosition>
        </Float>
      )}

      {!isOpening && !isBreakpointMd && !isEpilogue && (
        <Float
          name="footer"
          direction="y"
          from="100%"
          to="0"
          duration={1000}
          delay={300}
          zIndex={4}>
          <AppFooterContainer
            initialLayers={initialLayers}
            additionalWidth={additionalWidth}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            isTutorialCompleted={isTutorialCompleted}
            onOpenSceneMenu={handleOpenSceneMenu}
            isSceneMenuOpen={isSceneMenuOpen}
          />
        </Float>
      )}

      {!isOpening && <InfoboxContainer />}

      {isBreakpointMd && (
        <Report ref={reportRef} isOpen={isReportOpen}>
          <CloseButtonContainer>
            <CloseButton onClick={handleReportToggle} />
          </CloseButtonContainer>
          <SouthernEarthquakeContent key="1" scene={navigationState.currentScene as MainScenes} />
        </Report>
      )}

      <SceneMenuModalContainer
        show={isSceneMenuOpen}
        onClose={handleCloseSceneMenu}
        onClick={handleEffectSoundForClick}
        onChangeArea={handleChangeArea}
        onChangeLanguage={handleEffectSoundForChange}
        isBreakpointMd={isBreakpointMd}
      />

      <BGMContainer />
    </Root>
  );
};

const Root = styled.div`
  width: 100vw;
  height: 100dvh;
  position: relative;
  display: grid;
  grid-template:
    "header header report" auto
    "scene . report" 1fr
    "footer footer report" auto / auto 1fr auto;

  ${breakpointMediaQueries.md} {
    grid-template:
      "header header header" auto
      ". . ." 1fr
      "controller controller controller" auto
      "report report report" auto;
  }
`;

const ControllerPosition = styled.div`
  margin: 0 15px;
`;

const Report = styled.div<{ isOpen: boolean }>`
  max-height: 100%;
  height: 100%;
  padding: 20px 30px;
  box-sizing: border-box;
  position: fixed;
  width: 100vw;
  height: 100%;
  transition:
    opacity 300ms ease-out,
    visibility 300ms ease-out;
  overflow-y: auto;
  opacity: ${({ isOpen }) => (isOpen ? "1" : "0")};
  visibility: ${({ isOpen }) => (isOpen ? "visible" : "hidden")};
  background-color: #fff;
  z-index: 5;
`;

const CloseButtonContainer = styled.div`
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 1;
`;
