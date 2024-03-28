import { GridLayer as DeckGridLayer } from "@deck.gl/aggregation-layers/typed";
import { Accessor } from "@deck.gl/core/typed";
import { easeExpIn, easeExpOut } from "d3-ease";
import { FC, useEffect, useMemo, useRef, useState } from "react";

import { useFrameTime } from "../../hooks";
import { animate } from "../../utils";
import { Feature, FeatureCollection } from "../../utils/types/common";
import { RenderLayer } from "../RenderLayers";

import { BaseLayer, BaseLayerProps } from "./BaseLayer";

export type GridLayer = BaseLayer<{
  id: string;
  type: "grid";
  url: string;
  scale?: number;
  cellSize?: number;
  brightness?: number;
  opacity?: number;
  getPosition?: (data: Accessor<Feature, any>) => [number, number];
  getColorWeight?: (data: Accessor<Feature, any>) => number;
  getElevationWeight?: (data: Accessor<Feature, any>) => number;
  getElevation?: (data: Accessor<Feature, any>) => number;
  colorRange?: [number, number, number, number][];
  shouldInfiniteScale?: boolean;
}>;

export type GridProps = BaseLayerProps<GridLayer>;

export const Grid: FC<GridProps> = ({
  id,
  url,
  show = true,
  hide,
  inHiddenAnimation,
  colorRange,
  scale: elevationScale = 10,
  cellSize = 150,
  brightness = 1,
  opacity = 1,
  animation,
  shouldInfiniteScale = true,
  getPosition,
  getColorWeight,
  getElevationWeight,
  getElevation,
  onLayerAdd,
  onLayerRemove,
}) => {
  const [data, setData] = useState<FeatureCollection<Feature>>({
    type: "FeatureCollection",
    features: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [url]);

  const convertedColorRange = useMemo(
    () =>
      colorRange?.map(
        c =>
          [c[0] * brightness, c[1] * brightness, c[2] * brightness, c[3]] as [
            number,
            number,
            number,
            number,
          ],
      ),
    [colorRange, brightness],
  );

  const [initialized, setInitialized] = useState(false);

  const { startDuration, endDuration } = animation ?? {};

  const [scale, setScale] = useState(0);
  const [fadeInOut, setFadeInOut] = useState(0);

  const showRef = useRef(show);
  showRef.current = show;

  useEffect(() => {
    if (!initialized || !show || !startDuration || inHiddenAnimation) return;
    animate(startDuration, easeExpOut, v => {
      if (!showRef.current) return false;
      setScale(elevationScale * v);
    });
  }, [initialized, show, startDuration, elevationScale, inHiddenAnimation]);
  useEffect(() => {
    if (!initialized || !show || !startDuration || inHiddenAnimation) return;
    animate(startDuration / 2, easeExpOut, v => {
      if (!showRef.current) return false;
      setFadeInOut(v);
    });
  }, [initialized, show, startDuration, inHiddenAnimation]);

  useEffect(() => {
    if (show || !endDuration || inHiddenAnimation) return;
    animate(endDuration, easeExpOut, v => {
      if (showRef.current) return false;
      setScale(elevationScale - elevationScale * v);
    });
  }, [show, endDuration, elevationScale, inHiddenAnimation]);
  useEffect(() => {
    if (show || !endDuration || inHiddenAnimation) return;
    animate(endDuration / 3, easeExpIn, v => {
      if (showRef.current) return false;
      setFadeInOut(1 - v);
    });
  }, [show, endDuration, inHiddenAnimation]);

  useEffect(() => {
    if (!inHiddenAnimation) return;
    setFadeInOut(1);
    setScale(1);
  }, [inHiddenAnimation]);

  const time = useFrameTime(
    700,
    show && !hide && !!data.features.length && !inHiddenAnimation && shouldInfiniteScale,
  );

  useEffect(() => {
    if (data.features.length === 0 || hide) return;
    const layer = new DeckGridLayer({
      id,
      data: data.features,
      getPosition,
      getColorWeight,
      getElevationWeight,
      getElevation,
      extruded: !!getElevationWeight || !!getElevation,
      elevationScale: shouldInfiniteScale ? scale - 0.3 + 0.3 * Math.cos(time) : scale,
      cellSize,
      colorRange: convertedColorRange,
      colorAggregation: "MAX",
      elevationAggregation: "MAX",
      opacity: fadeInOut * opacity,
      visible: fadeInOut !== 0,
      offset: [10, 10],
      material: {
        shininess: 0,
        specularColor: [0, 0, 0],
        diffuse: 1,
      },
      updateTriggers: {
        opacity: fadeInOut,
        visible: fadeInOut !== 0,
      },
      ...(getElevationWeight ? { getElevationWeight } : {}),
    }) as unknown as RenderLayer;
    setTimeout(() => {
      setInitialized(true);
    }, 300);
    onLayerAdd?.(layer);
    return () => onLayerRemove?.(layer);
  }, [
    id,
    url,
    getPosition,
    getColorWeight,
    onLayerAdd,
    onLayerRemove,
    getElevationWeight,
    getElevation,
    data,
    convertedColorRange,
    elevationScale,
    scale,
    cellSize,
    fadeInOut,
    opacity,
    hide,
    time,
    shouldInfiniteScale,
  ]);

  return null;
};
