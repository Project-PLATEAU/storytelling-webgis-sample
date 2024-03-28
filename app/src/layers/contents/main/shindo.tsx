import { FlyToInterpolator } from "@deck.gl/core/typed";

import { MAX_PITCH } from "../../../constants";
import { Layer } from "../../../map";
import { MainScenes, SubScenes } from "../../../utils";
import { MAIN_SCENE_DURATION } from "../../constants";
import { SCENE_DESCRIPTION_TIMEOUT, SceneDescriptionOverlay } from "../../overlays";
import { LayerData } from "../../types";

import { TAMA_MASK_MAP } from "./textures/tama-mask-map";
import { TAMA_TERRAIN_MAP } from "./textures/tama-terrain-map";
import { TOSHIN_MASK_MAP } from "./textures/toshin-mask-map";
import { TOSHIN_TERRAIN_MAP } from "./textures/toshin-terrain-map";
import { BASE_LABEL_MVT, TOKYO23_MVT } from "./tokyo23";

const DEFAULT_TERRAIN: Omit<Extract<Layer, { type: "terrain" }>, "id" | "type"> = {
  getValue: value => {
    const scaleValue = 1e20;
    return Math.round(value * scaleValue);
  },
  getCode: code => code.slice(0, -2),
  valueProperty: "IJMAs",
  meshCodeProperty: "MeshCode",
  opacity: 0.5,
  getTerrainColor: value => {
    const scaleValue = 1e20;

    if (value >= 6.5 * scaleValue) {
      return [255, 86, 49, 255];
    }
    if (value >= 6 * scaleValue) {
      return [255, 160, 104, 255];
    }
    if (value >= 5.5 * scaleValue) {
      return [255, 215, 46, 255];
    }
    if (value >= 5 * scaleValue) {
      return [138, 255, 46, 255];
    }
    if (value >= 4.5 * scaleValue) {
      return [46, 215, 217, 255];
    }
    if (value >= 4 * scaleValue) {
      return [46, 167, 255, 255];
    }
    if (value >= 3 * scaleValue) {
      return [70, 78, 255, 255];
    }
    return [202, 202, 202, 255];
  },
  backgroundColor: [255, 255, 255, 0],
  scaleTerrain: 30,
  brightness: 0.3,
  shouldSpreadPixel: true,
  animation: {
    startDuration: 300,
    endDuration: 100,
  },
};

export const SHINDO_LAYERS: LayerData[] = [
  {
    id: "scene2-scene-description-overlay",
    type: "overlay",
    scene: [MainScenes.Scene2],
    renderContent: props => <SceneDescriptionOverlay {...props} sceneName={MainScenes.Scene2} />,
    contentIndex: 0,
    contentDuration: SCENE_DESCRIPTION_TIMEOUT,
  },
  {
    id: "scene2-camera-1",
    type: "camera",
    viewState: {
      longitude: 139.385,
      latitude: 35.735,
      bearing: 360 * 0.1,
      pitch: 360 * 0.18,
      maxPitch: MAX_PITCH,
      zoom: 10,
      transitionDuration: 1000,
      transitionInterpolator: new FlyToInterpolator({ curve: 3 }),
    },
    enableInfiniteRotation: true,
    scene: [MainScenes.Scene2],
    contentIndex: 0,
  },
  {
    id: "scene2-camera-2",
    type: "camera",
    viewState: {
      longitude: 139.385,
      latitude: 35.735,
      bearing: 360 * 0.1,
      pitch: 360 * 0.18,
      zoom: 10,
      transitionDuration: 1000,
      transitionInterpolator: new FlyToInterpolator({ curve: 3 }),
    },
    enableInfiniteRotation: true,
    scene: [MainScenes.Scene2],
    isMain: true,
    contentIndex: 1,
    contentDuration: MAIN_SCENE_DURATION,
  },
  {
    ...TOKYO23_MVT,
    type: "mvt",
    scene: [MainScenes.Scene2],
  },
  {
    ...BASE_LABEL_MVT,
    scene: [MainScenes.Scene2],
  },
  {
    ...DEFAULT_TERRAIN,
    id: "toshin-shindo",
    type: "terrain",
    // url: "data/distributions/toshin-shindo.geojson",
    terrainMap: TOSHIN_TERRAIN_MAP,
    maskMap: TOSHIN_MASK_MAP,
    bounds: [137.428125, 33.997916666666654, 141.41875000000002, 37.39791666666666],
    scene: [MainScenes.Scene2],
    subScene: [SubScenes.Toshin],
  },
  {
    ...DEFAULT_TERRAIN,
    id: "tama-shindo",
    type: "terrain",
    // url: "data/distributions/tama-shindo.geojson",
    terrainMap: TAMA_TERRAIN_MAP,
    maskMap: TAMA_MASK_MAP,
    bounds: [137.428125, 33.997916666666654, 141.41875000000002, 37.39791666666666],
    scene: [MainScenes.Scene2],
    subScene: [SubScenes.Tama],
  },
];
