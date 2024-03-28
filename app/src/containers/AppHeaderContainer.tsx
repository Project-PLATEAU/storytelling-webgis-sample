import { styled } from "@linaria/react";
import { FC, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import { AppHeader } from "../components/AppHeader";
import { breakpointMediaQueries, LANGUAGES } from "../constants";
import { AREAS } from "../constants/23wards";
import { useNavigationContext } from "../contexts/NavigationContexts";
import { useSoundContext } from "../contexts/SoundContexts";
import { Area, MainScenes, OpeningScenes, SubScenes, PageName } from "../utils";

export type SelectedArea = Area;

type Props = {
  additionalWidth: number;
  onClick?: () => void;
  onChangeLanguage?: (lang: string) => void;
  onChangeArea?: (area?: SelectedArea) => void;
  onChangeSubScene?: (subScene?: SubScenes) => void;
  isBreakpointMd: boolean;
  isTitleWhite?: boolean;
};

export const AppHeaderContainer: FC<Props> = ({
  additionalWidth,
  onClick,
  onChangeLanguage,
  onChangeArea,
  onChangeSubScene,
  isBreakpointMd,
  isTitleWhite,
}) => {
  const {
    i18n: { language, changeLanguage },
  } = useTranslation();
  const { navigationState, setCurrentPage, setCurrentScene, setCurrentSubScene } =
    useNavigationContext();
  const { sound, setSound } = useSoundContext();

  const [selectedArea, setSelectedArea] = useState<Area | undefined>();

  const isOpening = navigationState.currentPage === PageName.Opening;
  const isOpeningScene1 = navigationState.currentScene === OpeningScenes.Scene1;
  const isEpilogue = navigationState.currentScene === MainScenes.Scene6;

  const handleBackToTopPage = useCallback(() => {
    setCurrentPage(PageName.Opening);
    setCurrentScene(OpeningScenes.Scene1);
  }, [setCurrentPage, setCurrentScene]);

  const handleChangeLanguage = useCallback(() => {
    const changedTo = language === "en" ? "ja" : "en";
    onChangeLanguage?.(changedTo);
    changeLanguage(changedTo);
  }, [changeLanguage, onChangeLanguage, language]);
  const handleChangeArea = useCallback(
    (v: string) => {
      const foundArea = AREAS.find(p => p.id === v);
      onChangeArea?.(foundArea);
      setSelectedArea(foundArea);
    },
    [onChangeArea],
  );

  const handleChangeSubScene = useCallback(
    (v: boolean) => {
      const subScene = v ? SubScenes.Tama : SubScenes.Toshin;
      setCurrentSubScene(subScene);
      onChangeSubScene?.(subScene);
    },
    [setCurrentSubScene, onChangeSubScene],
  );

  const handleToggleSound = useCallback(() => {
    setSound(sound === "on" ? "off" : "on");
  }, [sound, setSound]);

  return (
    <Root additionalWidth={additionalWidth}>
      <AppHeader
        areas={AREAS}
        isTitleWhite={isTitleWhite}
        languages={LANGUAGES}
        selectedArea={selectedArea?.id}
        selectedLanguage={language}
        sound={sound}
        isSwitchButtonActive={navigationState.currentSubScene === SubScenes.Tama}
        onChangeLanguage={handleChangeLanguage}
        onChangeArea={handleChangeArea}
        onChangeSubScene={handleChangeSubScene}
        onChangeSound={handleToggleSound}
        onClick={onClick}
        showSwitchSubSceneButton={
          navigationState.currentScene !== MainScenes.Scene1 &&
          navigationState.currentScene !== MainScenes.Scene6
        }
        isBreakpointMd={isBreakpointMd}
        isOpening={isOpening}
        isOpeningScene1={isOpeningScene1}
        isEpilogue={isEpilogue}
        onBackToTopPage={handleBackToTopPage}
        isCounterScene={
          navigationState.currentScene === OpeningScenes.Scene5 ||
          navigationState.currentScene === OpeningScenes.Scene6
        }
      />
    </Root>
  );
};

const Root = styled.div<{ additionalWidth: number }>`
  transition: width 500ms ease-out;
  width: ${({ additionalWidth }) => `calc(100vw - ${additionalWidth}px)`};
  z-index: 1;

  ${breakpointMediaQueries.md} {
    width: 100vw;
  }
`;
