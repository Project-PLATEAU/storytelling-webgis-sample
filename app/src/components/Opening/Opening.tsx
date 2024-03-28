import { styled } from "@linaria/react";
import { CountUp } from "countup.js";
import { Odometer } from "odometer_countup";
import { FC, memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { breakpointMediaQueries, TITLE_FONT_FAMILY, breakPoint } from "../../constants";
import { useFirstVisitContext } from "../../contexts/FirstVisitContexts";
import { useNavigationContext } from "../../contexts/NavigationContexts";
import { useSoundContext } from "../../contexts/SoundContexts";
import { useMediaQuery, useEffectSound, useRefValue, useHideAnimation } from "../../hooks";
import { DisclaimerOverlay } from "../../layers/overlays";
import { splitN } from "../../utils";
import { MainScenes, OpeningScenes, PageName } from "../../utils/types/common";
import { Button } from "../Button";
import { Forward } from "../icons/Forward";
import { SoundOff } from "../icons/SoundOff";
import { SoundOn } from "../icons/SoundOn";
import { OpeningPictureSlider, PICTURE_SLIDER_TIMEOUT } from "../OpeningPictureSlider";

const SCENE_META = {
  delay: 300,
  slidin: 1000,
  fadein: 1000,
  waitBeforeSlideIn: 3000,
  fadeout: 1000,
};

const Counter = memo(function CounterPresenter({
  start = 1924,
  end = 2023,
}: {
  start?: number;
  end?: number;
}) {
  const counterRef = useRef<CountUp>();
  useEffect(() => {
    const timer = setTimeout(() => {
      counterRef.current?.start();
    }, 1 * 1000);
    return () => {
      clearTimeout(timer);
    };
  }, []);
  return (
    <StyledCounter
      ref={r => {
        if (r) {
          counterRef.current = new CountUp(r, end, {
            plugin: new Odometer({ duration: 2, lastDigitDelay: 0 }),
            duration: 2,
            startVal: start,
            separator: "",
          });
        }
      }}>
      {start}
    </StyledCounter>
  );
});

const OPENING_SCENE_ORDER = [
  OpeningScenes.Scene1,
  OpeningScenes.Scene2,
  OpeningScenes.Scene3,
  OpeningScenes.Scene4,
  OpeningScenes.Scene5,
  OpeningScenes.Scene4,
];

export const TITLE_OVERLAY_FADEOUT_DELAY = 3000;
export const TITLE_OVERLAY_FADEOUT_DURATION = 2000;

export const Opening: FC = () => {
  const {
    navigationState: { currentScene },
    setCurrentScene,
    setCurrentPage,
  } = useNavigationContext();
  const { setSound } = useSoundContext();
  const { play } = useEffectSound();
  const { firstVisit, setFirstVisit } = useFirstVisitContext();
  const { disclaimerAccepted } = firstVisit;
  const { t } = useTranslation();
  const isBreakpointMd = useMediaQuery(`(max-width: ${breakPoint.md}px)`);
  const isBreakpointSm = useMediaQuery(`(max-width: ${breakPoint.sm}px)`);

  const [isShowTitleOverlayActual, setIsShowTitleOverlay] = useState(true);
  const { value: isShowTitleOverlay, hide: hideTitleOverlay } = useHideAnimation(
    isShowTitleOverlayActual,
    TITLE_OVERLAY_FADEOUT_DURATION,
    true,
  );
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsShowTitleOverlay(false);
    }, TITLE_OVERLAY_FADEOUT_DELAY);
    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  const SCENE2_META = {
    ...SCENE_META,
    content: splitN(
      t(
        "September 1, 1923, at 11:58 a.m. An earthquake with an estimated magnitude of 7.9 occurred in the Sagami Trough. Intensity 6 was observed in Saitama, Chiba, Tokyo, Kanagawa, and Yamanashi prefectures. The areas currently marked in red on the map are the locations where fires occurred during the Great Kanto Earthquake.",
      ),
    ),
    waitBeforeSlideIn: 7500,
  };

  const SCENE3_META = {
    ...SCENE_META,
    content: splitN(
      t(
        'It is said that the number of dead and missing reached approximately 105,000 people. This disaster became the starting point for disaster preparedness in Japan, and September 1st was designated as "Disaster Prevention Day." In 2023, it will have been 100 years since the Great Kanto Earthquake.',
      ),
    ),
    waitBeforeSlideIn: 500,
  };

  const SCENE4_META = {
    ...SCENE_META,
    content: splitN(
      t(
        "Looking to the future. Preparing for the future. This site is a place to 'see' the future. Let's look together at what could happen in the near future with a high probability: major earthquakes such as the 'Tokyo Metropolitan Area South Subduction Earthquake' and the 'Tama Eastern Subduction Earthquake,' and what we can do about them.",
      ),
    ),
    waitBeforeSlideIn: 500,
  };

  const [hide, setHide] = useState(false);
  const [isContentCompleted, setIsContentCompleted] = useState(false);

  const handleEnter = useCallback(
    (on?: boolean) => {
      setSound(on ? "on" : "off");
      setCurrentScene(OpeningScenes.Scene2);
    },
    [setCurrentScene, setSound],
  );

  const handleAcceptDisclaimer = useCallback(() => {
    setFirstVisit(prevFirstVisit => ({
      ...prevFirstVisit,
      disclaimerAccepted: true,
    }));
  }, [setFirstVisit]);

  const timer = useRef<number>();
  const prevScene = useRefValue(currentScene);
  const handleNext = useCallback(() => {
    if (timer.current) {
      window.clearTimeout(timer.current);
    }
    play("on");
    setHide(true);
    setIsContentCompleted(false);
    timer.current = window.setTimeout(() => {
      const prev = OPENING_SCENE_ORDER.findIndex(o => o === prevScene.current);
      setCurrentScene(OPENING_SCENE_ORDER[prev + 1]);
      setHide(false);
    }, SCENE_META.fadein);
  }, [setCurrentScene, play, prevScene]);

  const handleSkip = useCallback(() => {
    play("on");
    setCurrentPage(PageName.Main);
    setCurrentScene(MainScenes.Scene1);
  }, [setCurrentPage, setCurrentScene, play]);

  const shakeScreen = useCallback(
    (duration: number, frequency: number, amplitude: number, delay: number = 0): void => {
      setTimeout(() => {
        const shake = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const shakeAngle = Math.sin(elapsed / (frequency / 2)) * amplitude * (1 - progress);

          const easeOutBack = (x: number): number => {
            const c1 = 1.70158;
            const c3 = c1 + 1;

            return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
          };

          const adjustedAngle = shakeAngle * easeOutBack(progress);

          screen.style.transform = `rotate(${adjustedAngle}deg)`;

          if (progress >= 1) {
            clearInterval(timer);
            screen.style.transform = "none";
          }
        };
        const screen = document.body;
        const startTime: number = Date.now();
        const timer = window.setInterval(shake, 1000 / 60);
      }, delay);
    },
    [],
  );

  useEffect(() => {
    if (currentScene === OpeningScenes.Scene2) {
      shakeScreen(4000, 100, 2, 3000);
    }
  }, [currentScene, shakeScreen]);

  // Handle switching scene for count up
  useEffect(() => {
    let timer: number;
    switch (currentScene) {
      case OpeningScenes.Scene5:
        timer = window.setTimeout(() => setCurrentScene(OpeningScenes.Scene6), 2 * 1000);
        break;
      case OpeningScenes.Scene6:
        timer = window.setTimeout(() => {
          setCurrentPage(PageName.Main);
          setCurrentScene(MainScenes.Scene1);
        }, 3 * 1000);
        break;
    }
    return () => {
      clearTimeout(timer);
    };
  }, [currentScene, setCurrentScene, setCurrentPage]);

  // Handle activate the next button after the content is completed
  useEffect(() => {
    let timer: number;
    const delay = 1000;
    switch (currentScene) {
      case OpeningScenes.Scene2:
        timer = window.setTimeout(
          () => {
            setIsContentCompleted(true);
          },
          SCENE2_META.delay * SCENE2_META.content.length +
            SCENE2_META.waitBeforeSlideIn +
            1000 +
            delay,
        );
        break;
      case OpeningScenes.Scene3:
        timer = window.setTimeout(
          () => {
            setIsContentCompleted(true);
          },
          SCENE3_META.delay * SCENE3_META.content.length +
            SCENE3_META.waitBeforeSlideIn +
            1000 +
            PICTURE_SLIDER_TIMEOUT +
            delay,
        );
        break;
      case OpeningScenes.Scene4:
        timer = window.setTimeout(
          () => {
            setIsContentCompleted(true);
          },
          SCENE4_META.delay * SCENE4_META.content.length +
            SCENE4_META.waitBeforeSlideIn +
            1000 +
            delay,
        );
        break;
    }
    return () => window.clearTimeout(timer);
  }, [
    SCENE2_META.content.length,
    SCENE2_META.delay,
    SCENE2_META.waitBeforeSlideIn,
    SCENE3_META.content.length,
    SCENE3_META.delay,
    SCENE3_META.waitBeforeSlideIn,
    SCENE4_META.content.length,
    SCENE4_META.delay,
    SCENE4_META.waitBeforeSlideIn,
    currentScene,
  ]);

  const SkipOpening = useMemo(() => {
    const isCounter =
      currentScene === OpeningScenes.Scene5 || currentScene === OpeningScenes.Scene6;
    return (
      <SkipButton className={isCounter ? "counter" : ""} onClick={handleSkip}>
        <Forward />
        <span>{t("SKIP")}</span>
      </SkipButton>
    );
  }, [handleSkip, t, currentScene]);

  const content = useMemo(() => {
    switch (currentScene) {
      case OpeningScenes.Scene1:
        return (
          <>
            <Title>
              <img alt="Past and future for action #001 Earthquake" src="img/logo.png" />
            </Title>
            <OpeningFooter>
              {SkipOpening}
              <PlateauLogo>
                <a href="https://www.mlit.go.jp/plateau/" target="_blank" rel="noopener noreferrer">
                  <img src="img/logo_plateau.png" />
                </a>
              </PlateauLogo>
            </OpeningFooter>
          </>
        );
      case OpeningScenes.Scene2: {
        const content = SCENE2_META.content.map((c, i) => (
          <>
            <div
              key={i}
              className={i === 0 ? "bold" : ""}
              style={{
                animationDelay: `${
                  SCENE2_META.delay * i + SCENE2_META.waitBeforeSlideIn + (i !== 0 ? 1000 : 0)
                }ms`,
              }}>
              {c}
            </div>
            <br />
          </>
        ));
        return (
          <Content className={hide ? "hide" : ""} length={SCENE2_META.content.length}>
            {content}
          </Content>
        );
      }
      case OpeningScenes.Scene3: {
        const content = SCENE3_META.content.map((c, i) => (
          <>
            <div
              key={i}
              className={i === SCENE3_META.content.length - 1 ? "bold" : ""}
              style={{
                animationDelay: `${
                  SCENE3_META.delay * i +
                  SCENE3_META.waitBeforeSlideIn +
                  (i === SCENE3_META.content.length - 1 ? 1000 : 0) +
                  PICTURE_SLIDER_TIMEOUT
                }ms`,
              }}>
              {c}
            </div>
            <br />
          </>
        ));
        return (
          <>
            <Content className={hide ? "hide" : ""} length={SCENE3_META.content.length}>
              {content}
            </Content>
            <HideWrapper className={hide ? "hide" : ""}>
              <OpeningPictureSlider />
              <CreditForPictureSlider>
                {splitN(
                  t(
                    "The photo is a colorized version of a photo from the time of the Great Kanto Earthquake. Photo courtesy: National Museum of Nature and Science, Colorization: Hidenori Watanabe.",
                  ),
                )}
              </CreditForPictureSlider>
            </HideWrapper>
          </>
        );
      }
      case OpeningScenes.Scene4: {
        const content = SCENE4_META.content.map((c, i) => (
          <>
            <div
              key={i}
              className={i === 0 ? "bold" : ""}
              style={{
                animationDelay: `${
                  SCENE4_META.delay * i + SCENE4_META.waitBeforeSlideIn + (i !== 0 ? 1000 : 0)
                }ms`,
              }}>
              {c}
            </div>
            <br />
          </>
        ));
        return (
          <Content className={hide ? "hide" : ""} length={SCENE2_META.content.length}>
            {content}
          </Content>
        );
      }
      case OpeningScenes.Scene5:
      case OpeningScenes.Scene6: {
        return <Counter />;
      }
    }
  }, [
    currentScene,
    hide,
    SCENE2_META.content,
    SCENE2_META.delay,
    SCENE2_META.waitBeforeSlideIn,
    SCENE3_META.content,
    SCENE3_META.delay,
    SCENE3_META.waitBeforeSlideIn,
    SCENE4_META.content,
    SCENE4_META.delay,
    SCENE4_META.waitBeforeSlideIn,
    t,
    SkipOpening,
  ]);

  if (isShowTitleOverlay)
    return (
      <TitleOverlay>
        <TitleOverlayTitle className={hideTitleOverlay ? "hide" : ""}>
          <img alt="Past and future for action #001 Earthquake" src="img/logo.png" />
        </TitleOverlayTitle>
      </TitleOverlay>
    );

  return (
    <>
      <Root
        style={
          currentScene === OpeningScenes.Scene6
            ? { backgroundColor: "rgba(255, 255, 255, 0.3)", animation: "none" }
            : undefined
        }>
        {content}
        {currentScene === OpeningScenes.Scene1 ? (
          <SoundButtonWrapper>
            <CreditForThisSite
              dangerouslySetInnerHTML={{
                __html: isBreakpointMd
                  ? t("Credit for this site: SP")
                  : t("Credit for this site: PC"),
              }}
            />
            <SoundButtonList>
              <SoundButton onClick={() => handleEnter(true)}>
                <span id="opening-sound-on">Sound ON</span>
                <SoundOn
                  width={isBreakpointSm ? 30 : isBreakpointMd ? 35 : 42}
                  aria-aria-labelledby="opening-sound-on"
                />
              </SoundButton>
              <SoundButton onClick={() => handleEnter()}>
                <span id="opening-sound-off">Sound OFF</span>
                <SoundOff
                  width={isBreakpointSm ? 30 : isBreakpointMd ? 35 : 42}
                  aria-aria-labelledby="opening-sound-off"
                />
              </SoundButton>
            </SoundButtonList>
          </SoundButtonWrapper>
        ) : [OpeningScenes.Scene2, OpeningScenes.Scene3, OpeningScenes.Scene4].includes(
            currentScene as OpeningScenes,
          ) ? (
          <ActionButton
            onClick={handleNext}
            isContentCompleted={isContentCompleted}
            className={hide ? "hide" : ""}>
            {"NEXT"}
          </ActionButton>
        ) : (
          <ActionButton onClick={handleSkip} isContentCompleted>
            {"SKIP"}
          </ActionButton>
        )}
        {currentScene !== OpeningScenes.Scene1 && (
          <SkipOpeningWrapper currentScene={currentScene as OpeningScenes}>
            {SkipOpening}
          </SkipOpeningWrapper>
        )}
      </Root>
      <DisclaimerOverlay show={!disclaimerAccepted} onClick={handleAcceptDisclaimer} />
    </>
  );
};

