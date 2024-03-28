import { styled } from "@linaria/react";
import { FC, PropsWithChildren, useEffect, useState } from "react";

type Props = {
  name: string;
  delay: number;
  duration: number;
  from: string;
  to: string;
  direction: "x" | "y";
  zIndex?: number;
};

export const Float: FC<PropsWithChildren<Props>> = ({
  name,
  delay,
  duration,
  from,
  to,
  direction,
  children,
  zIndex = 1,
}) => {
  const [shouldStart, setShouldStart] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setShouldStart(true);
    }, delay);
  }, [delay]);

  return (
    <Root
      name={name}
      duration={duration}
      direction={direction}
      to={to}
      from={from}
      shouldStart={shouldStart}
      zIndex={zIndex}>
      {children}
    </Root>
  );
};

const Root = styled.div<{
  duration: number;
  name: string;
  direction: string;
  from: string;
  to: string;
  shouldStart: boolean;
  zIndex: number;
}>`
  grid-area: ${({ name }) => name};
  transform: ${({ direction, from, to, shouldStart }) =>
    `translate${direction}(${shouldStart ? to : from})`};
  transition: transform ${({ duration }) => duration}ms ease-out;
  background: transparent;
  pointer-events: none;
  z-index: ${({ zIndex }) => zIndex};
`;
