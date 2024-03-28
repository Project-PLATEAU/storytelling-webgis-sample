import { styled } from "@linaria/react";
import { FC, useCallback, useMemo, useState } from "react";

import { Button } from "../components/Button";
import { Language } from "../components/icons/Language";
import { Logo } from "../components/icons/Logo";
import { SoundOff } from "../components/icons/SoundOff";
import { SoundOn } from "../components/icons/SoundOn";
import { SceneMenuModal, SceneMenuItem } from "../components/SceneMenuModal";
import { Select } from "../components/Select";
import { LANGUAGES } from "../constants";
import { AREAS } from "../constants/23wards";
import { useNavigationContext } from "../contexts/NavigationContexts";
import { useSoundContext } from "../contexts/SoundContexts";
import { useTranslation } from "../i18n/hooks";
import { Area, MainScenes, OpeningScenes, PageName } from "../utils";

import { SelectedArea } from "./AppHeaderContainer";

type Props = {
  show: boolean;
  onClose: () => void;
  onChangeArea?: (area?: SelectedArea) => void;
  onChangeLanguage?: (lang: string) => void;
  isBreakpointMd: boolean;
  onClick?: () => void;
};

export const SceneMenuModalContainer: FC<Props> = ({ show, onClose, isBreakpointMd, ...props }) => {
  const { t } = useTranslation();
  const { setCurrentPage, setCurrentScene } = useNavigationContext();
  const sceneList = useMemo(
    () => [
      {
        id: PageName.Opening,
        name: t("opening"),
      },
      {
        id: MainScenes.Scene1,
        name: t("Tokyo as it is today"),
      },
      {
        id: PageName.Main,
        name: t("Earthquake in the southern and the eastern part of the metropolis"),
        disabled: true,
        children: [
          {
            id: MainScenes.Scene2,
            name: t("Seismic intensity distribution"),
          },
          {
            id: MainScenes.Scene3,
            name: t("Distribution of the number of houses totally destroyed"),
          },
          {
            id: MainScenes.Scene4,
            name: t("Distribution of the number of buildings burned"),
          },
          {
            id: MainScenes.Scene5,
            name: t("Liquefaction distribution of the earthquake"),
          },
        ],
      },
      {
        id: MainScenes.Scene6,
        name: t(MainScenes.Scene6),
      },
    ],
    [t],
  );

  const handleClickItem = useCallback(
    (item: SceneMenuItem) => {
      switch (item.id) {
        case PageName.Opening: {
          setCurrentPage(PageName.Opening);
          break;
        }
        case PageName.Main: {
          break;
        }
        default: {
          setCurrentPage(PageName.Main);
          setCurrentScene(item.id as MainScenes);
          break;
        }
      }
      onClose?.();
    },
    [setCurrentPage, setCurrentScene, onClose],
  );

  return isBreakpointMd ? (
    <SceneMenuModalForMobile
      {...props}
      show={show}
      onClose={onClose}
      sceneList={sceneList}
      onClickItem={handleClickItem}
    />
  ) : (
    <SceneMenuModalForDesktop
      show={show}
      sceneList={sceneList}
      onClickItem={handleClickItem}
      onClose={onClose}
    />
  );
};

const SceneMenuModalForDesktop: FC<
  Pick<Props, "show" | "onClose"> & {
    sceneList: SceneMenuItem[];
    onClickItem: (item: SceneMenuItem) => void;
  }
> = ({ show, sceneList, onClickItem, onClose }) => {
  return (
    <SceneMenuModal
      show={show}
      onClose={onClose}
      list={sceneList}
      onClickItem={onClickItem}
      zIndex={3}
    />
  );
};

const SceneMenuModalForMobile: FC<
  Omit<Props, "isBreakpointMd"> & {
    sceneList: SceneMenuItem[];
    onClickItem: (item: SceneMenuItem) => void;
  }
> = ({ show, sceneList, onClickItem, onClose, onChangeArea, onChangeLanguage, onClick }) => {
  const { t } = useTranslation();

  const {
    i18n: { language, changeLanguage },
  } = useTranslation();
  const { navigationState, setCurrentPage, setCurrentScene } = useNavigationContext();
  const { sound, setSound } = useSoundContext();

  const isOpening = navigationState.currentPage === PageName.Opening;
  const isEpilogue = navigationState.currentScene === MainScenes.Scene6;

  const [selectedArea, setSelectedArea] = useState<Area | undefined>();

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

  const handleToggleSound = useCallback(() => {
    setSound(sound === "on" ? "off" : "on");
  }, [sound, setSound]);

  const languageLabel = LANGUAGES.find(p => p.id === language)?.label || "";

  const renderHeader = useCallback(() => {
    return (
      <>
        <Title color={"#fff"} onClick={handleBackToTopPage}>
          <Logo aria-label={t("content_navigation_header")} />
        </Title>

        {!isOpening && (
          <AreaWrapper id="areaSelector">
            <Select
              selectedItem={selectedArea?.id}
              label="Select Area"
              items={AREAS}
              onChange={handleChangeArea}
              onClick={onClick}
              shouldReplace
            />
          </AreaWrapper>
        )}
      </>
    );
  }, [handleBackToTopPage, handleChangeArea, onClick, selectedArea?.id, t, isOpening]);

  const renderFooter = useCallback(() => {
    return (
      <Footer>
        <RoundButton id="langButton" onClick={handleChangeLanguage}>
          <Language lang={languageLabel} />
        </RoundButton>
        <RoundButton id="soundButton" onClick={handleToggleSound}>
          {sound === "on" ? (
            <SoundOn width={20} height={20} />
          ) : (
            <SoundOff width={20} height={20} />
          )}
        </RoundButton>
      </Footer>
    );
  }, [handleChangeLanguage, handleToggleSound, languageLabel, sound]);

  return (
    <SceneMenuModal
      show={show}
      onClose={onClose}
      list={sceneList}
      onClickItem={onClickItem}
      zIndex={isEpilogue ? 11 : 4}
      renderHeader={renderHeader}
      renderFooter={renderFooter}
    />
  );
};

const Title = styled.div<{ color: string }>`
  position: fixed;
  top: 20px;
  left: 20px;
  display: flex;
  color: ${({ color }) => color};
  pointer-events: auto;
  cursor: pointer;
  height: auto;
  width: 150px;
`;

const AreaWrapper = styled.div`
  pointer-events: auto;
  max-width: 100%;
  margin: 20px 0;
`;

const Footer = styled.div`
  display: flex;
  margin-top: 20px;
  gap: 10px;
`;

const RoundButton = styled(Button)`
  pointer-events: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: auto;
  margin: auto;
  padding: 1rem 1rem;
  border: 1px solid #ffffff;
  border-radius: 100svh;

  padding: 0.6rem 0.6rem;
`;
