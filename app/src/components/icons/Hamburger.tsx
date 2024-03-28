import { FC, HTMLAttributes } from "react";

export const Hamburger: FC<
  HTMLAttributes<HTMLOrSVGElement> & { width?: number; height?: number }
> = props => (
  <svg
    width="16"
    height="14"
    viewBox="0 0 16 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <rect width="16" height="2" fill="currentColor" />
    <rect y="6" width="16" height="2" fill="currentColor" />
    <rect y="12" width="16" height="2" fill="currentColor" />
  </svg>
);
