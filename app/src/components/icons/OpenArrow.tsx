import { FC, HTMLAttributes } from "react";

export const OpenArrow: FC<
  HTMLAttributes<HTMLOrSVGElement> & { width?: number; height?: number }
> = props => (
  <svg
    width="24"
    height="18"
    viewBox="0 0 24 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <g clipPath="url(#clip0_1388_3909)">
      <path
        d="M1.94061 7.94102C1.35468 8.52695 1.35468 9.47852 1.94061 10.0645L9.44061 17.5645C10.0266 18.1504 10.9781 18.1504 11.564 17.5645C12.15 16.9785 12.15 16.027 11.564 15.441L6.61874 10.5004L21 10.5004C21.8297 10.5004 22.5 9.83008 22.5 9.00039C22.5 8.1707 21.8297 7.50039 21 7.50039L6.61874 7.50039L11.5594 2.55976C12.1453 1.97383 12.1453 1.02226 11.5594 0.436327C10.9734 -0.14961 10.0219 -0.14961 9.43593 0.436327L1.93593 7.93633L1.94061 7.94102Z"
        fill="currentColor"
      />
    </g>
    <defs>
      <clipPath id="clip0_1388_3909">
        <rect width="18" height="24" fill="white" transform="translate(0 18) rotate(-90)" />
      </clipPath>
    </defs>
  </svg>
);
