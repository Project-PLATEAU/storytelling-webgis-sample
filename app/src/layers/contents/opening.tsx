import { FlyToInterpolator } from "@deck.gl/core/typed";

import { OpeningScenes } from "../../utils";
import { LayerData } from "../types";

export const OPENING_LAYERS: LayerData[] = [
  // Opening
  // Scene1
  {
    id: "opening-scene1-camera",
    type: "camera",
    enableInfiniteRotation: true,
    scene: [OpeningScenes.Scene1],
  },

  // Scene2
  {
    id: "opening-scene2-camera",
    type: "camera",
    viewState: {
      longitude: 139.758877,
      latitude: 35.6843181,
      bearing: 360 * 0.15,
      pitch: 360 * 0.35,
      zoom: 13,
      transitionDuration: 1500,
      transitionInterpolator: new FlyToInterpolator({ curve: 1 }),
    },
    scene: [OpeningScenes.Scene2],
  },
  {
    id: "延焼火災出火地点",
    type: "animationGradientPoint",
    url: "data/points/point-of-burned.geojson",
    getRadiusProperty: (props: { properties: any }) => props.properties.buffer_2_1,
    scene: [OpeningScenes.Scene2],
  },
];
