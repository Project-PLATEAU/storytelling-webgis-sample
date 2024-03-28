import { FC, HTMLAttributes } from "react";

type PlusProps = {
  width?: number;
  height?: number;
};

export const Plus: FC<HTMLAttributes<HTMLOrSVGElement> & PlusProps> = props => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 10 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <rect y="4" width="10" height="2" fill="currentColor" />
    <rect x="6" width="10" height="2" transform="rotate(90 6 0)" fill="currentColor" />
  </svg>
);
