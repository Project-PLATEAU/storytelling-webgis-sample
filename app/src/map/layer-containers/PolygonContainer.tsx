import { FC } from "react";

import { Polygon, PolygonProps } from "../layers";

type Props = PolygonProps;

export const PolygonContainer: FC<Props> = ({ ...props }) => {
  return <Polygon {...props} />;
};