const TitleOverlay = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100svh;
  height: 100dvh;
  z-index: 0;
  background-color: rgba(70, 60, 100, 1);

  animation: 2s ease-out 1s fadeout-background;
  animation-fill-mode: forwards;
  @keyframes fadeout-background {
    from {
      background-color: rgba(70, 60, 100, 1);
    }
    to {
      background-color: rgba(70, 60, 100, 0.5);
    }
  }
`;

const TitleOverlayTitle = styled.h1`
  display: block;
  margin: 0;
  padding: 0;
  text-align: center;
  opacity: 0;
  animation: 2s ease-out 0.5s fadein;
  animation-fill-mode: forwards;

  img {
    display: block;
    margin: 0 auto;
    max-width: 700px;
    width: 100%;
    height: auto;

    ${breakpointMediaQueries.md} {
      width: 80%;
      padding-left: 2.4%;
    }
  }

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
    visibility: visible;
    animation: 2s ease-out 0s fadeout;
    animation-fill-mode: forwards;
    @keyframes fadeout {
      from {
        opacity: 1;
        visibility: visible;
      }
      to {
        opacity: 0;
        visibility: hidden;
      }
    }
  }
`;

const Root = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100svh;
  z-index: 1;
  background-color: rgba(70, 60, 100, 0.5);
`;

