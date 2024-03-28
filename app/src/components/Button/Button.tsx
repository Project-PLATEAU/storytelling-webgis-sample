import { styled } from "@linaria/react";

export const Button = styled.button<{ active?: boolean }>`
  border: 1px solid #463c64;
  color: ${({ active }) => (active ? `#5a2dc5` : `#463c64`)};
  background: ${({ active }) => (active ? `#00bebe` : `#ffffff`)};
  cursor: pointer;

  @media (hover: hover) {
    &:hover {
      color: #ffffff;
      background: #5a2dc5;
      border: 1px solid #5a2dc5;
    }
  }
  &:active {
    border: 1px solid #5a2dc5;
    color: #5a2dc5;
    background: #00bebe;
  }
`;
