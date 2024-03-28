import { styled } from "@linaria/react";
import { FC, PropsWithChildren } from "react";

import { breakpointMediaQueries } from "../../constants";
import { Button } from "../Button";

export const RoundButton: FC<
  PropsWithChildren<{
    show?: boolean;
    onClick?: () => void;
    className?: string;
    delay?: number;
  }>
> = ({ show = true, onClick, className, delay = 100, children }) => {
  return (
    <Root className={className + (show ? "" : " hide")} onClick={onClick} delay={delay}>
      {children}
    </Root>
  );
};

const Root = styled(Button)<{ delay: number }>`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  border: none;
  width: 40px;
  height: 40px;
  pointer-events: auto;

  opacity: 0;
  animation: 300ms ease-out 0s fadein;
  animation-fill-mode: forwards;
  animation-delay: ${({ delay }) => `${delay}ms`};
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
    animation: 300ms ease-out 0s fadeout;
    animation-fill-mode: forwards;
    @keyframes fadeout {
      from {
        opacity: 1;
      }
      to {
        opacity: 0;
      }
    }
  }

  ${breakpointMediaQueries.sm} {
    height: 30px;
    width: 30px;
  }
`;
