import { FC, HTMLAttributes } from "react";

export const ZoomOut: FC<HTMLAttributes<HTMLOrSVGElement>> = props => (
  <svg
    width="52"
    height="52"
    viewBox="0 0 52 52"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <path d="M4 12.9924V38.9924L26 52L48 38.9924V12.9924L26 0L4 12.9924Z" fill="currentColor" />
    <path
      d="M36.25 26C36.25 26.8297 35.5797 27.5 34.75 27.5H18.25C17.4203 27.5 16.75 26.8297 16.75 26C16.75 25.1703 17.4203 24.5 18.25 24.5H34.75C35.5797 24.5 36.25 25.1703 36.25 26Z"
      fill="white"
    />
  </svg>
);
