import { styled } from "@linaria/react";

type IconWithOutlineProps = {
  iconPath: string;
  hoverColor?: string;
  size?: string | number;
  outlineWidth?: string | number;
  outlineColor?: string;
};

export const IconWithOutline: React.FC<IconWithOutlineProps> = ({
  iconPath,
  hoverColor = "#a0d8ef",
  size = "2em",
  outlineWidth = "3px",
  outlineColor = "#ffffff",
}) => {
  return (
    <StyledIcon outlineWidth={outlineWidth} outlineColor={outlineColor} hoverColor={hoverColor}>
      <img src={iconPath} alt="Icon" style={{ width: size, height: size }} />
    </StyledIcon>
  );
};

const StyledIcon = styled.div<{
  outlineWidth: string | number;
  outlineColor: string;
  hoverColor: string;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  box-shadow: 0 0 0 ${props => props.outlineWidth} ${props => props.outlineColor};
  width: fit-content;
  height: fit-content;
  padding: 15px;
  color: white;

  &:hover {
    color: ${props => props.hoverColor};
  }
`;
