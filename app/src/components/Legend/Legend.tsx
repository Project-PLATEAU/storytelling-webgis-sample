import { styled } from "@linaria/react";
import { useTranslation } from "react-i18next";

import { breakpointMediaQueries } from "../../constants";
import { splitN } from "../../utils";

export type LegenItem = {
  label?: string;
  color?: string;
};

export type LegendProps = {
  items?: LegenItem[];
  color?: string;
  showRange?: boolean;
  reverse?: boolean;
};

export const Legend: React.FC<LegendProps> = ({
  items = [],
  color = "#463C64",
  showRange,
  reverse = false,
}) => {
  const { t } = useTranslation();

  return (
    <Root color={color}>
      {showRange && (
        <Range color={color}>
          <Arrow color={color} style={{ top: 0, transform: "rotate(-45deg)" }} />
          {splitN(t("Large damage"))}
          <Space />
          {splitN(t("No damage"))}
          <Arrow color={color} style={{ bottom: 0, transform: "rotate(135deg)" }} />
        </Range>
      )}
      <List>
        {items.map(item => (
          <Item key={item.label ?? "" + item.color ?? ""} reverse={reverse}>
            <Color color={item.color ?? ""} />
            {item.label}
          </Item>
        ))}
      </List>
      {}
    </Root>
  );
};

const Root = styled.div<{ color: string }>`
  display: flex;
  font-size: 12px;
  color: ${({ color }) => color};

  ${breakpointMediaQueries.md} {
    font-size: 10px;
  }
`;

const Range = styled.div<{ color: string }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: end;
  box-sizing: border-box;
  border-right: 1px solid ${({ color }) => color};
  padding-right: 10px;
  margin-right: 10px;
  white-space: nowrap;

  ${breakpointMediaQueries.md} {
    padding-right: 5px;
    margin-right: 5px;
  }
`;

const Arrow = styled.div<{ color: string }>`
  position: absolute;
  box-sizing: border-box;
  right: -4px;
  padding: 3px;
  border-right: 1px solid ${({ color }) => color};
  border-top: 1px solid ${({ color }) => color};

  ${breakpointMediaQueries.md} {
    padding: 2px;
    right: -3px;
  }
`;

const Space = styled.div`
  flex: 1;
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 10px 0;
  padding: 0;
  list-style: none;
  margin: 0;

  ${breakpointMediaQueries.md} {
    gap: 5px 0;
  }
`;

const Item = styled.li<{ reverse: boolean }>`
  display: flex;
  flex-direction: ${({ reverse }) => (reverse ? "row-reverse" : "row")};
  gap: 0 10px;
  align-items: center;
  margin-right: 5px;
  font-weight: bold;
  white-space: nowrap;

  ${breakpointMediaQueries.md} {
    gap: 0 5px;
  }
`;

const Color = styled.div<{ color: string }>`
  width: 30px;
  height: 30px;
  background-color: ${({ color }) => color};

  ${breakpointMediaQueries.md} {
    width: 20px;
    height: 20px;
  }
`;
