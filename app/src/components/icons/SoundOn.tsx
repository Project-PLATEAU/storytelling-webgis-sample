import { FC } from "react";

type SoundOnProps = {
  width?: number;
  height?: number;
};

export const SoundOn: FC<SoundOnProps> = ({ width = 42, height = 30 }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 42 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_1619_296)">
      <path d="M20 7.5H0V22.5H20V7.5Z" fill="currentColor" />
      <path d="M25 30L1 15L25 0V30Z" fill="currentColor" />
      <path
        d="M35.8602 29.8499L34.4502 28.4399C38.0402 24.8499 40.0102 20.0799 40.0102 14.9999C40.0102 9.9199 38.0302 5.1499 34.4502 1.5599L35.8602 0.149902C44.0502 8.3399 44.0502 21.6599 35.8602 29.8499Z"
        fill="currentColor"
      />
      <path
        d="M32.3202 26.3099L30.9102 24.8999C36.3702 19.4399 36.3702 10.5599 30.9102 5.09994L32.3202 3.68994C38.5602 9.92994 38.5602 20.0799 32.3202 26.3199V26.3099Z"
        fill="currentColor"
      />
      <path
        d="M28.7899 22.78L27.3799 21.37C30.8899 17.86 30.8899 12.15 27.3799 8.63998L28.7899 7.22998C33.0799 11.52 33.0799 18.5 28.7899 22.79V22.78Z"
        fill="currentColor"
      />
    </g>
    <defs>
      <clipPath id="clip0_1619_296">
        <rect width="42" height="30" fill="currentColor" />
      </clipPath>
    </defs>
  </svg>
);
