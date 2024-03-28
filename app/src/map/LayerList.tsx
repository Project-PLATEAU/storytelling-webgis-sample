import { FC } from "react";

import {
  MVTContainer,
  TilesetContainer,
  AnimationGradientPointContainer,
  TerrainContainer,
  WaterContainer,
  GridContainer,
  PolygonContainer,
  ParticleContainer,
  TilesetListLayer,
  TilesetListProps,
  TilesetListContainer,
  CameraContainer,
  MarkerContainer,
  OverlayContainer,
  LiquidContainer,
} from "./layer-containers";
import {
  TilesetProps,
  TilesetLayer,
  BaseLayerProps,
  MVTLayer,
  MVTProps,
  AnimationGradientPointLayer,
  AnimationGradientPointProps,
  PolygonLayer,
  PolygonProps,
  TerrainLayer,
  TerrainProps,
  WaterProps,
  WaterLayer,
  GridProps,
  GridLayer,
  ParticleLayer,
  ParticleProps,
  CameraProps,
  CameraLayer,
  MarkerLayer,
  MarkerProps,
  OverlayProps,
  OverlayLayer,
  LiquidLayer,
  LiquidProps,
} from "./layers";

export type Layer =
  | TilesetLayer
  | TilesetListLayer
  | MVTLayer
  | AnimationGradientPointLayer
  | PolygonLayer
  | GridLayer
  | TerrainLayer
  | LiquidLayer
  | ParticleLayer
  | WaterLayer
  | CameraLayer
  | MarkerLayer
  | OverlayLayer;

export type LayerProps =
  | TilesetProps
  | TilesetListProps
  | MVTProps
  | AnimationGradientPointProps
  | PolygonProps
  | GridProps
  | TerrainProps
  | LiquidProps
  | ParticleProps
  | WaterProps
  | CameraProps
  | MarkerProps
  | OverlayProps;

export type LayerItemProps = LayerProps;

const LayerItem: FC<LayerItemProps> = props => {
  switch (props.type) {
    case "tileset":
      return <TilesetContainer {...props} />;
    case "tilesetList":
      return <TilesetListContainer {...props} />;
    case "mvt":
      return <MVTContainer {...props} />;
    case "animationGradientPoint":
      return <AnimationGradientPointContainer {...props} />;
    case "polygon":
      return <PolygonContainer {...props} />;
    case "grid":
      return <GridContainer {...props} />;
    case "terrain":
      return <TerrainContainer {...props} />;
    case "liquid":
      return <LiquidContainer {...props} />;
    case "water":
      return <WaterContainer {...props} />;
    case "particle":
      return <ParticleContainer {...props} />;
    case "camera":
      return <CameraContainer {...props} />;
    case "marker":
      return <MarkerContainer {...props} />;
    case "overlay":
      return <OverlayContainer {...props} />;
    default:
      return null;
  }
};

type LayersProps = BaseLayerProps<{
  layers: LayerProps[];
}>;

export const LayerList: FC<LayersProps> = ({ layers, ...props }) => {
  return layers.map(l => <LayerItem key={l.id} {...l} {...props} />);
};
