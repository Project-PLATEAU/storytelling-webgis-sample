import { styled } from "@linaria/react";
import { FC, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { breakpointMediaQueries } from "../../constants";
import type { Sound } from "../../utils";
import { Button } from "../Button";
import { Language } from "../icons/Language";
import { Logo } from "../icons/Logo";
import { SoundOff } from "../icons/SoundOff";
import { SoundOn } from "../icons/SoundOn";
import { Select } from "../Select";
import { SwitchButton } from "../SwitchButton";

type AppHeaderProps = {
  areas: { id: string; label: string }[];
  languages: { id: string; label: string }[];
  selectedArea?: string;
  selectedLanguage: string;
  sound: Sound | null;
  isSwitchButtonActive?: boolean;
  onChangeArea?: (area: string) => void;
  onChangeLanguage?: () => void;
  onChangeSubScene?: (v: boolean) => void;
  onChangeSound?: () => void;
  isBreakpointMd: boolean;
  showSwitchSubSceneButton: boolean;
  onClick?: () => void;
  isOpening: boolean;
  isOpeningScene1: boolean;
  isEpilogue: boolean;
  onBackToTopPage?: () => void;
  isTitleWhite?: boolean;
  isCounterScene: boolean;
};

const SWITCH_BUTTON_DURATION = 300;

const useSwitchButtonAnimation = (showSwitchSubSceneButton: boolean) => {
  const [delayedShowSwitchSceneButton, setDelayedShowSwitchSceneButton] =
    useState(showSwitchSubSceneButton);

  const delayedShowSwitchSceneButtonRef = useRef(delayedShowSwitchSceneButton);
  delayedShowSwitchSceneButtonRef.current = delayedShowSwitchSceneButton;
  useEffect(() => {
    let timer: number;
    if (delayedShowSwitchSceneButtonRef.current && !showSwitchSubSceneButton) {
      timer = window.setTimeout(
        () => setDelayedShowSwitchSceneButton(showSwitchSubSceneButton),
        SWITCH_BUTTON_DURATION,
      );
    } else {
      setDelayedShowSwitchSceneButton(showSwitchSubSceneButton);
    }

    return () => {
      window.clearTimeout(timer);
    };
  }, [showSwitchSubSceneButton]);

  return delayedShowSwitchSceneButton;
};

export const AppHeader: FC<AppHeaderProps> = ({
  languages,
  areas,
  selectedArea,
  selectedLanguage,
  sound,
  isSwitchButtonActive,
  onChangeArea,
  onChangeLanguage,
  onChangeSubScene,
  onChangeSound,
  isBreakpointMd,
  showSwitchSubSceneButton,
  onClick,
  isOpening,
  isOpeningScene1,
  isEpilogue,
  onBackToTopPage,
  isTitleWhite,
  isCounterScene,
}) => {
  const { t } = useTranslation();
  const delayedShowSwitchSceneButton = useSwitchButtonAnimation(showSwitchSubSceneButton);

  const languageLabel = languages.find(p => p.id === selectedLanguage)?.label || "";

  return (
    <Header>
      <HeaderRoot>
        <Title
          color={isTitleWhite || isOpening ? "#fff" : "#463C64"}
          className={isCounterScene ? "counter" : ""}
          onClick={onBackToTopPage}>
          {!isOpeningScene1 && <Logo aria-label={t("content_navigation_header")} />}
        </Title>

        <Spacer />

        {!isBreakpointMd && !isOpening && (
          <SwitchButtonWrapper>
            {delayedShowSwitchSceneButton && (
              <SwitchButtonAnimationWrapper
                className={!showSwitchSubSceneButton ? "hide" : undefined}>
                <SwitchButton
                  active={isSwitchButtonActive}
                  onClick={onChangeSubScene}
                  contents={[t("switch_sub_scene_button_1"), t("switch_sub_scene_button_2")]}
                />
              </SwitchButtonAnimationWrapper>
            )}
          </SwitchButtonWrapper>
        )}
        <Spacer />

        {!isBreakpointMd && (
          <SelectWrapper>
            {!isOpening && !isEpilogue && (
              <AreaWrapper id="areaSelector">
                <Select
                  selectedItem={selectedArea}
                  label="Select Area"
                  items={areas}
                  onChange={onChangeArea}
                  onClick={onClick}
                  shouldReplace
                />
              </AreaWrapper>
            )}

            <>
              <RoundButton id="langButton" onClick={onChangeLanguage}>
                <Language lang={languageLabel} />
              </RoundButton>
              {!isOpeningScene1 && (
                <RoundButton id="soundButton" onClick={onChangeSound}>
                  {sound === "on" ? (
                    <SoundOn width={20} height={20} />
                  ) : (
                    <SoundOff width={20} height={20} />
                  )}
                </RoundButton>
              )}
            </>
          </SelectWrapper>
        )}
      </HeaderRoot>
    </Header>
  );
};

const Header = styled.header`
  width: 100%;
  background: rgba(0, 0, 0, 0);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
  box-sizing: border-box;
  gap: 20px;
  justify-content: space-between;

  ${breakpointMediaQueries.md} {
    padding: 20px;
  }
`;

const HeaderRoot = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
`;

const Title = styled.div<{ color: string }>`
  transition: color 300ms ease-in;
  display: flex;
  margin: 0;
  color: ${({ color }) => color};
  pointer-events: auto;
  cursor: pointer;

  &.counter {
    animation: 1s ease-out 2s changeColor;
    animation-fill-mode: forwards;
    @keyframes changeColor {
      from {
        color: #ffffff;
      }
      to {
        color: #463c64;
      }
    }
  }

  ${breakpointMediaQueries.md} {
    height: auto;
    width: 150px;
  }
`;

const SwitchButtonWrapper = styled.div`
  display: flex;
  flex: 1;
  margin: 0;
  pointer-events: auto;
  justify-content: center;
`;

const SwitchButtonAnimationWrapper = styled.div`
  animation: ${SWITCH_BUTTON_DURATION}ms ease-out 0s slidein;
  animation-fill-mode: forwards;

  @keyframes slidein {
    from {
      transform: translateY(-200%);
    }
    to {
      transform: translateY(0%);
    }
  }

  &.hide {
    animation: ${SWITCH_BUTTON_DURATION}ms ease-out 0s slideout;
    animation-fill-mode: forwards;
    @keyframes slideout {
      from {
        transform: translateY(0%);
      }
      to {
        transform: translateY(-200%);
      }
    }
  }
  ${breakpointMediaQueries.md} {
    animation: none;
  }
`;

// TODO: Implement actual feature. This is just style for now.
const AreaWrapper = styled.div`
  pointer-events: auto;
  max-width: 100%;
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

  &:hover svg path {
    fill: #ffffff;
  }

  ${breakpointMediaQueries.md} {
    padding: 0.6rem 0.6rem;
  }
`;

const SelectWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 20px;
`;

const Spacer = styled.div`
  flex: 1;
`;
