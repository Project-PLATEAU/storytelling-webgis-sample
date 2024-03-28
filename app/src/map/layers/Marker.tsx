import { IconLayer } from "@deck.gl/layers/typed";
import { Dispatch, FC, SetStateAction, useEffect } from "react";

import {
  Point as PointGeometry,
  Feature,
  FeatureCollection,
  Coordinates,
} from "../../utils/types/common";
import { RenderLayer } from "../RenderLayers";

import { BaseLayer, BaseLayerProps } from "./BaseLayer";

export type MarkerLayer = BaseLayer<{
  id: string;
  type: "marker";
  url?: string;
  data?: FeatureCollection<Feature<PointGeometry>>;
}>;
export type MarkerProps = BaseLayerProps<MarkerLayer> & {
  data?: FeatureCollection<Feature<PointGeometry>>;
  setSelectedPinPosition?: Dispatch<SetStateAction<{ x: number; y: number } | null>>;
};

export const Marker: FC<MarkerProps> = ({
  id,
  onLayerAdd,
  onLayerRemove,
  data = { type: "FeatureCollection", features: [] },
  selectedFeature = null,
  onSelectFeature = () => {},
  setSelectedPinPosition = () => {},
  onChangeCursor = () => {},
}) => {
  useEffect(() => {
    const layer = new IconLayer<Feature<PointGeometry>>({
      id,
      data: data.features,
      getPosition: d =>
        [d.geometry.coordinates[0], d.geometry.coordinates[1], 100] as unknown as Coordinates,
      iconAtlas: "img/marker.svg",
      iconMapping: {
        marker: { x: 0, y: 0, width: 24, height: 32, mask: true },
      },
      getIcon: () => "marker",
      getSize: () => 10,
      getColor: d => {
        if (d.id === selectedFeature?.id) {
          return [0, 190, 190];
        }
        return [228, 4, 172];
      },
      sizeScale: 5,
      sizeUnits: "meters",
      pickable: true,
      onClick: ({ object, x, y }) => {
        onSelectFeature(object);
        setSelectedPinPosition({ x, y });
      },
      onHover: ({ picked }) => {
        onChangeCursor(picked ? "pointer" : "grab");
      },
      updateTriggers: {
        getColor: [selectedFeature],
      },
    });
    onLayerAdd?.(layer as unknown as RenderLayer);

    return () => onLayerRemove?.(layer as unknown as RenderLayer);
  }, [
    id,
    data.features,
    onLayerAdd,
    onLayerRemove,
    selectedFeature,
    onSelectFeature,
    setSelectedPinPosition,
    onChangeCursor,
  ]);

  return null;
};
