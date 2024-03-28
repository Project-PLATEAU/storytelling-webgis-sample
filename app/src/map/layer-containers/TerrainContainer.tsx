import { FC } from "react";

import { Terrain, TerrainProps } from "../layers";

type Props = TerrainProps;

export const TerrainContainer: FC<Props> = ({ ...props }) => {
  return <Terrain {...props} />;
};
