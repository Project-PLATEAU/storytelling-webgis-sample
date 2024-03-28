import { FlyToInterpolator } from "@deck.gl/core/typed";
import { useCallback } from "react";

import { MAX_PITCH, RESOURCE_URL } from "../../../constants";
import { computeCenterOfBoundsFromMeshCode } from "../../../helpers";
import { Layer } from "../../../map";
import { OverlayContentProps } from "../../../map/layers";
import { MainScenes, SubScenes } from "../../../utils";
import { MAIN_SCENE_DURATION } from "../../constants";
import TamaBurnedAreaJSON from "../../data/tama-burned-area3-zero.json";
import ToshinBurnedAreaJSON from "../../data/toshin-burned-area3-zero.json";
import {
  BurnedBuildingOverlay,
  SCENE_DESCRIPTION_TIMEOUT,
  SceneDescriptionOverlay,
} from "../../overlays";
import { LayerData } from "../../types";

import { BASE_LABEL_MVT, TOKYO23_MVT } from "./tokyo23";

const DEFAULT_GRID_FOR_NON_ZERO: Omit<Extract<Layer, { type: "grid" }>, "id" | "type" | "url"> = {
  opacity: 0.7,
  getColorWeight: data => {
    const value = data.properties["value"];
    if (100 < value) return 100;
    if (50 < value) return 80;
    if (20 < value) return 60;
    if (10 < value) return 40;
    if (1 < value) return 20;
    return 0;
  },
  getPosition: data => {
    return computeCenterOfBoundsFromMeshCode(String(data.properties.MESHCODE));
  },
  getElevationWeight: data => {
    return data.properties["value"];
  },
  colorRange: [
    [160, 179, 206, 255],
    [116, 252, 253, 255],
    [117, 250, 76, 255],
    [255, 254, 85, 255],
    [222, 130, 68, 255],
    [235, 51, 35, 255],
  ],
  scale: 9,
  brightness: 0.24,
  animation: {
    startDuration: 300,
    endDuration: 100,
  },
};
const DEFAULT_GRID_FOR_ZERO: Omit<Extract<Layer, { type: "grid" }>, "id" | "type" | "url"> = {
  opacity: 0.7,
  getColorWeight: data => {
    const value = data.properties["value"];
    if (0 < value) return 100;
    return value;
  },
  getPosition: data => {
    return computeCenterOfBoundsFromMeshCode(String(data.properties.MESHCODE));
  },
  getElevation: () => {
    return 1;
  },
  getElevationWeight: () => {
    return 1;
  },
  colorRange: [
    [160, 179, 206, 255],
    [144, 138, 212, 255],
  ],
  scale: 1,
  brightness: 0.25,
  animation: {
    startDuration: 300,
    endDuration: 100,
  },
  shouldInfiniteScale: false,
};

const URBANPLAN_FIREPROOF_MVT: Omit<Extract<LayerData, { type: "mvt" }>, "scene"> = {
  id: "urbanplan-fireproof-mvt",
  type: "mvt",
  url: `${RESOURCE_URL}data/urbanplan-fireproof-mvt/{z}/{x}/{y}.pbf`,
  getFillColor: ({ properties }) => {
    const level = properties["TUP6F1"];
    if (level === 10) {
      return [4, 41, 64, 255];
    }
    if (level === 20) {
      return [0, 92, 83, 255];
    }

    return [0, 0, 0, 0];
  },
  minZoom: 10,
  maxZoom: 16,
};

const WrappedBurnedBuildingOverlay = (
  props: OverlayContentProps & { data: any; isToshin: boolean },
) => {
  const getColor = useCallback((value: number) => {
    if (100 < value) return "rgb(235, 51, 35)";
    if (50 < value) return "rgb(222, 130, 68)";
    if (20 < value) return "rgb(255, 254, 85)";
    if (10 < value) return "rgb(117, 250, 76)";
    if (1 < value) return "rgb(116, 252, 253)";
    if (0 < value) return "rgb(144, 138, 212)";
    return "rgb(160, 179, 206)";
  }, []);
  return <BurnedBuildingOverlay {...props} getColor={getColor} />;
};

const GET_DEFAULT_OVERLAY: (
  data: any,
  isToshin?: boolean,
) => Omit<Extract<Layer, { type: "overlay" }>, "id" | "type"> = (data, isToshin = false) => ({
  renderContent: props => (
    <WrappedBurnedBuildingOverlay {...props} data={data} isToshin={isToshin} />
  ),
  delay: 2000,
});

