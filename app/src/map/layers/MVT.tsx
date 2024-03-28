import { MVTLayer as DeckMVTLayer } from "@deck.gl/geo-layers/typed";
import { GeoJsonLayer } from "@deck.gl/layers/typed";
import { FC, useEffect } from "react";

import { RenderLayer } from "../RenderLayers";

import { BaseLayer, BaseLayerProps } from "./BaseLayer";

export type MVTLayer = BaseLayer<{
  id: string;
  type: "mvt";
  url: string;
  extruded?: boolean;
  maxZoom?: number;
  minZoom?: number;
  getElevation?: (props: { properties: any }) => number;
  getFillColor?: (props: { properties: any }) => number[];
  getText?: (props: { properties: any }, options: any) => string | undefined;
  getTextColor?: (props: { properties: any }, options: any) => [number, number, number, number];
  getTextSize?: number;
  textFontWeight?: number;
  textOutlineColor?: number[];
  textOutlineWidth?: number;
  textFontFamily?: string;
  getTextAlignmentBaseline?: string;
}>;

export type MVTProps = BaseLayerProps<MVTLayer>;

export const MVT: FC<MVTProps> = ({
  id,
  url,
  extruded,
  maxZoom,
  minZoom,
  hide,
  getFillColor,
  getElevation,
  getText,
  getTextColor,
  getTextSize = 24,
  textFontFamily = "sans-serif",
  textOutlineColor,
  textOutlineWidth,
  textFontWeight,
  getTextAlignmentBaseline,
  onLayerAdd,
  onLayerRemove,
}) => {
  useEffect(() => {
    if (hide) return;
    const layer = new DeckMVTLayer({
      id,
      // MVT json file url
      data: url,
      // pickable: true,
      ...(getFillColor ? { getFillColor } : {}),
      ...(extruded ? { extruded } : {}),
      ...(getElevation ? { getElevation } : {}),
      maxZoom,
      minZoom,
      // onClick: info => {
      //   console.log(info);
      // },
      renderSubLayers: props =>
        new GeoJsonLayer({
          ...props,
          ...(getText
            ? {
                pointType: "text",
                getText,
                getTextSize,
                getTextColor,
                textFontFamily,
                getTextAlignmentBaseline,
                textCharacterSet: "auto",
                textOutlineColor: textOutlineColor as Uint8ClampedArray & number[],
                textOutlineWidth,
                textFontWeight,
                textFontSettings: {
                  sdf: true,
                },
              }
            : {}),
          material: {
            ambient: 0.1,
            diffuse: 0.35,
            shininess: 0.000001,
            specularColor: [0, 0, 0],
          },
        }),
      updateTriggers: {
        getFillColor,
      },
    }) as unknown as RenderLayer;
    onLayerAdd?.(layer);
    return () => onLayerRemove?.(layer);
  }, [
    id,
    url,
    extruded,
    onLayerAdd,
    onLayerRemove,
    getElevation,
    getFillColor,
    getText,
    getTextColor,
    getTextSize,
    textFontFamily,
    textOutlineColor,
    textOutlineWidth,
    textFontWeight,
    getTextAlignmentBaseline,
    maxZoom,
    minZoom,
    hide,
  ]);

  return null;
};
