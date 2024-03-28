import { styled } from "@linaria/react";

import { breakpointMediaQueries } from "../../constants";
import { splitN } from "../../utils";
import { Button } from "../Button";

type ToggleButtonProps = {
  onClick?: (v: boolean) => void;
  active?: boolean;
  contents: [string, string];
};

export const SwitchButton: React.FC<ToggleButtonProps> = ({ onClick, active, contents }) => {
  const handleClick = (v: boolean) => () => {
    if (v === active) return;
    onClick?.(v);
  };
  return (
    <Root>
      <ButtonWrapper active={!active} left onClick={handleClick(false)}>
        {splitN(contents[0])}
      </ButtonWrapper>
      <ButtonWrapper active={active} onClick={handleClick(true)}>
        {splitN(contents[1])}
      </ButtonWrapper>
    </Root>
  );
};

const Root = styled.div`
  display: inline-grid;
  grid-template-columns: 1fr 1fr;
`;

const ButtonWrapper = styled(Button)<{ active?: boolean; left?: boolean }>`
  display: grid;
  align-content: center;
  justify-content: center;
  width: 100%;
  color: #463c64;

  border: none;

  box-sizing: border-box;

  --radius: 20px;
  border-radius ${({ left }) =>
    left ? "var(--radius) 0 0 var(--radius)" : "0 var(--radius) var(--radius) 0"};
  font-size: 12px;
  min-height: 40px;
  min-width: 140px;
  box-sizing: border-box;
  padding: 5px 10px;
  background: ${({ active }) => (active ? "#00bebe" : "#FFFFFF")};

  ${breakpointMediaQueries.md} {
    font-size: 10px;
    min-height: 30px;
    padding: 3px 10px;
  }

  @media (hover: hover) {
    &:hover {
      color: #ffffff;
      background: #5a2dc5;
    }
  }
  &:active {
    color: #463c64;
    background: #00bebe;
  }
`;
