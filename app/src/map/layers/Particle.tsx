import { Accessor, COORDINATE_SYSTEM } from "@deck.gl/core/typed";
import { PointCloudLayer as DeckPointCloudLayer } from "@deck.gl/layers/typed";
import { easeCircleIn, easeExpOut } from "d3-ease";
import { FC, useEffect, useRef, useState } from "react";

import { animate } from "../../utils";
import { Feature, FeatureCollection, Point } from "../../utils/types/common";
import { RenderLayer } from "../RenderLayers";

import { BaseLayer, BaseLayerProps } from "./BaseLayer";

class DeckParticleLayer extends DeckPointCloudLayer {
  getShaders() {
    const shader = super.getShaders();
    shader.vs = `\
#define SHADER_NAME point-cloud-layer-vertex-shader

attribute vec3 positions;
attribute vec3 instanceNormals;
attribute vec4 instanceColors;
attribute vec3 instancePositions;
attribute vec3 instancePositions64Low;
attribute vec3 instancePickingColors;

uniform float opacity;
uniform float radiusPixels;
uniform int sizeUnits;

varying vec4 vColor;
varying vec2 unitPosition;

void main(void) {
  geometry.worldPosition = instancePositions;
  geometry.normal = project_normal(instanceNormals);

  // position on the containing square in [-1, 1] space
  unitPosition = positions.xy;
  geometry.uv = unitPosition;
  geometry.pickingColor = instancePickingColors;

  // Find the center of the point and add the current vertex
  vec3 offset = vec3(positions.xy * project_size_to_pixel(radiusPixels), 0.0); // !!! Changed because of sizeUnits doesn't work
  DECKGL_FILTER_SIZE(offset, geometry);

  gl_Position = project_position_to_clipspace(instancePositions, instancePositions64Low, vec3(0.), geometry.position);
  DECKGL_FILTER_GL_POSITION(gl_Position, geometry);
  gl_Position.xy += project_pixel_size_to_clipspace(offset.xy);

  // Apply lighting
  vec3 lightColor = lighting_getLightColor(instanceColors.rgb, project_uCameraPosition, geometry.position.xyz, geometry.normal);

  // Apply opacity to instance color, or return instance picking color
  vColor = vec4(lightColor, instanceColors.a * opacity);
  DECKGL_FILTER_COLOR(vColor, geometry);
}
`;
    shader.fs = `\
#define SHADER_NAME point-cloud-layer-fragment-shader

precision highp float;

varying vec4 vColor;
varying vec2 unitPosition;

void main(void) {
  geometry.uv = unitPosition;

  float distToCenter = length(unitPosition);

  if (distToCenter > 1.0) {
    discard;
  }

  gl_FragColor.rgb = vColor.rgb;
  gl_FragColor.a = mix(vColor.a, 0., max(distToCenter - 0.4, 0.)); // !!! Changed to make a bloom
  DECKGL_FILTER_COLOR(gl_FragColor, geometry);
}
`;

    return shader;
  }
}

export type ParticleLayer = BaseLayer<{
  id: string;
  type: "particle";
  url?: string;
  data?: FeatureCollection<Feature<Point>>;
  pointSize?: number;
  brightness?: number;
  colorThreashold?: number;
  translation?: number;
  fadeInOut?: number;
  idle?: boolean;
  delay?: number;
  interval?: number;
  getPosition?: (data: Accessor<Feature, any>) => [number, number, number];
  getColor?: (data: Accessor<Feature, any>) => [number, number, number, number];
  filterData?: (data: FeatureCollection<Feature>) => FeatureCollection<Feature>;
}>;

export type ParticleProps = BaseLayerProps<ParticleLayer>;

