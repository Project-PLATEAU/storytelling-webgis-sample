import { FlyToInterpolator } from "@deck.gl/core/typed";

import { MAX_PITCH, RESOURCE_URL } from "../../../constants";
import { MainScenes } from "../../../utils";
import { MAIN_SCENE_DURATION } from "../../constants";
import { SCENE_DESCRIPTION_TIMEOUT, TutorialSwitcher } from "../../overlays";
import { LayerData } from "../../types";

export const TOKYO23_MVT: Omit<Extract<LayerData, { type: "mvt" }>, "scene"> = {
  id: "tokyo23-mvt",
  type: "mvt",
  url: `${RESOURCE_URL}data/tokyo23-mvt/{z}/{x}/{y}.pbf`,
  getElevation: ({ properties }) => properties.z ?? 0,
  getFillColor: ({ properties }) => {
    const { buildingStructureType } = properties;

    if (buildingStructureType === 11) {
      return [160, 192, 222, 255];
    }
    if (buildingStructureType === 12) {
      return [166, 222, 214, 255];
    }
    if (buildingStructureType === 21) {
      return [189, 182, 222, 255];
    }
    if (buildingStructureType === 22) {
      return [222, 171, 153, 255];
    }

    return [202, 202, 202, 255];
  },
  minZoom: 10,
  maxZoom: 16,
  extruded: true,
};

export const BASE_LABEL_MVT: Omit<Extract<LayerData, { type: "mvt" }>, "scene"> = {
  id: "base-label-mvt",
  type: "mvt",
  url: "https://cyberjapandata.gsi.go.jp/xyz/optimal_bvmap-v1/{z}/{x}/{y}.pbf",
  getFillColor: () => [0, 0, 0, 0],
  getText: ({ properties }) => {
    const code = properties.vt_code;
    // 市区町村 or 都道府県
    if (![110, 140].includes(code)) return;
    if (
      typeof properties.vt_code === "number" &&
      `${properties.vt_code}`.length === 3 &&
      typeof properties.vt_text === "string" &&
      (properties.vt_arrng == null || typeof properties.vt_arrng === "number") &&
      (properties.vt_arrngagl == null || typeof properties.vt_arrngagl === "number")
    ) {
      return properties.vt_text;
    }
  },
  getTextColor: () => [70, 60, 100, 255],
  getTextSize: 16,
  textOutlineColor: [230, 230, 250],
  textOutlineWidth: 6,
  textFontWeight: 600,
  getTextAlignmentBaseline: "bottom",
  minZoom: 4,
  maxZoom: 17,
};

export const SHELTER_MARKER: Omit<Extract<LayerData, { type: "marker" }>, "scene"> = {
  id: "避難所",
  type: "marker",
  url: `${RESOURCE_URL}data/points/ShelterPoint.geojson`,
};

export const TOKYO23_LAYERS: LayerData[] = [
  {
    id: "scene1-scene-description-overlay",
    type: "overlay",
    scene: [MainScenes.Scene1],
    renderContent: props => <TutorialSwitcher {...props} />,
    contentIndex: 0,
    contentDuration: SCENE_DESCRIPTION_TIMEOUT,
  },
  {
    id: "scene1-camera-1",
    type: "camera",
    viewState: {
      longitude: 139.788877,
      latitude: 35.6943181,
      bearing: 360 * 0.2,
      pitch: 360 * 0.2,
      zoom: 12,
      maxPitch: MAX_PITCH,
      transitionDuration: 700,
      transitionInterpolator: new FlyToInterpolator({ curve: 1 }),
    },
    enableInfiniteRotation: true,
    scene: [MainScenes.Scene1],
    contentIndex: 0,
  },
  {
    id: "scene1-camera-2",
    type: "camera",
    viewState: {
      longitude: 139.790877,
      latitude: 35.6975181,
      bearing: 360 * 1.0,
      pitch: 360 * 0.15,
      zoom: 15.5,
      transitionDuration: 700,
      transitionInterpolator: new FlyToInterpolator({ curve: 1 }),
    },
    enableInfiniteRotation: true,
    scene: [MainScenes.Scene1],
    contentIndex: 1,
    isMain: true,
    contentDuration: MAIN_SCENE_DURATION,
  },
  {
    ...TOKYO23_MVT,
    scene: [MainScenes.Scene1],
  },
  {
    ...BASE_LABEL_MVT,
    scene: [MainScenes.Scene1],
  },
  {
    ...SHELTER_MARKER,
    scene: [MainScenes.Scene1],
    pickable: true,
  },
];
