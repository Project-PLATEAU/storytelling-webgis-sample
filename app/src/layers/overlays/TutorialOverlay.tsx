import { styled } from "@linaria/react";
import { FC } from "react";
import { useTranslation } from "react-i18next";

import { Close } from "../../components/icons/Close";
import { breakpointMediaQueries, breakPoint, TITLE_FONT_FAMILY } from "../../constants";
import { SCENE_NAVIGATION_WIDTH } from "../../containers/SceneNavigationContainer";
import { useMediaQuery } from "../../hooks";
import { OverlayContentProps } from "../../map/layers";

type Props = OverlayContentProps & {
  onSkip: () => void;
};

const FADE_DURATION = 500;

export const TutorialOverlay: FC<Props> = ({ onSkip }) => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === "en";

  const isBreakpointMd = useMediaQuery(`(max-width: ${breakPoint.md}px)`);

  return (
    <Root backgroundColor="#463C64">
      <Container color="#E6E6FA">
        <SkipButton onClick={onSkip}>
          <Close width={!isBreakpointMd ? 60 : 30} height={!isBreakpointMd ? 60 : 30} />
        </SkipButton>
        <ImageContainer>
          <ImageText isEn={isEn}>{t("Tutorial text")}</ImageText>
          {!isBreakpointMd ? (
            <img
              src={
                isEn
                  ? "img/content/tutorial/tutorial-pc-en.png"
                  : "img/content/tutorial/tutorial-pc-jp.png"
              }
              width="70%"
              height="70%"
            />
          ) : (
            <img
              src={
                isEn
                  ? "img/content/tutorial/tutorial-sp-en.png"
                  : "img/content/tutorial/tutorial-sp-jp.png"
              }
              width="70%"
              height="70%"
            />
          )}
        </ImageContainer>
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

  ${breakpointMediaQueries.md} {
    padding: 0 10px;
  }
`;

const Container = styled.div<{ color: string }>`
  display: block;
  color: ${({ color }) => color};
`;

const ImageContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  min-width: 80%;

  ${breakpointMediaQueries.md} {
    top: 40%;
  }
`;

const ImageText = styled.p<{ isEn: boolean }>`
  font-family: ${TITLE_FONT_FAMILY};
  margin-bottom: 40px;
  color: #ffffff;
  font-size: 40px;
  ${breakpointMediaQueries.md} {
    font-size: ${({ isEn }) => (isEn ? "20px" : "25px")};
    margin-bottom: 20px;
  }
`;

const SkipButton = styled.div`
  position: absolute;
  top: 150px;
  left: 30px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  z-index: 1;
  color: white;

  ${breakpointMediaQueries.md} {
    top: 20px;
  }
`;
