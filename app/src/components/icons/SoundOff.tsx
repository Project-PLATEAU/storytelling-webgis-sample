import { FC } from "react";

type SoundOffProps = {
  width?: number;
  height?: number;
};

export const SoundOff: FC<SoundOffProps> = ({ width = 42, height = 42 }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 42 42"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_1619_4508)">
      <path d="M25 11.11V5.55005L13 13.05H0V28.05H10.79L25 11.11Z" fill="currentColor" />
      <path d="M16.6899 30.35L24.9999 35.5499V20.45L16.6899 30.35Z" fill="currentColor" />
      <path
        d="M36.65 6.57007L35.36 8.11007C38.36 11.5601 40.02 15.9201 40.02 20.5501C40.02 25.6301 38.04 30.4001 34.46 33.9901L35.87 35.4001C43.78 27.4901 44.02 14.8101 36.66 6.57007H36.65Z"
        fill="currentColor"
      />
      <path
        d="M30.9099 30.4399L32.3199 31.8499C38.1699 25.9999 38.5299 16.6999 33.3999 10.4199L32.0799 11.9899C36.3199 17.4799 35.9299 25.3999 30.8999 30.4299L30.9099 30.4399Z"
        fill="currentColor"
      />
      <path
        d="M27.3699 26.9101L28.7799 28.3201C32.5699 24.5301 32.9999 18.6401 30.0899 14.3601L28.7399 15.9701C30.7799 19.4201 30.3199 23.9401 27.3599 26.9001L27.3699 26.9101Z"
        fill="currentColor"
      />
      <path
        d="M36.9344 0.00761101L3.53516 39.8113L5.06725 41.0969L38.4665 1.29319L36.9344 0.00761101Z"
        fill="currentColor"
      />
      <path d="M5.07004 41.09L3.54004 39.8L36.93 0L38.46 1.29L5.07004 41.09Z" fill="currentColor" />
    </g>
    <defs>
      <clipPath id="clip0_1619_4508">
        <rect width="41.99" height="41.09" fill="currentColor" />
      </clipPath>
    </defs>
  </svg>
);