const Title = styled.h1`
  display: block;
  margin: 0;
  padding: 0;
  text-align: center;

  img {
    display: block;
    margin: 0 auto;
    max-width: 700px;
    width: 90%;
    height: auto;

    ${breakpointMediaQueries.md} {
      width: 70%;
      padding-left: 2.4%;
    }
  }

  opacity: 0;
  animation: 1s ease-out 0s fadein;
  animation-fill-mode: forwards;
  @keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const Content = styled.div<{ length: number }>`
  color: #ffffff;
  font-size: 25px;
  padding: 0 10px;
  z-index: 1;

  &.hide {
    opacity: 1;
    animation: ${SCENE_META.fadein}ms ease-out 0ms 1 normal forwards running fadeout;
    @keyframes fadeout {
      0% {
        opacity: 1;
      }
      100% {
        opacity: 0;
      }
    }
  }

  & > div {
    box-sizing: border-box;
    padding: 5px 10px;
    margin: 5px 0;
    display: inline-block;
    background-color: #463c64;
    transform: translateY(100%);
    opacity: 0;
    animation:
      ${SCENE_META.fadein}ms ease-out 0ms 1 normal forwards running fadein,
      ${SCENE_META.slidin}ms ease-out 0ms 1 normal forwards running slidein;
    @keyframes slidein {
      0% {
        transform: translateY(100%);
      }
      100% {
        transform: translateY(0%);
      }
    }
    @keyframes fadein {
      0% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }

    &.bold {
      font-family: ${TITLE_FONT_FAMILY};
      font-size: 60px;
      font-weight: lighter;
    }
    &:nth-of-type(1).bold {
      margin-top: -5px;
      margin-bottom: 70px;
    }
    &:nth-last-of-type(1).bold {
      margin-top: 70px;
    }

    ${breakpointMediaQueries.md} {
      font-size: 16px;
      &.bold {
        font-size: 30px;
      }
      &:nth-of-type(1).bold {
        margin-bottom: 40px;
      }
      &:nth-last-of-type(1).bold {
        margin-top: 40px;
      }
    }

    ${breakpointMediaQueries.sm} {
      font-size: 12px;
      &.bold {
        font-size: 20px;
      }
      &:nth-of-type(1).bold {
        margin-bottom: 20px;
      }
      &:nth-last-of-type(1).bold {
        margin-top: 20px;
      }
    }
  }
