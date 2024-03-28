import { styled } from "@linaria/react";
import { FC } from "react";

import { ZoomIn } from "../components/icons/ZoomIn";
import { ZoomOut } from "../components/icons/ZoomOut";

type Props = {
  onZoomIn?: () => void;
  onZoomOut?: () => void;
};

export const ZoomContainer: FC<Props> = ({ onZoomIn, onZoomOut }) => {
  return (
    <Zoom>
      <ZoomButton onClick={onZoomIn}>
        <ZoomIn aria-label="zoom in" />
      </ZoomButton>
      <ZoomButton onClick={onZoomOut}>
        <ZoomOut aria-label="zoom out" />
      </ZoomButton>
    </Zoom>
  );
};

const Zoom = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 15px;
  justify-self: end;
`;

const ZoomButton = styled.button`
  cursor: pointer;
  background: transparent;
  border: none;
  padding: 0;

  pointer-events: auto;
  user-select: none;
  & > * {
    user-drag: none;
  }

  color: #463c64;

  @media (hover: hover) {
    &:hover {
      color: #5a2dc5;
    }
  }
  &:active {
    color: #00bebe;
  }
`;
