import { FC, HTMLAttributes } from "react";

export const Stop: FC<HTMLAttributes<HTMLOrSVGElement>> = props => (
  <svg
    width="12"
    height="14"
    viewBox="0 0 12 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <rect width="4" height="14" fill="currentColor" />
    <rect x="8" width="4" height="14" fill="currentColor" />
  </svg>
);
