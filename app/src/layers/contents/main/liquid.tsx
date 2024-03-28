import { FlyToInterpolator } from "@deck.gl/core/typed";

import { MAX_PITCH, RESOURCE_URL } from "../../../constants";
import { Layer } from "../../../map";
import { MainScenes, SubScenes } from "../../../utils";
import { MAIN_SCENE_DURATION } from "../../constants";
import { SCENE_DESCRIPTION_TIMEOUT, SceneDescriptionOverlay } from "../../overlays";
import { LayerData } from "../../types";

import { BASE_LABEL_MVT, TOKYO23_MVT } from "./tokyo23";

const DEFAULT_POLYGON: Omit<Extract<Layer, { type: "polygon" }>, "id" | "type" | "url"> = {
  getPolygon: data => {
    return data.geometry.coordinates;
  },
  getFillColor: data => {
    const v = data.properties["value"];

    if (v === 0) {
      return [114, 132, 197, 255];
    }
    if (v > 0 && v <= 5) {
      return [47, 255, 130, 255];
    }
    if (v > 5 && v <= 15) {
      return [56, 232, 232, 255];
    }
    if (v > 15) {
      return [47, 255, 130, 255];
    }
    return [202, 202, 202, 255];
  },
  opacity: 0.5,
  animation: {
    startDuration: 300,
    endDuration: 100,
  },
};

const DEFAULT_WATER: Omit<Extract<Layer, { type: "water" }>, "id" | "type" | "url"> = {
  valueProperty: "PLcorrecte",
  meshCodeProperty: "MeshCode",
  color: [255, 255, 255, 255],
  brightness: 2,
  opacity: 0.5,
  animation: {
    startDuration: 300,
    endDuration: 100,
  },
};

// const DEFAULT_LIQUID: Omit<Extract<Layer, { type: "liquid" }>, "id" | "type" | "url"> = {
//   valueProperty: "PLcorrecte",
//   meshCodeProperty: "MeshCode",
//   getValue: v => v * 1e7,
//   opacity: 0.8,
//   getTerrainColor: (_value, _scale, ratio) => {
//     if (ratio >= 0.4) {
//       return [180, 85, 66, 255];
//     }
//     if (ratio >= 0.1) {
//       return [180, 114, 66, 255];
//     }
//     if (ratio >= 0.05) {
//       return [180, 143, 66, 255];
//     }
//     if (ratio > 0.01) {
//       return [180, 172, 66, 255];
//     }
//     return [202, 202, 202, 0];
//   },
//   shouldSpreadPixel: true,
//   backgroundColor: [255, 255, 255, 0],
//   scaleTerrain: 3,
//   brightness: 0.3,
//   animation: {
//     startDuration: 300,
//     endDuration: 200,
//   },
// };

export const LIQUID_LAYERS: LayerData[] = [
  {
    id: "scene5-scene-description-overlay",
    type: "overlay",
    scene: [MainScenes.Scene5],
    renderContent: props => <SceneDescriptionOverlay {...props} sceneName={MainScenes.Scene5} />,
    contentIndex: 0,
    contentDuration: SCENE_DESCRIPTION_TIMEOUT,
  },
  {
    id: "scene5-camera",
    type: "camera",
    viewState: {
      longitude: 139.695,
      latitude: 35.665,
      bearing: 0,
      pitch: 0,
      maxPitch: MAX_PITCH,
      zoom: 10.5,
      transitionDuration: 1000,
      transitionInterpolator: new FlyToInterpolator({ curve: 2 }),
    },
    enableInfiniteRotation: true,
    scene: [MainScenes.Scene5],
    contentIndex: 0,
  },
  {
    id: "scene5-camera-2",
    type: "camera",
    viewState: {
      longitude: 139.758877,
      latitude: 35.6843181,
      bearing: 360 * 0.05,
      pitch: 360 * 0.19,
      zoom: 12,
      transitionDuration: 1000,
      transitionInterpolator: new FlyToInterpolator({ curve: 2 }),
    },
    enableInfiniteRotation: true,
    scene: [MainScenes.Scene5],
    isMain: true,
    contentIndex: 1,
    contentDuration: MAIN_SCENE_DURATION,
  },
  {
    ...TOKYO23_MVT,
    type: "mvt",
    scene: [MainScenes.Scene5],
  },
  {
    ...BASE_LABEL_MVT,
    scene: [MainScenes.Scene5],
  },
  // {
  //   ...DEFAULT_LIQUID,
  //   id: "toshin-ekijo_liquid",
  //   type: "liquid",
  //   // url: `${RESOURCE_URL}data/distributions/toshin-ekijo.geojson`,
  //   terrainMap: `${RESOURCE_URL}data/distributions/maps/toshin-liquid_terrain.png`,
  //   maskMap: `${RESOURCE_URL}data/distributions/maps/toshin-liquid_mask.png`,
  //   bounds: [137.48125, 32.85, 141.421875, 37.34166666666666],
  //   scene: [MainScenes.Scene5],
  //   subScene: [SubScenes.Toshin],
  // },
  // {
  //   ...DEFAULT_LIQUID,
  //   id: "tama-ekijo_liquid",
  //   type: "liquid",
  //   // url: `${RESOURCE_URL}data/distributions/tama-ekijo.geojson`,
  //   terrainMap: `${RESOURCE_URL}data/distributions/maps/tama-liquid_terrain.png`,
  //   maskMap: `${RESOURCE_URL}data/distributions/maps/tama-liquid_mask.png`,
  //   bounds: [137.48125, 34.02083333333333, 141.421875, 37.34166666666666],
  //   scene: [MainScenes.Scene5],
  //   subScene: [SubScenes.Tama],
  // },
  {
    ...DEFAULT_POLYGON,
    id: "toshin-ekijo_polygon",
    type: "polygon",
    url: `${RESOURCE_URL}data/distributions/minified_toshin-ekijo.geojson`,
    scene: [MainScenes.Scene5],
    subScene: [SubScenes.Toshin],
  },
  {
    ...DEFAULT_POLYGON,
    id: "tama-ekijo_polygon",
    type: "polygon",
    url: `${RESOURCE_URL}data/distributions/minified_tama-ekijo.geojson`,
    scene: [MainScenes.Scene5],
    subScene: [SubScenes.Tama],
  },
  {
    ...DEFAULT_WATER,
    id: "toshin-ekijo",
    type: "water",
    // url: `${RESOURCE_URL}data/distributions/toshin-ekijo.geojson`,
    waterMap: `${RESOURCE_URL}data/distributions/maps/toshin-liquid_wind.png`,
    bounds: [138.98125, 35.52083333333333, 139.921875, 35.84166666666666],
    scene: [MainScenes.Scene5],
    subScene: [SubScenes.Toshin],
  },
  {
    ...DEFAULT_WATER,
    id: "tama-ekijo",
    type: "water",
    // url: `${RESOURCE_URL}data/distributions/tama-ekijo.geojson`,
    waterMap: `${RESOURCE_URL}data/distributions/maps/tama-liquid_wind.png`,
    bounds: [138.98125, 34.35, 139.921875, 35.84166666666666],
    scene: [MainScenes.Scene5],
    subScene: [SubScenes.Tama],
  },
];
