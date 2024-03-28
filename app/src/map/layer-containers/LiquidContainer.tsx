import { FC } from "react";

import { Liquid, LiquidProps } from "../layers";

type Props = LiquidProps;

export const LiquidContainer: FC<Props> = ({ ...props }) => {
  return <Liquid {...props} />;
};