`;

const HideWrapper = styled.div`
  opacity: 1;
  &.hide {
    opacity: 1;
    animation: ${SCENE_META.fadein}ms ease-out 0ms 1 normal forwards running fadeout;
    @keyframes fadeout {
      0% {
        opacity: 1;
      }
      100% {
        opacity: 0;
      }
    }
  }
`;

const CreditForPictureSlider = styled.div`
  position: absolute;
  bottom: 30px;
  left: 0px;
  background-color: rgba(255, 255, 255, 0.3);
  color: #222;
  font-size: 12px;
  font-weight: lighter;
  box-sizing: border-box;
  padding: 3px 6px;
  border-radius: 2px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

const ActionButton = styled(Button)<{ isContentCompleted: boolean }>`
  font-size: 20px;
  cursor: pointer;
  display: inline-grid;
  justify-content: center;
  align-content: center;
  width: 100%;
  max-width: 300px;
  height: 60px;
  border: 1px #463c64 solid;
  background: #ffffff;
  border-radius: 60px;
  margin-top: 142px;
  color: #463c64;
  z-index: 1;
  transition: background-color 300ms ease-in;
  background-color: ${({ isContentCompleted }) => (isContentCompleted ? "#fff" : "#777")};

  opacity: 0;
  animation: 300ms ease-out 0ms 1 normal forwards running fadein;
  @keyframes fadein {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  &.hide {
    opacity: 1;
    animation: 300ms ease-out 100ms 1 normal forwards running fadeout;
    @keyframes fadeout {
      0% {
        opacity: 1;
      }
      100% {
        opacity: 0;
      }
    }
  }

  ${breakpointMediaQueries.md} {
    width: 60%;
    height: 50px;
    font-size: 18px;
    margin-top: 124px;
  }

  ${breakpointMediaQueries.sm} {
    width: 70%;
    height: 40px;
    font-size: 16px;
    margin-top: 62px;
  }
`;

