import { FC } from "react";

import { MVT, MVTProps } from "../layers";

type Props = MVTProps;

export const MVTContainer: FC<Props> = ({ ...props }) => {
  return <MVT {...props} />;
};
