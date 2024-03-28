import { TerrainLayer as DeckTerrainLayer } from "@deck.gl/geo-layers/typed";
import { Bounds } from "@deck.gl/geo-layers/typed/tileset-2d";
import { easeExpIn, easeExpOut } from "d3-ease";
import { FC, useEffect, useMemo, useRef, useState } from "react";

import { useFrameTime } from "../../hooks";
import { animate } from "../../utils";
import { Feature, FeatureCollection, Polygon as PolygonType } from "../../utils/types/common";
import { createMeshData, createMeshImageData } from "../lib/heatmap";
import { inferMeshType, MeshType } from "../lib/regional-mesh";
import { RenderLayer } from "../RenderLayers";

import { BaseLayer, BaseLayerProps } from "./BaseLayer";

export type TerrainLayer = BaseLayer<{
  id: string;
  type: "terrain";
  url?: string;
  opacity?: number;
  getTerrainColor: (
    value: number,
    scale: number,
    ratio: number,
  ) => [number, number, number, number];
  getValue?: (value: number) => number;
  getCode?: (code: string) => string;
  backgroundColor: [number, number, number, number];
  valueProperty: string;
  meshCodeProperty: string;
  brightness?: number;
  scaleTerrain?: number;
  shouldSpreadPixel?: boolean;
  terrainMap?: string;
  maskMap?: string;
  bounds?: Bounds;
}>;

export type TerrainProps = BaseLayerProps<TerrainLayer>;

export const Terrain: FC<TerrainProps> = ({
  id,
  url,
  show = true,
  hide,
  getTerrainColor,
  getValue = v => v,
  getCode = v => v,
  backgroundColor,
  valueProperty,
  meshCodeProperty,
  brightness,
  opacity = 1,
  onLayerAdd,
  onLayerRemove,
  scaleTerrain = 10,
  shouldSpreadPixel,
  animation,
  terrainMap,
  maskMap,
  bounds,
}) => {
  const [data, setData] = useState<FeatureCollection<Feature<PolygonType>>>({
    type: "FeatureCollection",
    features: [],
  });

  useEffect(() => {
    if (!url) return;

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

  const [terrain, setTerrain] = useState<{ terrain: string; mask: string; bounds: Bounds }>();

  useEffect(() => {
    if (terrain || hide) return;
    if (terrainMap && maskMap && bounds) {
      setTerrain({ terrain: terrainMap, mask: maskMap, bounds });
      return;
    }

    const features = data.features
      .slice()
      .sort((a, b) => Number(a.properties[valueProperty]) - Number(b.properties[valueProperty]));
    if (!features.length) return;
    const { values, codes, meshType, max, min } = features.reduce<{
      codes: number[];
      values: number[];
      meshType: MeshType | undefined;
      max: number;
      min: number;
    }>(
      (res, feature) => {
        if (!feature.properties) return res;
        const code = getCode(String(feature.properties[meshCodeProperty]));
        const value = getValue(Number(feature.properties[valueProperty]));
        res.codes.push(Number(code));
        res.values.push(value);
        res.meshType = inferMeshType(String(code));
        res.max = Math.max(res.max, value);
        res.min = Math.min(res.min, value);
        return res;
      },
      { codes: [], values: [], meshType: undefined, max: 0, min: Infinity },
    );

    if (!meshType) return;

    const meshData = createMeshData({
      values: new Float32Array(values),
      codes: new Float64Array(codes),
      meshType,
      getTerrainColor,
      backgroundColor,
      max,
      min,
      brightness,
      shouldSpreadPixel,
    });
    const imageData = createMeshImageData(meshData);
    const obj = {
      terrain: imageData.heightMap.toDataURL(),
      mask: imageData.maskTexture.toDataURL(),
      bounds: [
        imageData.bounds.west,
        imageData.bounds.south,
        imageData.bounds.east,
        imageData.bounds.north,
      ] as Bounds,
    };

    if (import.meta.env.DEV) {
      console.log("TERRAIN INFO: ", obj.terrain, obj.mask, obj.bounds);
    }

    setTerrain(obj);
  }, [
    data,
    valueProperty,
    getTerrainColor,
    backgroundColor,
    meshCodeProperty,
    brightness,
    getValue,
    getCode,
    shouldSpreadPixel,
    terrain,
    terrainMap,
    maskMap,
    bounds,
    hide,
  ]);

  const decoder = useMemo(
    () => ({
      rScaler: 1,
      gScaler: 0,
      bScaler: 0,
      offset: 0,
    }),
    [],
  );

  const [initialized, setInitialized] = useState(false);

  const { startDuration = 300, endDuration = 300 } = animation ?? {};

  const [scale, setScale] = useState(0);
  const [fadeInOut, setFadeInOut] = useState(0);

  const showRef = useRef(show);
  showRef.current = show;

  useEffect(() => {
    if (!initialized || !show) return;
    animate(startDuration, easeExpOut, v => {
      if (!showRef.current) return false;
      setScale(scaleTerrain * v);
    });
  }, [initialized, show, startDuration, scaleTerrain]);
  useEffect(() => {
    if (!initialized || !show) return;
    animate(startDuration / 3, easeExpOut, v => {
      if (!showRef.current) return false;
      setFadeInOut(v);
    });
  }, [initialized, show, startDuration]);

  useEffect(() => {
    if (show) return;
    animate(endDuration, easeExpOut, v => {
      if (showRef.current) return false;
      setScale(scaleTerrain - scaleTerrain * v);
    });
  }, [show, endDuration, scaleTerrain]);
  useEffect(() => {
    if (show) return;
    animate(endDuration / 3, easeExpIn, v => {
      if (showRef.current) return false;
      setFadeInOut(1 - v);
    });
  }, [show, endDuration]);

  const time = useFrameTime(700, show && !hide && !!terrain);

  useEffect(() => {
    if (!terrain || hide) return;
    const layer = new DeckTerrainLayer({
      id,
      elevationData: terrain.terrain,
      texture: terrain.mask,
      elevationDecoder: decoder,
      bounds: terrain.bounds,
      opacity: fadeInOut * opacity,
      updateTriggers: {
        opacity: fadeInOut,
        visible: fadeInOut !== 0,
      },
      visible: fadeInOut !== 0,
      material: {
        shininess: 0,
        specularColor: [0, 0, 0],
      },
      _subLayerProps: {
        mesh: {
          getScale: () => {
            const next = 2;
            return [1, 1, scale - next + next * Math.cos(time)];
          },
          time,
          updateTriggers: {
            getScale: [scale, time],
          },
        },
      },
    });
    setTimeout(() => {
      setInitialized(true);
    }, 300);
    onLayerAdd?.(layer as unknown as RenderLayer);
    return () => onLayerRemove?.(layer as unknown as RenderLayer);
  }, [
    id,
    url,
    onLayerAdd,
    onLayerRemove,
    data,
    decoder,
    terrain,
    scale,
    fadeInOut,
    opacity,
    time,
    hide,
  ]);

  return null;
};
