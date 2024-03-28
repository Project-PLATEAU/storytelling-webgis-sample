import { FlyToInterpolator } from "@deck.gl/core/typed";

import { MainScenes } from "../../../utils";
import { LayerData } from "../../types";

import { TOKYO23_MVT } from "./tokyo23";

export const EPILOGUE_LAYERS: LayerData[] = [
  {
    id: "scene6-camera",
    type: "camera",
    viewState: {
      bearing: -31.982512864554757,
      latitude: 35.658752635910965,
      longitude: 139.7438975323571,
      pitch: 73.73208989259854,
      zoom: 16.16825896291775,

      maxPitch: 85,
      transitionDuration: 700,
      transitionInterpolator: new FlyToInterpolator({ curve: 2 }),
    },
    scene: [MainScenes.Scene6],
  },
  {
    ...TOKYO23_MVT,
    scene: [MainScenes.Scene6],
  },
];