export const BURNED_LAYERS: LayerData[] = [
  {
    id: "scene4-scene-description-overlay",
    type: "overlay",
    scene: [MainScenes.Scene4],
    renderContent: props => <SceneDescriptionOverlay {...props} sceneName={MainScenes.Scene4} />,
    contentIndex: 0,
    contentDuration: SCENE_DESCRIPTION_TIMEOUT,
  },
  {
    ...TOKYO23_MVT,
    type: "mvt",
    getFillColor: ({ properties }) => {
      const { fireproofStructureType } = properties;

      // 耐火
      if (fireproofStructureType === 1001) {
        return [31, 76, 166, 255];
      }
      // 準耐火造
      if (fireproofStructureType === 1002) {
        return [113, 166, 201, 255];
      }
      // その他
      if (fireproofStructureType === 1003) {
        return [62, 110, 140, 255];
      }
      // 不明
      if (fireproofStructureType === 1004) {
        return [242, 185, 172, 255];
      }

      return [202, 202, 202, 255];
    },
    scene: [MainScenes.Scene4],
  },
  {
    ...BASE_LABEL_MVT,
    scene: [MainScenes.Scene4],
  },
  {
    id: "scene4-camera-1",
    type: "camera",
    viewState: {
      longitude: 139.695,
      latitude: 35.665,
      bearing: 360 * 0.1,
      pitch: 360 * 0.19,
      zoom: 10,
      maxPitch: MAX_PITCH,
      transitionDuration: 1000,
      transitionInterpolator: new FlyToInterpolator({ curve: 2 }),
    },
    enableInfiniteRotation: true,
    scene: [MainScenes.Scene4],
    contentIndex: 0,
  },
  {
    id: "scene4-camera-2",
    type: "camera",
    viewState: {
      longitude: 139.695,
      latitude: 35.665,
      bearing: 360 * 0.25,
      pitch: 360 * 0.19,
      zoom: 12,
      transitionDuration: 500,
      transitionInterpolator: new FlyToInterpolator({ curve: 2 }),
    },
    enableInfiniteRotation: true,
    scene: [MainScenes.Scene4],
    contentIndex: 1,
    contentDuration: 10000,
    isMain: true,
  },
  {
    ...URBANPLAN_FIREPROOF_MVT,
    scene: [MainScenes.Scene4],
  },
  {
    id: "scene4-camera-3",
    type: "camera",
    viewState: {
      longitude: 139.758877,
      latitude: 35.6843181,
      bearing: 360 * 0.1,
      pitch: 360 * 0.19,
      zoom: 12,
      transitionDuration: 500,
      transitionInterpolator: new FlyToInterpolator({ curve: 2 }),
    },
    enableInfiniteRotation: true,
    scene: [MainScenes.Scene4],
    contentIndex: 2,
    isMain: true,
    contentDuration: MAIN_SCENE_DURATION,
  },
  {
    ...DEFAULT_GRID_FOR_NON_ZERO,
    id: "toshin-burned-non-zero",
    type: "grid",
    url: `${RESOURCE_URL}data/distributions/split_nonzero_toshin-burned.geojson`,
    scene: [MainScenes.Scene4],
    subScene: [SubScenes.Toshin],
    contentIndexToDisableAnimation: 3,
    contentIndex: 2,
  },
  {
    ...DEFAULT_GRID_FOR_ZERO,
    id: "toshin-burned-zero",
    type: "grid",
    url: `${RESOURCE_URL}data/distributions/split_zero_toshin-burned.geojson`,
    scene: [MainScenes.Scene4],
    subScene: [SubScenes.Toshin],
    contentIndexToDisableAnimation: 3,
    contentIndex: 2,
  },
  {
    ...DEFAULT_GRID_FOR_NON_ZERO,
    id: "tama-burned-non-zero",
    type: "grid",
    url: `${RESOURCE_URL}data/distributions/split_nonzero_tama-burned.geojson`,
    scene: [MainScenes.Scene4],
    subScene: [SubScenes.Tama],
    contentIndexToDisableAnimation: 3,
    contentIndex: 2,
  },
  {
    ...DEFAULT_GRID_FOR_ZERO,
    id: "tama-burned-zero",
    type: "grid",
    url: `${RESOURCE_URL}data/distributions/split_zero_tama-burned.geojson`,
    scene: [MainScenes.Scene4],
    subScene: [SubScenes.Tama],
    contentIndexToDisableAnimation: 3,
    contentIndex: 2,
  },
  {
    id: "scene4-camera-end-before",
    type: "camera",
    viewState: {
      longitude: 139.695,
      latitude: 35.665,
      bearing: 360 * 0.03,
      zoom: 9,
      transitionDuration: 500,
      transitionInterpolator: new FlyToInterpolator({ curve: 1 }),
    },
    scene: [MainScenes.Scene4],
    contentIndex: 3,
    contentDuration: 10000,
    isMain: true,
  },
  {
    id: "scene4-camera-end",
    type: "camera",
    viewState: {
      longitude: 139.695,
      latitude: 35.665,
      bearing: 0,
      pitch: 0,
      zoom: 9,
      transitionDuration: 500,
      transitionInterpolator: new FlyToInterpolator({ curve: 1 }),
    },
    scene: [MainScenes.Scene4],
    contentIndex: 3,
  },
  {
    ...GET_DEFAULT_OVERLAY(ToshinBurnedAreaJSON.list, true),
    id: "toshin-overlay",
    type: "overlay",
    scene: [MainScenes.Scene4],
    subScene: [SubScenes.Toshin],
    contentIndex: 3,
  },
  {
    ...GET_DEFAULT_OVERLAY(TamaBurnedAreaJSON.list),
    id: "tama-overlay",
    type: "overlay",
    scene: [MainScenes.Scene4],
    subScene: [SubScenes.Tama],
    contentIndex: 3,
  },
];