const StyledCounter = styled.div`
  font-family: ${TITLE_FONT_FAMILY};
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 80%;
  max-width: 700px;
  margin: 0 auto;

  font-size: 200px;
  color: #ffffff;
  opacity: 0;
  animation:
    1s ease-out 0s fadein,
    1s ease-out 2s changeColor;
  animation-fill-mode: forwards;

  ${breakpointMediaQueries.md} {
    font-size: 150px;
    width: 90%;
  }

  ${breakpointMediaQueries.sm} {
    font-size: 100px;
    width: 100%;
  }

  @keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes changeColor {
    from {
      color: #ffffff;
    }
    to {
      color: #463c64;
    }
  }
`;

const SoundButtonList = styled.div`
  display: flex;
  gap: 80px;
`;

const SoundButton = styled(Button)`
  display: flex;
  flex-direction: column;
  border-radius: 50%;
  width: 150px;
  height: 150px;
  font-size: 14px;
  gap: 16px;
  align-items: center;
  justify-content: center;

  ${breakpointMediaQueries.md} {
    width: 100px;
    height: 100px;
    font-size: 12px;
    gap: 12px;
  }

  ${breakpointMediaQueries.sm} {
    width: 90px;
    height: 90px;
    font-size: 10px;
    gap: 5px;
  }
`;

