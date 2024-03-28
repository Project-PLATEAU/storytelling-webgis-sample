import { styled } from "@linaria/react";
import { FC } from "react";
import { useTranslation } from "react-i18next";

import { breakpointMediaQueries } from "../../constants";
import { Play } from "../icons/Play";
import { Stop } from "../icons/Stop";
import { RoundButton } from "../RoundButton";

export const PlayButton: FC<{
  show?: boolean;
  active?: boolean;
  onClick?: () => void;
  className?: string;
  delay?: number;
}> = ({ show = true, active = true, onClick, className, delay = 100 }) => {
  const { t } = useTranslation();
  return (
    <RoundButton className={className + (show ? "" : " hide")} onClick={onClick} delay={delay}>
      {active ? <StopIcon aria-label={t("stop")} /> : <PlayIcon aria-label={t("play")} />}
    </RoundButton>
  );
};

const PlayIcon = styled(Play)`
  aspect-ratio: 13 / 10;
  width: 100%;
  ${breakpointMediaQueries.md} {
    width: 80%;
  }
`;

const StopIcon = styled(Stop)`
  aspect-ratio: 14 / 12;
  width: 100%;
  ${breakpointMediaQueries.md} {
    width: 80%;
  }
`;
