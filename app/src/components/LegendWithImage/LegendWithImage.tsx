import { styled } from "@linaria/react";
import { ReactElement } from "react";

import { breakpointMediaQueries } from "../../constants";

export type LegendWithImageProps = {
  label: string;
  description: string;
  img: ReactElement;
  color?: string;
};

export const LegendWithImage: React.FC<LegendWithImageProps> = ({
  label,
  description,
  img,
  color = "#463C64",
}) => {
  return (
    <Root color={color}>
      <Item>
        <Content>
          <Label>{label}</Label>
          <Description>{description}</Description>
        </Content>
        <Image>{img}</Image>
      </Item>
    </Root>
  );
};

const Root = styled.div<{ color: string }>`
  display: flex;
  font-size: 14px;
  color: ${({ color }) => color};

  ${breakpointMediaQueries.md} {
    font-size: 10px;
  }
`;

const Item = styled.div`
  display: flex;
  gap: 0 10px;
  align-items: center;
  margin-right: 5px;

  ${breakpointMediaQueries.md} {
    gap: 0 5px;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: end;
  white-space: nowrap;
`;

const Label = styled.div`
  font-weight: bold;
  font-size: 12px;

  ${breakpointMediaQueries.md} {
    font-size: 10px;
  }
`;

const Description = styled.div`
  font-size: 10px;

  ${breakpointMediaQueries.md} {
    font-size: 8px;
  }
`;

const Image = styled.div`
  width: 30px;
  height: auto;

  ${breakpointMediaQueries.md} {
    width: 20px;
  }
`;
