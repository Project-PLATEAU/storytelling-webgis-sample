import { FC } from "react";

import { Grid, GridProps } from "../layers";

type Props = GridProps;

export const GridContainer: FC<Props> = ({ ...props }) => {
  return <Grid {...props} />;
};
