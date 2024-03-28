import { Accessor } from "@deck.gl/core/typed";
import { PolygonLayer as DeckPolygonLayer } from "@deck.gl/layers/typed";
import { easeExpOut } from "d3-ease";
import { FC, useEffect, useRef, useState } from "react";

import { animate } from "../../utils";
import { Feature, FeatureCollection, Polygon as PolygonType } from "../../utils/types/common";
import { RenderLayer } from "../RenderLayers";

import { BaseLayer, BaseLayerProps } from "./BaseLayer";

export type PolygonLayer = BaseLayer<{
  id: string;
  type: "polygon";
  url: string;
  opacity?: number;
  getPolygon?: (data: Feature<PolygonType>) => PolygonType["coordinates"];
  getFillColor?: (data: Accessor<Feature, any>) => [number, number, number, number];
  getElevation?: (data: Accessor<Feature, any>) => number;
}>;

export type PolygonProps = BaseLayerProps<PolygonLayer>;

export const Polygon: FC<PolygonProps> = ({
  id,
  url,
  show = true,
  hide,
  animation,
  opacity = 1,
  getPolygon,
  getFillColor,
  getElevation,
  onLayerAdd,
  onLayerRemove,
}) => {
  const [data, setData] = useState<FeatureCollection<Feature<PolygonType>>>({
    type: "FeatureCollection",
    features: [],
  });

  const { startDuration = 300, endDuration = 300 } = animation ?? {};

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

  const [initialized, setInitialized] = useState(false);

  const showRef = useRef(show);
  showRef.current = show;

  const [fadeInOut, setFadeInOut] = useState(0);
  useEffect(() => {
    if (!initialized || !show) return;
    animate(startDuration, easeExpOut, v => {
      if (!showRef.current) return false;
      setFadeInOut(v);
    });
  }, [initialized, show, startDuration]);

  useEffect(() => {
    if (show) return;
    animate(endDuration, easeExpOut, v => {
      if (showRef.current) return false;
      setFadeInOut(1 - v);
    });
  }, [show, endDuration]);

  useEffect(() => {
    if (hide) return;
    const visible = !!fadeInOut && !!data.features.length;
    const layer = new DeckPolygonLayer({
      id,
      data: data.features,
      getPolygon,
      getFillColor,
      extruded: !!getElevation,
      opacity: fadeInOut * opacity,
      visible,
      updateTriggers: {
        opacity: fadeInOut,
        visible,
      },
      ...(getElevation ? { getElevation } : {}),
      stroked: false,
    }) as unknown as RenderLayer;
    setTimeout(() => {
      setInitialized(true);
    }, 100);
    onLayerAdd?.(layer);
    return () => onLayerRemove?.(layer);
  }, [
    id,
    url,
    getPolygon,
    getFillColor,
    onLayerAdd,
    onLayerRemove,
    getElevation,
    data,
    fadeInOut,
    opacity,
    hide,
  ]);

  return null;
};