export const Particle: FC<ParticleProps> = ({
  id,
  url,
  data: defaultData,
  show = true,
  pointSize = 1,
  brightness = 1,
  animation,
  fadeInOut = 300,
  colorThreashold = 1000,
  translation = 100000,
  idle = false,
  // TODO: Show after overlay
  // - Pre-calculate Particle geojson
  // - Restart animation in every 10 seconds
  delay = 1000,
  interval = 4500,
  hide,
  getPosition,
  getColor,
  filterData = v => v,
  onLayerAdd,
  onLayerRemove,
}) => {
  const [data, setData] = useState<FeatureCollection<Feature>>({
    type: "FeatureCollection",
    features: defaultData?.features ?? [],
  });

  const showRef = useRef(show);
  showRef.current = show;

  const [showWithIdle, setShowWithIdle] = useState(false);
  useEffect(() => {
    if (showWithIdle) return;
    if (idle) {
      const id = requestIdleCallback(() => {
        if (!showRef.current) return;
        setShowWithIdle(true);
      });
      return () => cancelIdleCallback(id);
    } else {
      setShowWithIdle(true);
    }
  }, [showWithIdle, idle]);

  useEffect(() => {
    if (!showWithIdle || !url) return;
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const jsonData = await response.json();
        setData(filterData(jsonData));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [url, filterData, showWithIdle]);

  const [initialized, setInitialized] = useState(false);

  const { startDuration = 1000 } = animation ?? {};

  const [restartCount, setRestartCount] = useState(0);

  const [fadeIn, setFadeIn] = useState(0);
  useEffect(() => {
    if (!initialized || !show) return;
    setShouldScale(false);
    const timer = window.setTimeout(() => {
      animate(fadeInOut, easeExpOut, v => {
        if (!showRef.current) return false;
        setFadeIn(v);
      });
    }, delay);
    return () => window.clearTimeout(timer);
  }, [initialized, show, fadeInOut, restartCount, delay]);

  const [scale, setScale] = useState(0);
  const [shouldScale, setShouldScale] = useState(false);
  useEffect(() => {
    if (!initialized || !shouldScale) return;
    animate(startDuration, easeCircleIn, v => {
      setScale(v);
    });
  }, [initialized, startDuration, shouldScale]);

  useEffect(() => {
    if (fadeIn >= 0.1) {
      setShouldScale(true);
    }
  }, [fadeIn]);

  useEffect(() => {
    if (scale < 1 || !show) return;
    const timer = window.setInterval(() => {
      setFadeIn(0);
      setScale(0);
      setShouldScale(false);
      setRestartCount(c => c + 1);
    }, interval);
    return () => {
      window.clearInterval(timer);
    };
  }, [interval, scale, show]);

  useEffect(() => {
    if (data.features.length === 0 || !showWithIdle || hide) return;
    const isScaleMax = scale >= 1;
    const layer = new DeckParticleLayer({
      id,
      data: data.features,
      coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
      visible: initialized && !isScaleMax,
      getPosition: getPosition
        ? data => {
            const pos = getPosition(data);
            return [pos[0], pos[1], (pos[2] + translation) * scale];
          }
        : undefined,
      getColor: getColor
        ? data => {
            const color = getColor(data);
            const pos = getPosition?.(data);
            return [
              color[0] * brightness,
              color[1] * brightness,
              color[2] * brightness,
              color[3] *
                (pos ? 1 - ((pos[2] + translation) * scale) / colorThreashold : 1) *
                fadeIn,
            ];
          }
        : undefined,
      parameters: {
        depthTest: false,
      },
      pointSize,
      updateTriggers: {
        getPosition: scale,
        getColor: [scale, fadeIn],
        visible: initialized && !isScaleMax,
      },
    }) as unknown as RenderLayer;
    if (!initialized) {
      setTimeout(() => {
        setInitialized(true);
      }, 500);
    }
    onLayerAdd?.(layer);
    return () => {
      onLayerRemove?.(layer);
    };
  }, [
    id,
    url,
    getPosition,
    getColor,
    brightness,
    colorThreashold,
    onLayerAdd,
    onLayerRemove,
    data,
    pointSize,
    scale,
    fadeIn,
    translation,
    showWithIdle,
    initialized,
    hide,
  ]);

  return null;
};
