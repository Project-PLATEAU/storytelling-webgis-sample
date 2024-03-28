import { TerrainLayer as DeckTerrainLayer } from "@deck.gl/geo-layers/typed";
import { Bounds } from "@deck.gl/geo-layers/typed/tileset-2d";
import { SimpleMeshLayer } from "@deck.gl/mesh-layers/typed";
import { easeExpIn, easeExpOut } from "d3-ease";
import { FC, useEffect, useMemo, useRef, useState } from "react";

import { useFrameTime } from "../../hooks";
import { animate } from "../../utils";
import { Feature, FeatureCollection, Polygon as PolygonType } from "../../utils/types/common";
import { createMeshData, createMeshImageData } from "../lib/heatmap";
import { inferMeshType, MeshType } from "../lib/regional-mesh";
import { RenderLayer } from "../RenderLayers";

import { BaseLayer, BaseLayerProps } from "./BaseLayer";

class LiquidMesh extends SimpleMeshLayer<any, { time: number }> {
  initializeState() {
    super.initializeState();
  }

  getShaders() {
    const shaders = super.getShaders();

    // Ref: https://github.com/visgl/deck.gl/blob/dbfb31c6ed41f0fb3d6725a5d94ef240eb787e39/modules/mesh-layers/src/simple-mesh-layer/simple-mesh-layer-vertex.glsl.ts
    shaders.vs = `\
#version 300 es
#define SHADER_NAME simple-mesh-layer-vs

uniform float sizeScale;
uniform bool composeModelMatrix;

// Custom
uniform float utime;

in vec3 positions;
in vec3 normals;
in vec3 colors;
in vec2 texCoords;
in vec3 instancePositions;
in vec3 instancePositions64Low;
in vec4 instanceColors;
in vec3 instancePickingColors;
in mat3 instanceModelMatrix;
in vec3 instanceTranslation;
out vec2 vTexCoord;
out vec3 cameraPosition;
out vec3 normals_commonspace;
out vec4 position_commonspace;
out vec4 vColor;

void main(void) {
  geometry.worldPosition = instancePositions;
  geometry.uv = texCoords;
  geometry.pickingColor = instancePickingColors;

  vTexCoord = texCoords;
  cameraPosition = project_uCameraPosition;
  vColor = vec4(colors * instanceColors.rgb, instanceColors.a);

  // === Custom ===

  vec3 deformed_pos = positions;
  float effect_intensity_x = .01;
  deformed_pos.x += effect_intensity_x * (0.5 + 0.5 * cos(positions.z + 6. * utime));
  float effect_intensity_z = 3.;
  deformed_pos.z += deformed_pos.z * effect_intensity_z * (0.5 + 0.5 * cos(positions.z + 4. * utime));

  vec3 pos = (instanceModelMatrix * deformed_pos) * sizeScale + instanceTranslation;

  // === Custom ===

  if (composeModelMatrix) {
    DECKGL_FILTER_SIZE(pos, geometry);
    normals_commonspace = project_normal(instanceModelMatrix * normals);
    geometry.worldPosition += pos;
    gl_Position = project_position_to_clipspace(pos + instancePositions, instancePositions64Low, vec3(0.0), position_commonspace);
    geometry.position = position_commonspace;
  }
  else {
    pos = project_size(pos);
    DECKGL_FILTER_SIZE(pos, geometry);
    gl_Position = project_position_to_clipspace(instancePositions, instancePositions64Low, pos, position_commonspace);
    geometry.position = position_commonspace;
    normals_commonspace = project_normal(instanceModelMatrix * normals);
  }

  geometry.normal = normals_commonspace;
  DECKGL_FILTER_GL_POSITION(gl_Position, geometry);

  DECKGL_FILTER_COLOR(vColor, geometry);
}`;

    return shaders;
  }

  draw(params: any) {
    params.uniforms.utime = this.props.time;

    super.draw(params);
  }
}

class LiquidTerrainLayer extends DeckTerrainLayer {}

export type LiquidLayer = BaseLayer<{
  id: string;
  type: "liquid";
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

export type LiquidProps = BaseLayerProps<LiquidLayer>;

export const Liquid: FC<LiquidProps> = ({
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

  const time = useFrameTime(5000, show && !hide && !!terrain);

  useEffect(() => {
    if (!terrain) return;
    const layer = new LiquidTerrainLayer({
      id,
      elevationData: terrain.terrain,
      texture: terrain.mask,
      elevationDecoder: decoder,
      bounds: terrain.bounds,
      opacity: fadeInOut * opacity,
      visible: fadeInOut !== 0,
      updateTriggers: {
        opacity: fadeInOut,
        visible: fadeInOut !== 0,
      },
      material: {
        shininess: 0,
        specularColor: [0, 0, 0],
      },
      _subLayerProps: {
        mesh: {
          type: LiquidMesh,
          getScale: () => {
            return [1, 1, scale];
          },
          time,
          updateTriggers: {
            getScale: [scale],
          },
        },
      },
    });
    setTimeout(() => {
      setInitialized(true);
    }, 300);
    onLayerAdd?.(layer as unknown as RenderLayer);
    return () => onLayerRemove?.(layer as unknown as RenderLayer);
  }, [id, url, onLayerAdd, onLayerRemove, data, decoder, terrain, scale, fadeInOut, opacity, time]);

  return null;
};