const PlateauLogo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 15px
  width: 200px;
  height: auto;
  margin: 20px;
  text-align: center;
  opacity: 0;
  animation: 3s ease-out 0.5s fadein;
  animation-fill-mode: forwards;
  font-size: 15px;
  color: #ffffff;
  pointer-events: auto;

  & > span {
    font-weight: lighter;
  }

  & img {
    display: block;
    width: 100%;
    height: auto;
  }

  @keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  ${breakpointMediaQueries.md} {
    bottom: 30px;
    right: 20px;
    font-size: 10px;
    gap: 10px;
    width: 150px;
  }
`;

const SkipButton = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  width: 70px;
  height: auto;
  margin: 20px;
  text-align: center;
  z-index: 1;
  font-size: 15px;
  color: #ffffff;
  fill: #ffffff;
  cursor: pointer;
  border-bottom: 1px solid #ffffff;
  pointer-events: auto;

  &.counter {
    animation: 1s ease-out 2s changeColor;
    animation-fill-mode: forwards;
    @keyframes changeColor {
      from {
        color: #ffffff;
        fill: #ffffff;
        border-bottom: 1px solid #ffffff;
      }
      to {
        color: #463c64;
        fill: #463c64;
        border-bottom: 1px solid #463c64;
      }
    }
  }

  ${breakpointMediaQueries.md} {
    width: 60px;
    font-size: 12px;
    gap: 10px;
  }
`;

const OpeningFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 30px 20px;
  box-sizing: border-box;
  z-index: 1;
  pointer-events: none;
`;

const CreditForThisSite = styled.div`
  width: 100%;
  font-size: 14px;
  text-align: center;
  color: #ffffff;
  padding: 0 20px;
  box-sizing: border-box;

  & .bold {
    font-size: 20px;
    font-weight: 700;
  }

  ${breakpointMediaQueries.md} {
    width: 90%;
    font-size: 10px;
    text-align: left;

    & .bold {
      font-size: 12px;
      font-weight: 700;
    }
  }
`;

const SoundButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  margin-top: 60px;

  ${breakpointMediaQueries.md} {
    margin-top: 20px;
  }

  opacity: 0;
  animation: 1s ease-out 0s fadein;
  animation-fill-mode: forwards;
  @keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const SkipOpeningWrapper = styled.div<{ currentScene: OpeningScenes }>`
  position: absolute;
  bottom: ${({ currentScene }) => (currentScene === OpeningScenes.Scene3 ? "70" : "30")}px;
  left: 20px;
  display: flex;
  gap: 20px;
  z-index: 1;

  ${breakpointMediaQueries.md} {
    bottom: ${({ currentScene }) => (currentScene === OpeningScenes.Scene3 ? "90" : "30")}px;
  }
`;
