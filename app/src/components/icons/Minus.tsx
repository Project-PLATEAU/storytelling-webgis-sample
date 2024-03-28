import { FC, HTMLAttributes } from "react";

type Props = {
  width?: number;
  height?: number;
};

export const Minus: FC<HTMLAttributes<HTMLOrSVGElement> & Props> = props => (
  <svg
    width="10"
    height="2"
    viewBox="0 0 10 2"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <rect width="10" height="2" fill="currentColor" />
  </svg>
);
