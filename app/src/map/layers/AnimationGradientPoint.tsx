import { ScatterplotLayer } from "@deck.gl/layers/typed";
import { FC, useEffect } from "react";

import { Point as PointGeometry, Feature, Coordinates } from "../../utils/types/common";
import { RenderLayer } from "../RenderLayers";

import { BaseLayer, BaseLayerProps } from "./BaseLayer";

export type AnimationGradientPointLayer = BaseLayer<{
  id: string;
  type: "animationGradientPoint";
  url: string;
  getRadiusProperty: (props: { properties: any }) => string;
  getPosition?: (props: { properties: any }) => number[];
  getFillColor?: (props: { properties: any }) => number[];
  getRadius?: (props: { properties: any }) => number;
}>;

export type AnimationGradientPointProps = BaseLayerProps<AnimationGradientPointLayer> & {
  time?: number;
  data?: Feature<PointGeometry>[];
  delay?: number;
  altitude?: number;
};

const NUM_CIRCLES = 10;
const CYCLIC_SEC = 3; // > 1

const easeInOutQuart = (x: number): number =>
  x < 0.5 ? 8 * x * x * x * x : 1 - 8 * --x * x * x * x;
const sawWave = (t: number) => (t % CYCLIC_SEC) / CYCLIC_SEC;
const easingWave = (t: number): number => easeInOutQuart(sawWave(t));

export const AnimationGradientPoint: FC<AnimationGradientPointProps> = ({
  id,
  getFillColor,
  onLayerAdd,
  onLayerRemove,
  getRadiusProperty,
  time = 0,
  data = [],
  delay = 0,
  altitude = 200,
}) => {
  const saw = sawWave(Math.max(time - delay, 0)) + 0.5;
  const easing = easingWave(Math.max(time - delay, 0)) + 0.5;

  useEffect(() => {
    const layers: RenderLayer[] = [];

    // central circle
    layers.push(
      new ScatterplotLayer<Feature<PointGeometry>>({
        id: `${id}-central-circle`,
        data: data,
        getPosition: d => {
          const [longitude, latitude] =
            typeof d.geometry.coordinates[0] === "number"
              ? (d.geometry.coordinates as Coordinates)
              : d.geometry.coordinates[0];
          return [longitude, latitude, altitude];
        },
        getFillColor: () => [255, 10, 10, Math.max(0, 1 - saw + 0.25) * 225],
        getRadius: d => Number(getRadiusProperty(d)) * 0.2 * saw,
        updateTriggers: {
          getRadius: [saw],
          getFillColor: [saw],
        },
      }) as unknown as RenderLayer,
    );

    // outer circles
    layers.push(
      ...Array.from({ length: NUM_CIRCLES }).map((_, i) => {
        const scale = i / NUM_CIRCLES;
        return new ScatterplotLayer<Feature<PointGeometry>>({
          id: `${id}-${i}`,
          data: data,
          getPosition: d => {
            const [longitude, latitude] =
              typeof d.geometry.coordinates[0] === "number"
                ? (d.geometry.coordinates as Coordinates)
                : d.geometry.coordinates[0];
            return [longitude, latitude, altitude];
          },
          getFillColor: () => [255, 10, 10, 50 * Math.max(0, 1 - easing)],
          getRadius: d =>
            easing > 0.7 ? Number(getRadiusProperty(d)) * 0.2 * Math.max(0, easing - scale) : 0,
          updateTriggers: {
            getRadius: [easing],
            getFillColor: [easing, easing],
          },
        }) as unknown as RenderLayer;
      }),
    );

    layers.forEach(layer => onLayerAdd?.(layer));

    return () => layers.forEach(layer => onLayerRemove?.(layer));
  }, [id, data, onLayerAdd, onLayerRemove, getFillColor, easing, getRadiusProperty, altitude, saw]);

  return null;
};
