import { FC, HTMLAttributes } from "react";

export const ZoomIn: FC<HTMLAttributes<HTMLOrSVGElement>> = props => (
  <svg
    width="52"
    height="52"
    viewBox="0 0 52 52"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <path d="M4 12.9924V38.9924L26 52L48 38.9924V12.9924L26 0L4 12.9924Z" fill="currentColor" />
    <path
      d="M28 17.75C28 16.9203 27.3297 16.25 26.5 16.25C25.6703 16.25 25 16.9203 25 17.75V24.5H18.25C17.4203 24.5 16.75 25.1703 16.75 26C16.75 26.8297 17.4203 27.5 18.25 27.5H25V34.25C25 35.0797 25.6703 35.75 26.5 35.75C27.3297 35.75 28 35.0797 28 34.25V27.5H34.75C35.5797 27.5 36.25 26.8297 36.25 26C36.25 25.1703 35.5797 24.5 34.75 24.5H28V17.75Z"
      fill="white"
    />
  </svg>
);
