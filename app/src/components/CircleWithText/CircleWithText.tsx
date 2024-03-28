import { styled } from "@linaria/react";
import { FC, useEffect, useRef, useState } from "react";

import { breakpointMediaQueries } from "../../constants";
import type { ScreenPosition } from "../../utils";

export type TextAlignment =
  | "leftOfCircle"
  | "rightOfCircle"
  | "aboveCenterOfCircle"
  | "belowCenterOfCircle";

type CircleWithTextProps = {
  position: ScreenPosition;
  text?: string;
  textAlignment?: TextAlignment;
  shouldShowCircle?: boolean;
};

export const CircleWithText: FC<CircleWithTextProps> = ({
  position,
  text,
  textAlignment = "belowCenterOfCircle",
  shouldShowCircle = true,
}) => {
  const [textSize, setTextSize] = useState({ width: 0, height: 0 });
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textRef.current) {
      const { width, height } = textRef.current.getBoundingClientRect();
      setTextSize({ width, height });
    }
  }, [text]);

  const calculateTextPosition = (): ScreenPosition => {
    let x = position.x;
    let y = position.y;
    const circleRadius = 15;
    const offset = 10;

    switch (textAlignment) {
      case "leftOfCircle":
        x -= circleRadius + offset + textSize.width;
        y -= textSize.height / 2;
        break;
      case "rightOfCircle":
        x += circleRadius + offset;
        y -= textSize.height / 2;
        break;
      case "aboveCenterOfCircle":
        x -= textSize.width / 2;
        y -= circleRadius + offset + textSize.height;
        break;
      case "belowCenterOfCircle":
        x -= textSize.width / 2;
        y += circleRadius + offset;
        break;
    }

    return { x, y };
  };

  const textPosition = calculateTextPosition();

  return (
    <Root>
      {shouldShowCircle && <Circle position={position} />}
      {text && (
        <CircleText ref={textRef} position={textPosition}>
          {text}
        </CircleText>
      )}
    </Root>
  );
};

const Root = styled.div``;

const CircleText = styled.div<{ position: ScreenPosition }>`
  position: absolute;
  color: rgba(235, 240, 0);
  left: ${({ position }) => position.x}px;
  top: ${({ position }) => position.y}px;

  ${breakpointMediaQueries.md} {
    font-size: 10px;
  }
`;

const Circle = styled.div<{ position: ScreenPosition }>`
  position: absolute;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: rgba(235, 240, 0, 0.7);
  transform: translate(-50%, -50%);
  left: ${({ position }) => position.x}px;
  top: ${({ position }) => position.y}px;
  z-index: 5;
  animation: pulse 1s ease-out infinite;

  @keyframes pulse {
    0% {
      transform: translate(-50%, -50%) scale(1);
      background-color: rgba(235, 240, 0, 0.7);
    }
    50% {
      transform: translate(-50%, -50%) scale(1.2);
      background-color: rgba(235, 240, 0, 0.9);
    }
    100% {
      transform: translate(-50%, -50%) scale(1);
      background-color: rgba(235, 240, 0, 0.7);
    }
  }
`;
