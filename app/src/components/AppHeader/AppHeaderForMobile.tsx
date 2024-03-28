import { styled } from "@linaria/react";
import { FC, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { breakpointMediaQueries } from "../../constants";
import { Hamburger } from "../icons/Hamburger";
import { RoundButton } from "../RoundButton";
import { SwitchButton } from "../SwitchButton";

type AppHeaderProps = {
  isSwitchButtonActive?: boolean;
  onChangeSubScene?: (v: boolean) => void;
  showSwitchSubSceneButton: boolean;
  isOpening: boolean;
  onOpenSceneMenu: () => void;
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

export const AppHeaderForMobile: FC<AppHeaderProps> = ({
  isSwitchButtonActive,
  onChangeSubScene,
  showSwitchSubSceneButton,
  isOpening,
  onOpenSceneMenu,
}) => {
  const { t } = useTranslation();
  const delayedShowSwitchSceneButton = useSwitchButtonAnimation(showSwitchSubSceneButton);

  return (
    <Header>
      {!isOpening && (
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

      <div style={{ flex: 1 }} />

      <div id="SpMenuButton">
        <MenuButton onClick={onOpenSceneMenu}>
          <Hamburger />
        </MenuButton>
      </div>
    </Header>
  );
};

const Header = styled.header`
  width: 100vw;
  background: transparent;
  display: flex;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
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

const MenuButton = styled(RoundButton)``;
