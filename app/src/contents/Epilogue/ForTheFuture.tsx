import { styled } from "@linaria/react";
import { FC, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "../../components/Button";
import { WidthLimitedContent } from "../../components/Contents/BaseContent";
import { breakpointMediaQueries, TITLE_FONT_FAMILY } from "../../constants";
import { splitN } from "../../utils";

type ForTheFutureProps = {
  setShowMoreDetails: (show: boolean) => void;
};

const SCENE_META = {
  delay: 500,
  slidin: 1000,
  fadein: 1000,
  waitBeforeSlideIn: 3000,
  fadeout: 1000,
};

export const ForTheFuture: FC<ForTheFutureProps> = ({ setShowMoreDetails }) => {
  const { t } = useTranslation();
  const [showContent2, setShowContent2] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);
  const [showMoreDetailsButton, setShowMoreDetailsButton] = useState(false);

  const CONTENT1 = {
    ...SCENE_META,
    content: [
      ...splitN(
        t(
          "For the future How was the story of the past and future? So far, I have conveyed various perspectives on the risk of disasters. Disasters strike our daily lives without warning. The damage caused by significant tremors is tremendous, swiftly taking away the peaceful days that we had been enjoying.",
        ),
      ),
    ],
  };
  const CONTENT2 = {
    ...SCENE_META,
    content: [
      ...splitN(
        t(
          "To overcome such hardships, we need human strength, bonds, and resilience. In recent years, lessons learned from large-scale disasters have led to steady progress in disaster preparedness measures by national and municipal governments.",
        ),
      ),
    ],
  };

  const content1 = CONTENT1.content.map((c, i) => (
    <>
      {c && (
        <div
          key={i}
          className={i === 0 ? "bold" : ""}
          style={{
            animationDelay: `${
              SCENE_META.delay * i + CONTENT1.waitBeforeSlideIn + (i !== 0 ? 1000 : 0)
            }ms`,
          }}>
          {c}
        </div>
      )}
      <br />
    </>
  ));
  const content2 = CONTENT2.content.map((c, i) => (
    <>
      {c && (
        <div
          key={i}
          style={{
            animationDelay: `${SCENE_META.delay * i + (i !== 0 ? 1000 : 0)}ms`,
          }}>
          {c}
        </div>
      )}
      <br />
    </>
  ));

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setShowNextButton(true);
    }, 9000);

    return () => {
      clearTimeout(timer1);
    };
  }, []);

  useEffect(() => {
    if (showContent2) {
      const timer2 = setTimeout(() => {
        setShowMoreDetailsButton(true);
      }, 4000);

      return () => clearTimeout(timer2);
    }
  }, [showContent2]);

  return (
    <WidthLimitedContent>
      <ContentWrapper>
        <Content length={CONTENT1.content.length}>
          {[content1[0], ...(showContent2 ? [] : content1.slice(1))]}
          {showContent2 && content2}
        </Content>
      </ContentWrapper>
      {showNextButton && !showContent2 && (
        <ButtonContainer>
          <StyledButton onClick={() => setShowContent2(true)}>{t("NEXT")}</StyledButton>
        </ButtonContainer>
      )}
      {showMoreDetailsButton && (
        <ButtonContainer>
          <StyledButton onClick={() => setShowMoreDetails(true)}>{t("More Details")}</StyledButton>
        </ButtonContainer>
      )}
    </WidthLimitedContent>
  );
};

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 80%;
  height: 100%;
  padding: 0 3rem;
`;

const Content = styled.div<{ length: number }>`
  color: #463c64;
  font-size: 25px;

  & > div {
    box-sizing: border-box;
    padding: 7px 10px;
    margin: 7px 0;
    display: inline-block;
    background-color: #e6e6fa;
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
      margin: 1px 0;
      padding: 2px 5px;
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
      margin: 1px 0;
      padding: 2px 5px;
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

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 50px;
  padding-bottom: 200px;
  animation: fadeIn 1s ease-out forwards;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const StyledButton = styled(Button)`
  padding: 0 5rem;
  font-size: 20px;
  cursor: pointer;
  max-width: 400px;
  height: 60px;
  border: 1px #463c64 solid;
  background: #ffffff;
  border-radius: 60px;
  margin-top: 124px;
  font-color: #463c64;
  margin: auto;

  ${breakpointMediaQueries.md} {
    height: 50px;
    font-size: 18px;
  }

  ${breakpointMediaQueries.sm} {
    height: 40px;
    font-size: 16px;
  }
`;
