import { styled } from "@linaria/react";
import {
  Fragment,
  ReactElement,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { breakpointMediaQueries, BURNED_OVERLAY } from "../../constants";
import { useRefValue } from "../../hooks";
import { useTranslation } from "../../i18n/hooks";
import { splitN } from "../../utils";
import { Button } from "../Button";
import { Minus } from "../icons/Minus";
import { Plus } from "../icons/Plus";
import { InfoTooltip } from "../InfoTooltip";

export const MINMIZED_REPORT_WIDTH = 320;

export type LegendContentItem = {
  title: string;
  items: LegendItem[];
};

export type LegendItem = {
  label?: string;
  color?: string;
  img?: ReactElement;
};

export type MinimizedReportProps = {
  legends: LegendContentItem[];
  title: string;
  description: string;
  sourceLabel: string;
  sourceUrl: string;
  onClick?: (isOpen: boolean) => void;
  onOpenReport?: () => void;
  isDefaultOpen?: boolean;
};

const tooltipTargets = [
  { key: "SCENE_01_0_legend_title", contentKey: "INFO_STRUCTURE_TYPE" },
  { key: "SCENE_02_0_legend_title", contentKey: "INFO_STRUCTURE_TYPE" },
  { key: "SCENE_03_0_legend_title", contentKey: "INFO_STRUCTURE_TYPE" },
  { key: "SCENE_04_0_legend_title", contentKey: "INFO_FIRE_PREVENTION_AREA" },
  { key: `${BURNED_OVERLAY}_0_legend_title`, contentKey: "INFO_FIRE_PREVENTION_AREA_FOR_OVERLAY" },
  { key: "SCENE_04_1_legend_title", contentKey: "INFO_STRUCTURE_TYPE" },
  { key: "SCENE_05_0_legend_title", contentKey: "INFO_STRUCTURE_TYPE" },
];

export const MinimizedReport: React.FC<MinimizedReportProps> = ({
  legends,
  title,
  description,
  sourceLabel,
  sourceUrl,
  onClick,
  onOpenReport,
  isDefaultOpen = true,
}) => {
  const { t } = useTranslation();
  const rootRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(isDefaultOpen);
  const prevIsOpenRef = useRefValue(isOpen);
  const handleOpen = useCallback(() => {
    onClick?.(!prevIsOpenRef.current);
    setIsOpen(v => !v);
  }, [onClick, prevIsOpenRef]);

  useEffect(() => {
    setIsOpen(isDefaultOpen);
  }, [isDefaultOpen]);

  useLayoutEffect(() => {
    if (!rootRef.current || !isOpen) return;
    rootRef.current.scrollTo(0, 0);
  }, [isOpen, title, description, legends]);

  return (
    <Root open={isOpen} ref={rootRef}>
      <TitleContainer>
        <Title>{splitN(title)}</Title>
        <OpenButton onClick={handleOpen}>
          {isOpen ? (
            <OpenIcon>
              <Minus />
            </OpenIcon>
          ) : (
            <OpenIcon>
              <Plus />
            </OpenIcon>
          )}
        </OpenButton>
      </TitleContainer>
      <ContentContainer style={{ maxHeight: isOpen ? "300vh" : "0px" }}>
        <Description>{splitN(description)}</Description>
        <Source>
          {t("Source: ")}
          <SourceLink target="_blank" href={sourceUrl}>
            {sourceLabel}
          </SourceLink>
        </Source>
        <LegendTitle>{t("Legend")}</LegendTitle>
        <LegendContentContainer>
          {legends.map(legend => (
            <Fragment key={legend.title}>
              <LegendContentItemComp>
                <LegendContentItemTitle>{legend.title}</LegendContentItemTitle>
                {tooltipTargets.find(({ key }) => legend.title === t(key))?.contentKey && (
                  <InfoTooltip
                    contentKey={
                      tooltipTargets.find(({ key }) => legend.title === t(key))!.contentKey
                    }>
                    ?
                  </InfoTooltip>
                )}
              </LegendContentItemComp>
              <LegendList>
                {legend.items.map(item =>
                  item.img ? (
                    <LegendListItem key={item.label ?? "" + item.color ?? ""}>
                      <LegendImage>{item.img}</LegendImage>
                      {splitN(item.label ?? "")}
                    </LegendListItem>
                  ) : (
                    <LegendListItem key={item.label ?? "" + item.color ?? ""}>
                      <LegendColor color={item.color ?? ""} />
                      {splitN(item.label ?? "")}
                    </LegendListItem>
                  ),
                )}
              </LegendList>
            </Fragment>
          ))}
        </LegendContentContainer>
        <MoreReportButtonContainer>
          <MoreReportButton onClick={onOpenReport}>
            <MoreReportButtonLabel>More Report</MoreReportButtonLabel>
            <Plus />
          </MoreReportButton>
        </MoreReportButtonContainer>
      </ContentContainer>
    </Root>
  );
};

const Root = styled.div<{ open: boolean }>`
  background-color: #ffffff;
  padding: 20px 20px;
  box-sizing: border-box;
  color: #463c64;
  width: ${MINMIZED_REPORT_WIDTH}px;
  overflow-y: ${({ open }) => (open ? "auto" : "hidden")};
  max-height: 50vh;
  pointer-events: auto;

  ${breakpointMediaQueries.md} {
    width: 100%;
    max-height: 40vh;
  }
`;

const ContentContainer = styled.div`
  transform: translateZ(0);
  transition: max-height 100ms ease-in;
  overflow-y: hidden;
  ${breakpointMediaQueries.md} {
    transform-origin: bottom;
  }
`;

const TitleContainer = styled.div`
  display: flex;
`;

const Title = styled.div`
  font-size: 25px;
  flex: 1;
  font-weight: bold;
  ${breakpointMediaQueries.md} {
    font-size: 20px;
  }
`;

const OpenButton = styled(Button)`
  border: 1px solid #463c64;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  ${breakpointMediaQueries.md} {
    margin-top: 0;
  }
`;

const OpenIcon = styled.div`
  display: flex;
`;

const Description = styled.div`
  margin-top: 20px;
  font-size: 14px;

  ${breakpointMediaQueries.md} {
    margin-top: 15px;
  }
`;

const Source = styled.div`
  margin-top: 6px;
  font-size: 10px;
`;

const SourceLink = styled.a`
  color: inherit;
`;

const LegendTitle = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-top: 20px;
`;

const LegendContentContainer = styled.ul`
  display: flex;
  flex-direction: column;

  padding: 0;
  list-style: none;
  margin: 0;
`;

const LegendContentItemComp = styled.li`
  display: flex;
  gap: 6px;
  margin-top: 10px;
`;

const LegendContentItemTitle = styled.li`
  font-size: 14px;
`;

const LegendList = styled.ul`
  display: flex;
  gap: 0 5px;
  padding: 0;
  list-style: none;
  margin: 0;
  margin-top: 8px;
  ${breakpointMediaQueries.md} {
    gap: 0 5px;
  }
`;

const LegendListItem = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px 0;
  font-size: 9px;
  max-width: 50px;
  flex: 1;
  text-align: center;

  ${breakpointMediaQueries.md} {
  }
`;

const LegendColor = styled.div<{ color: string }>`
  width: 20px;
  height: 20px;
  background-color: ${({ color }) => color};

  ${breakpointMediaQueries.md} {
    width: 20px;
    height: 20px;
  }
`;

const LegendImage = styled.div`
  width: 20px;
  height: auto;
`;

const MoreReportButtonContainer = styled.div`
  display: flex;
  width: 100%;
  margin-top: 30px;
  justify-content: center;
`;

const MoreReportButton = styled(Button)`
  display: flex;
  width: 140px;
  box-sizing: border-box;
  padding: 12px 25px;
  border: 1px solid #463c64;
  border-radius: 100px;
  font-size: 12px;
  align-items: center;
`;

const MoreReportButtonLabel = styled.div`
  display: inline-flex;
  flex: 1;
`;
