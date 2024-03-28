import { styled } from "@linaria/react";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "../../components/Button";
import { breakpointMediaQueries, TITLE_FONT_FAMILY } from "../../constants";
import { OverlayContentProps } from "../../map/layers";
import { splitN } from "../../utils";

type Props = OverlayContentProps & {
  onClick?: () => void;
};

const FADE_DURATION = 1000;

export const DisclaimerOverlay: FC<Props> = ({ show, onClick }) => {
  const { t } = useTranslation();
  const [animatedShow, setAnimatedShow] = useState(show);
  const [checked, setChecked] = useState(false);

  const handleHide = () => {
    if (checked && onClick) onClick();

    setAnimatedShow(false);
  };

  useEffect(() => {
    if (animatedShow) return;
    const timer = window.setTimeout(() => {
      onClick;
    }, FADE_DURATION);
    return () => window.clearTimeout(timer);
  }, [animatedShow, onClick]);

  if (!show) return;

  return (
    <Root className={!animatedShow ? "hide" : ""}>
      <Title>{t("Disclaimer")}</Title>
      <Description>
        {splitN(
          t(
            "Please be aware that we cannot accept any responsibility for any loss or damage to life, body, or property that may occur in activities based on information provided on this site. Our site may experience temporary delays or interruptions without prior notice to users due to reasons such as communication network equipment, system failures, maintenance, or other unavoidable circumstances.Even in the event of delays, interruptions, or other issues with the display, we cannot accept any responsibility for damages incurred by users or other third parties resulting from these issues.Please understand these conditions in advance.",
          ),
        )}
      </Description>
      <CheckboxWrapper>
        <Checkbox
          type="checkbox"
          id="disclaimer-checkbox"
          checked={checked}
          onChange={() => setChecked(!checked)}
        />
        <CheckboxLabel htmlFor="disclaimer-checkbox">
          {t("Not to be displayed in the future")}
        </CheckboxLabel>
      </CheckboxWrapper>
      <RoundButton onClick={handleHide}>OK</RoundButton>
    </Root>
  );
};

const Root = styled.div`
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.9);
  opacity: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  z-index: 1;

  animation: ${FADE_DURATION}ms ease-out 5s fadein;
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
    padding: 0 10px;
  }
`;

const Title = styled.h2`
  font-family: ${TITLE_FONT_FAMILY};
  font-weight: lighter;
  display: inline-block;
  box-sizing: border-box;
  padding: 10px;
  padding-top: 0;
  font-size: 45px;
  margin: 0;
  margin-bottom: 20px;
  color: #ffffff;

  ${breakpointMediaQueries.md} {
    font-size: 30px;
    margin-bottom: 15px;
  }
`;

const Description = styled.div`
  box-sizing: border-box;
  padding: 5px 10px;
  margin: 5px 0;
  color: #ffffff;
  font-size: 20px;
  margin: 0;
  margin-bottom: 60px;
  line-height: 1.5;

  width: 70%;

  ${breakpointMediaQueries.md} {
    font-size: 12px;
    margin-bottom: 15px;
  }
`;

const RoundButton = styled(Button)`
  pointer-events: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: auto;
  padding: 1rem 8rem;
  border: 1px solid #ffffff;
  border-radius: 100vh;
  font-size: 20px;

  ${breakpointMediaQueries.md} {
    font-size: 16px;
    padding: 0.5rem 4rem;
  }
`;

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const Checkbox = styled.input`
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid #ffffff;
  border-radius: 4px;
  margin-right: 10px;
  cursor: pointer;
  position: relative;

  &:checked {
    background-color: #463c64;
    border-color: #463c64;

    &:after {
      content: "";
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 6px;
      height: 12px;
      border: solid #ffffff;
      border-width: 0 3px 3px 0;
      transform: translate(-50%, -65%) rotate(45deg);
    }
  }
`;

const CheckboxLabel = styled.label`
  color: #ffffff;
  font-size: 16px;
  cursor: pointer;
`;
