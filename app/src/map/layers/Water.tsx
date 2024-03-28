import { Bounds } from "@deck.gl/geo-layers/typed/tileset-2d";
import { easeExpOut } from "d3-ease";
import { ParticleLayer } from "deck.gl-particle";
import { FC, useEffect, useRef, useState } from "react";

import { animate } from "../../utils";
import { Feature, FeatureCollection, Polygon as PolygonType } from "../../utils/types/common";
import { inferMeshType, MeshType } from "../lib/regional-mesh";
import { createMeshData, createMeshImageData } from "../lib/windmap";
import { RenderLayer } from "../RenderLayers";

import { BaseLayer, BaseLayerProps } from "./BaseLayer";

class CustomParticleLayer extends ParticleLayer {
  start?: number;
  requestStep(this: any) {
    const { stepRequested } = this.state;
    if (stepRequested) {
      return;
    }

    this.state.stepRequested = true;
    requestAnimationFrame(() => {
      this.step();
      this.state.stepRequested = false;
    });
  }

  step(this: any) {
    this._runTransformFeedback();
  }
}

export type WaterLayer = BaseLayer<{
  id: string;
  type: "water";
  url?: string;
  waterMap?: string;
  bounds?: Bounds;
  color: [number, number, number, number];
  opacity?: number;
  valueProperty: string;
  meshCodeProperty: string;
  brightness?: number;
}>;

export type WaterProps = BaseLayerProps<WaterLayer>;

export const Water: FC<WaterProps> = ({
  id,
  url,
  waterMap,
  bounds,
  show = true,
  animation,
  color,
  opacity = 1,
  valueProperty,
  meshCodeProperty,
  brightness,
  hide,
  onLayerAdd,
  onLayerRemove,
}) => {
  const [data, setData] = useState<FeatureCollection<Feature<PolygonType>>>({
    type: "FeatureCollection",
    features: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!url) return;
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

  const [water, setWater] = useState<{ wind: string; bounds: Bounds }>();

  useEffect(() => {
    if (waterMap && bounds) {
      setWater({
        wind: waterMap,
        bounds,
      });
      return;
    }
    const features = data.features;
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
        const code = feature.properties[meshCodeProperty];
        const value = Number(feature.properties[valueProperty]);
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
      max,
      min,
      brightness,
    });
    const imageData = createMeshImageData(meshData);
    const water = {
      wind: imageData.windMap.toDataURL(),
      bounds: [
        imageData.bounds.west,
        imageData.bounds.south,
        imageData.bounds.east,
        imageData.bounds.north,
      ] as Bounds,
    };

    if (import.meta.env.DEV) {
      console.log("WATER INFO: ", water.wind, water.bounds);
    }

    setWater(water);
  }, [data, valueProperty, meshCodeProperty, brightness, waterMap, bounds]);

  const { startDuration = 300, endDuration = 300 } = animation ?? {};

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
    if (!water || hide || !show) return;
    const layer = new CustomParticleLayer({
      id,
      image: water.wind,
      color,
      bounds: water.bounds,
      maxAge: 20,
      speedFactor: -300,
      numParticles: opacity ? 3000 : 0,
      width: 8,
      opacity: opacity * fadeInOut,
    });
    setTimeout(() => {
      setInitialized(true);
    }, 100);
    onLayerAdd?.(layer as unknown as RenderLayer);
    return () => onLayerRemove?.(layer as unknown as RenderLayer);
  }, [id, url, onLayerAdd, onLayerRemove, data, water, color, fadeInOut, opacity, hide, show]);

  return null;
};
