import { FC } from "react";

import { BaseLayer, BaseLayerProps, Tileset, TilesetProps } from "../layers";

export type TilesetListLayer = BaseLayer<{
  id: string;
  type: "tilesetList";
  list: TilesetProps[];
}>;

export type TilesetListProps = BaseLayerProps<TilesetListLayer>;

export const TilesetListContainer: FC<TilesetListProps> = ({ id, type: _type, list, ...rest }) => {
  return list.map(props => <Tileset key={id + props.id} {...rest} {...props} />);
};
