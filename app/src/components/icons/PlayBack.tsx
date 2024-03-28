import { FC, HTMLAttributes } from "react";

export const PlayBack: FC<HTMLAttributes<HTMLOrSVGElement>> = props => (
  <svg
    width="18"
    height="13"
    viewBox="0 0 18 13"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <path d="M8 6.29199L18 0.291994L18 12.292L8 6.29199Z" fill="currentColor" />
    <path d="M1.25931e-07 6.29199L10 0.291994L10 12.292L1.25931e-07 6.29199Z" fill="currentColor" />
  </svg>
);
