import { styled } from "@linaria/react";

export const FadeAnimation = styled.div<{ duration: number }>`
  --duration: ${({ duration }) => duration}ms;

  position: relative;
  opacity: 0;
  animation: var(--duration) ease-out 0s fadein;
  animation-fill-mode: forwards;
  @keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  &.hide {
    opacity: 1;
    animation: var(--duration) ease-out 0s fadeout;
    animation-fill-mode: forwards;
    @keyframes fadeout {
      from {
        opacity: 1;
      }
      to {
        opacity: 0;
      }
    }
  }
`;
