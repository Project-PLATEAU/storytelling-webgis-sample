import { FC } from "react";

import { Tileset, TilesetProps } from "../layers";

type Props = TilesetProps;

export const TilesetContainer: FC<Props> = ({ ...props }) => {
  return <Tileset {...props} />;
};
