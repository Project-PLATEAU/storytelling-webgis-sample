import { FC } from "react";

type CloseProps = {
  width?: number;
  height?: number;
};

export const Close: FC<CloseProps> = ({ width = 15, height = 15 }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <rect
      x="1.36377"
      width="19.2847"
      height="1.92847"
      transform="rotate(45 1.36377 0)"
      fill="currentColor"
    />
    <rect
      y="13.6364"
      width="19.2847"
      height="1.92847"
      transform="rotate(-45 0 13.6364)"
      fill="currentColor"
    />
  </svg>
);
