import { FC, HTMLAttributes } from "react";

export const PlayNext: FC<HTMLAttributes<HTMLOrSVGElement>> = props => (
  <svg
    width="18"
    height="13"
    viewBox="0 0 18 13"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <path d="M10 6.70801L0 12.708L5.04736e-07 0.708008L10 6.70801Z" fill="currentColor" />
    <path d="M18 6.70801L8 12.708L8 0.708008L18 6.70801Z" fill="currentColor" />
  </svg>
);
