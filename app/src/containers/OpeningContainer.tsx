import { styled } from "@linaria/react";
import { FC, PropsWithChildren } from "react";

import { Opening } from "../components/Opening";
import {
  TITLE_OVERLAY_FADEOUT_DELAY,
  TITLE_OVERLAY_FADEOUT_DURATION,
} from "../components/Opening/Opening";

export const OpeningContainer: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <Opening />
      <Delay>{children}</Delay>
    </>
  );
};

const Delay = styled.div`
  z-index: 1;
  opacity: 0;
  visibility: visible;
  animation: 1s ease-out ${TITLE_OVERLAY_FADEOUT_DELAY + TITLE_OVERLAY_FADEOUT_DURATION}ms fadeout;
  animation-fill-mode: forwards;
  @keyframes fadeout {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;
