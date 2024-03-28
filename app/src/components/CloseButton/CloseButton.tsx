import { styled } from "@linaria/react";
import { FC } from "react";

import { Close } from "../icons/Close";

type Props = {
  onClick?: () => void;
  width?: number;
  height?: number;
  color?: string;
};

export const CloseButton: FC<Props> = ({ onClick, width = 20, height = 20, color = "#463c64" }) => {
  return (
    <Button onClick={onClick} color={color}>
      <Close width={width} height={height} />
    </Button>
  );
};

const Button = styled.button<{ color: string }>`
  border: none;
  color: ${({ color }) => color};
  background: transparent;
  cursor: pointer;
`;
