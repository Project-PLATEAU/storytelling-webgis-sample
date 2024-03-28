import { styled } from "@linaria/react";
import { FC } from "react";

import { BaseContent } from ".";

type WidthLimitedContentProps = {
  maxWidth?: number;
  children: React.ReactNode;
};

const DEFAULT_MAX_WIDTH = 800;

export const WidthLimitedContent: FC<WidthLimitedContentProps> = ({ maxWidth, children }) => {
  return (
    <Wrapper>
      <Center maxWidth={maxWidth}>
        <BaseContent>{children}</BaseContent>
      </Center>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const Center = styled.div<{ maxWidth?: number }>`
  max-width: ${({ maxWidth }) => maxWidth ?? DEFAULT_MAX_WIDTH}px;
  width: 100%;
`;
