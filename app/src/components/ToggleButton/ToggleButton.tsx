import { styled } from "@linaria/react";
import { PropsWithChildren } from "react";

type ToggleButtonProps = {
  onClick?: () => void;
  active?: boolean;
};

export const ToggleButton: React.FC<PropsWithChildren<ToggleButtonProps>> = ({
  children,
  onClick,
  active,
}) => {
  return (
    <Button active={active} onClick={onClick}>
      {children}
    </Button>
  );
};

const Button = styled.div<{ active?: boolean }>`
  display: grid;
  align-content: center;
  justify-content: center;
  width: 100%;
  cursor: pointer;
  color: #463c64;
  border: 1px solid #463c64;
  border-radius: 100px;
  font-size: 14px;
  min-height: 40px;
  box-sizing: border-box;
  padding: 5px 10px;
  background-color: ${({ active }) => (active ? "#00BEBE" : "#FFFFFF")};
`;
