import { styled } from "@linaria/react";
import { ReactElement } from "react";

type IconButtonProps = {
  children: ReactElement;
  text: string;
  onClick?: () => void;
};

export const IconButton: React.FC<IconButtonProps> = ({ children, text, onClick }) => {
  return (
    <StyledIconWithText onClick={onClick}>
      {children}
      <span>{text}</span>
    </StyledIconWithText>
  );
};

const StyledIconWithText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  cursor: pointer;
`;
