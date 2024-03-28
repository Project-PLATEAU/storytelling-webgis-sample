import { FC } from "react";

import { Water, WaterProps } from "../layers";

type Props = WaterProps;

export const WaterContainer: FC<Props> = ({ ...props }) => {
  return <Water {...props} />;
};
