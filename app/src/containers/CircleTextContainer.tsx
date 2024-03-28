import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { CircleWithText } from "../components/CircleWithText";
import type { TextAlignment } from "../components/CircleWithText/CircleWithText";
import { breakPoint } from "../constants";
import { useMediaQuery } from "../hooks";
import type { ScreenPosition } from "../utils";

type ElementState = ScreenPosition & {
  width: number;
  height: number;
};

type TargetElements = {
  areaSelector: ElementState;
  langButton: ElementState;
  soundButton: ElementState;
  reportButton: ElementState;
  playButton: ElementState;
  playBackButton: ElementState;
  playNextButton: ElementState;
  timeSequence: ElementState;
  PcMenuButton: ElementState;
  SpMenuButton: ElementState;
};

export const CircleTextContainer: FC = () => {
  const { t } = useTranslation();
  const isBreakpointMd = useMediaQuery(`(max-width: ${breakPoint.md}px)`);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [positions, setPositions] = useState<TargetElements>({
    areaSelector: { x: -10000, y: -10000, width: 0, height: 0 },
    langButton: { x: -10000, y: -10000, width: 0, height: 0 },
    soundButton: { x: -10000, y: -10000, width: 0, height: 0 },
    reportButton: { x: -10000, y: -10000, width: 0, height: 0 },
    playButton: { x: -10000, y: -10000, width: 0, height: 0 },
    playBackButton: { x: -10000, y: -10000, width: 0, height: 0 },
    playNextButton: { x: -10000, y: -10000, width: 0, height: 0 },
    timeSequence: { x: -10000, y: -10000, width: 0, height: 0 },
    PcMenuButton: { x: -10000, y: -10000, width: 0, height: 0 },
    SpMenuButton: { x: -10000, y: -10000, width: 0, height: 0 },
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const updatePosition = (elementId: keyof TargetElements) => {
        const element = document.getElementById(elementId);
        if (element) {
          const rect = element.getBoundingClientRect();
          setPositions(prevPositions => ({
            ...prevPositions,
            [elementId]: {
              x: rect.left,
              y: rect.top,
              width: rect.width,
              height: rect.height,
            },
          }));
        }
      };

      updatePosition("areaSelector");
      updatePosition("langButton");
      updatePosition("soundButton");
      updatePosition("reportButton");
      updatePosition("playButton");
      updatePosition("playBackButton");
      updatePosition("playNextButton");
      updatePosition("timeSequence");
      updatePosition("PcMenuButton");
      updatePosition("SpMenuButton");
    }, 1500);
    return () => clearTimeout(timer);
  }, [windowWidth]);

  return (
    <>
      {Object.entries(positions).map(([key, { x, y, width, height }], index) => {
        let adjustedX = x;
        let adjustedY = y;
        let text = "";
        let textAlignment: TextAlignment = "belowCenterOfCircle";

        switch (key) {
          case "areaSelector":
            adjustedY += height;
            text = t("Tutorial areaSelector");
            textAlignment = "leftOfCircle";
            break;
          case "langButton":
            adjustedY += height;
            text = t("Tutorial langButton");
            textAlignment = "belowCenterOfCircle";
            break;
          case "soundButton":
            adjustedX += width / 2;
            adjustedY += height;
            text = t("Tutorial soundButton");
            textAlignment = "belowCenterOfCircle";
            break;
          case "reportButton":
            if (!isBreakpointMd) {
              adjustedY += height;
              textAlignment = "leftOfCircle";
            } else {
              adjustedX += width;
              adjustedY += height / 2;
              textAlignment = "rightOfCircle";
            }
            text = t("Tutorial reportButton");
            break;
          case "playButton":
            text = t("Play/Pause");
            adjustedX += width / 2;
            adjustedY += 5;
            textAlignment = "aboveCenterOfCircle";
            break;
          case "playBackButton":
            text = t("Skip");
            if (!isBreakpointMd) {
              adjustedY += height / 2;
              textAlignment = "aboveCenterOfCircle";
            } else {
              adjustedX += width / 2;
              adjustedY += (height * 4) / 3 - 15;
              textAlignment = "aboveCenterOfCircle";
            }
            break;
          case "playNextButton":
            text = t("Skip");
            if (!isBreakpointMd) {
              adjustedX += width;
              adjustedY += height / 2;
              textAlignment = "aboveCenterOfCircle";
            } else {
              adjustedX += width / 2;
              adjustedY += (height * 4) / 3 - 15;
              textAlignment = "aboveCenterOfCircle";
            }
            break;
          case "timeSequence":
            text = t("Time sequence");
            adjustedX += width / 2;
            adjustedY += height / 2;
            textAlignment = "aboveCenterOfCircle";
            break;
          case "PcMenuButton":
            text = t("PcMenuButton");
            if (!isBreakpointMd) {
              adjustedX += (width * 1) / 2;
              textAlignment = "aboveCenterOfCircle";
            } else {
              adjustedX += -10000;
              adjustedY += -10000;
              textAlignment = "belowCenterOfCircle";
            }
            break;
          case "SpMenuButton":
            text = t("SpMenuButton");
            if (!isBreakpointMd) {
              adjustedX += -10000;
              adjustedY += -10000;
              textAlignment = "belowCenterOfCircle";
            } else {
              adjustedX += width / 2;
              adjustedY += height;
              textAlignment = "belowCenterOfCircle";
            }
            break;
        }

        return (
          <CircleWithText
            key={index}
            position={{ x: adjustedX, y: adjustedY }}
            text={text}
            textAlignment={textAlignment}
            shouldShowCircle={key !== "timeSequence"}
          />
        );
      })}
    </>
  );
};
