import { FC, HTMLAttributes } from "react";

export const Play: FC<HTMLAttributes<HTMLOrSVGElement>> = props => (
  <svg
    width="10"
    height="13"
    viewBox="0 0 10 13"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <path d="M10 6.29199L0 12.292L5.04736e-07 0.291992L10 6.29199Z" fill="currentColor" />
  </svg>
);
