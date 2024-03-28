import { styled } from "@linaria/react";
import { FC, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "../../components/Button";
import { breakpointMediaQueries, TITLE_FONT_FAMILY } from "../../constants";
import { SCENE_NAVIGATION_WIDTH } from "../../containers/SceneNavigationContainer";
import { useNavigationContext } from "../../contexts/NavigationContexts";
import { useEffectSound, useRefValue } from "../../hooks";
import { OverlayContentProps } from "../../map/layers";
import { MainScenes, splitN } from "../../utils";

type Props = OverlayContentProps & {
  sceneName: MainScenes;
  color?: string;
  backgroundColor?: string;
  timeout?: number;
};

export const SCENE_DESCRIPTION_TIMEOUT = 8000;

const FADE_DURATION = 500;

export const SceneDescriptionOverlay: FC<Props> = ({
  show,
  sceneName,
  color = "#ffffff",
  backgroundColor = "#16A2A2",
}) => {
  const { t } = useTranslation();
  const [animatedShow, setAnimatedShow] = useState(show);
  const { play } = useEffectSound();

  const subtitle = useMemo(() => {
    const translated = t(`${sceneName}_overlay_subtitle`, {
      defaultValue: "NONE",
    });
    return translated !== "NONE" ? translated : undefined;
  }, [sceneName, t]);
  const title = useMemo(() => t(`${sceneName}_overlay_title`), [sceneName, t]);

  const brDescription = useMemo(
    () => splitN(t(`${sceneName}_overlay_description`)),
    [sceneName, t],
  );

  useEffect(() => {
    setAnimatedShow(show);
  }, [show]);

  const { navigationState, setCurrentSceneContentIndex } = useNavigationContext();
  const currentSceneContentIndexRef = useRefValue(navigationState.currentSceneContentIndex);
  const handleSkipDescription = () => {
    play("on");
    setCurrentSceneContentIndex(currentSceneContentIndexRef.current + 1);
    setAnimatedShow(false);
  };

  return (
    <Root className={!animatedShow ? "hide" : ""} backgroundColor={backgroundColor}>
      <Container color={color}>
        <div>
          <div>
            <SceneName backgroundColor={backgroundColor}>{sceneName}</SceneName>
          </div>
          {subtitle && (
            <div>
              <SubTitle backgroundColor={backgroundColor}>{subtitle}</SubTitle>
            </div>
          )}
          <div>
            <Title backgroundColor={backgroundColor}>{title}</Title>
          </div>
          {brDescription.map((desc, i) => (
            <div key={i}>
              <Description key={i} backgroundColor={backgroundColor}>
                {desc}
              </Description>
            </div>
          ))}
          {sceneName === "SCENE_03" && (
            <Description backgroundColor={backgroundColor}>
              <span>{t("Source: ")}</span>
              <StyledLink
                target="_blank"
                rel="noreferrer"
                href="https://www.taishin.metro.tokyo.lg.jp/why/topic01.html">
                {t("Tokyo earthquake-resistant portal site")}
              </StyledLink>
            </Description>
          )}
          {sceneName === "SCENE_04" && (
            <Description backgroundColor={backgroundColor}>
              <span>{t("Source: ")}</span>
              <StyledLink
                target="_blank"
                rel="noreferrer"
                href="https://www.bousai.metro.tokyo.lg.jp/_res/projects/default_project/_page_/001/021/571/20220525/n/002n.pdf">
                {t(
                  'Report on "Estimation of damage in the event of an earthquake directly hitting Tokyo"',
                )}
              </StyledLink>
            </Description>
          )}
        </div>

        <RoundButton onClick={handleSkipDescription}>OK</RoundButton>
      </Container>
    </Root>
  );
};

const Root = styled.div<{ backgroundColor: string }>`
  position: absolute;
  inset: 0;
  background-color: ${({ backgroundColor }) => backgroundColor + "aa"};
  opacity: 0;
  box-sizing: border-box;
  display: grid;
  align-content: center;
  justify-content: center;
  box-sizing: border-box;

  padding-left: ${SCENE_NAVIGATION_WIDTH + 10}px;
  padding-right: 100px;

  animation: ${FADE_DURATION}ms ease-out 0s fadein;
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
    animation: ${FADE_DURATION}ms ease-out 0s fadeout;
    animation-fill-mode: forwards;
    @keyframes fadeout {
      from {
        opacity: 1;
      }
      to {
        opacity: 0;
        display: none;
        visibility: hidden;
      }
    }
  }

  ${breakpointMediaQueries.md} {
    z-index: 2;
    align-content: start;
    padding: 50px 10px;
  }
`;

const Container = styled.div<{ color: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 25px;
  color: ${({ color }) => color};

  ${breakpointMediaQueries.md} {
    margin-top: 15px;
    gap: 10px;
  }
`;

const SceneName = styled.span<{ backgroundColor: string }>`
  display: inline-block;
  box-sizing: border-box;
  font-size: 14px;
  margin-bottom: 7.5px;
  padding: 5px 10px;
  background-color: ${({ backgroundColor }) => backgroundColor};

  ${breakpointMediaQueries.md} {
    margin-bottom: 2px;
    font-size: 7px;
  }
`;

const SubTitle = styled.span<{ backgroundColor: string }>`
  font-family: ${TITLE_FONT_FAMILY};
  display: inline-block;
  box-sizing: border-box;
  font-size: 20px;
  padding: 5px 10px;
  padding-bottom: 0;
  background-color: ${({ backgroundColor }) => backgroundColor};

  ${breakpointMediaQueries.md} {
    font-size: 12px;
    padding: 3px 7px;
  }
`;

const Title = styled.h2<{ backgroundColor: string }>`
  font-family: ${TITLE_FONT_FAMILY};
  font-weight: lighter;
  display: inline-block;
  box-sizing: border-box;
  padding: 3px 5px;
  padding-top: 0;
  font-size: 35px;
  margin: 0;
  margin-bottom: 12px;
  background-color: ${({ backgroundColor }) => backgroundColor};

  ${breakpointMediaQueries.md} {
    font-size: 18px;
    margin-bottom: 5px;
    padding: 3px 7px;
  }
`;
const Description = styled.p<{ backgroundColor: string }>`
  display: inline-block;
  box-sizing: border-box;
  font-size: 18px;
  padding: 2.5px 7.5px;
  margin: 2.5px 0;
  background-color: ${({ backgroundColor }) => backgroundColor};

  ${breakpointMediaQueries.md} {
    font-size: 12px;
    margin: 2px 0;
    padding: 3px 7px;
  }
`;

const StyledLink = styled.a`
  color: #ffffff
  text-decoration: underline;
`;

const RoundButton = styled(Button)`
  pointer-events: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30%;
  padding: 0.6rem 6rem;
  border: 1px solid #463c64;
  border-radius: 100vh;
  font-size: 20px;

  ${breakpointMediaQueries.md} {
    font-size: 15px;
    margin-bottom: 5px;
    padding: 0.3rem 4rem;
  }
`;
