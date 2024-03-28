import { FlyToInterpolator } from "@deck.gl/core/typed";
import seedrandom from "seedrandom";

import { MAX_PITCH } from "../../../constants";
import { computeCenterOfBoundsFromMeshCode } from "../../../helpers";
import { Layer } from "../../../map";
import { MainScenes, SubScenes } from "../../../utils";
import { MAIN_SCENE_DURATION } from "../../constants";
import TamaParticle1 from "../../data/particles/tama-destroyed_particles_1.json";
import TamaParticle2 from "../../data/particles/tama-destroyed_particles_2.json";
import TamaParticle3 from "../../data/particles/tama-destroyed_particles_3.json";
import TamaParticle4 from "../../data/particles/tama-destroyed_particles_4.json";
import ToshinParticle1 from "../../data/particles/toshin-destroyed_particles_1.json";
import ToshinParticle2 from "../../data/particles/toshin-destroyed_particles_2.json";
import ToshinParticle3 from "../../data/particles/toshin-destroyed_particles_3.json";
import ToshinParticle4 from "../../data/particles/toshin-destroyed_particles_4.json";
import { SCENE_DESCRIPTION_TIMEOUT, SceneDescriptionOverlay } from "../../overlays";
import { LayerData } from "../../types";

import { TAMA_SHINDO_MASK_MAP } from "./textures/tama-shindo-mask-map";
import { TAMA_SHINDO_TERRAIN_MAP } from "./textures/tama-shindo-terrain-map";
import { TOSHIN_SHINDO_MASK_MAP } from "./textures/toshin-shindo-mask-map";
import { TOSHIN_SHINDO_TERRAIN_MAP } from "./textures/toshin-shindo-terrain-map";
import { BASE_LABEL_MVT, TOKYO23_MVT } from "./tokyo23";

const DEFAULT_TERRAIN: Omit<Extract<Layer, { type: "terrain" }>, "id" | "type"> = {
  valueProperty: "揺全壊",
  meshCodeProperty: "MESHCODE",
  getValue: v => v * 1e7,
  opacity: 0.5,
  getTerrainColor: value => {
    const scaleValue = 1e7;
    const nextValue = value;
    if (nextValue >= 60 * scaleValue) {
      return [254, 238, 112, 255];
    }
    if (nextValue >= 30 * scaleValue) {
      return [249, 121, 208, 255];
    }
    if (nextValue >= 10 * scaleValue) {
      return [201, 46, 255, 255];
    }
    if (nextValue > 0 * scaleValue) {
      return [46, 167, 255, 255];
    }
    return [202, 202, 202, 255];
  },
  shouldSpreadPixel: true,
  backgroundColor: [255, 255, 255, 0],
  scaleTerrain: 20,
  brightness: 0.3,
  animation: {
    startDuration: 300,
    endDuration: 200,
  },
};

const DEFAULT_PARTICLE_1: Omit<Extract<Layer, { type: "particle" }>, "id" | "type" | "url"> = {
  getColor: _data => {
    return [254, 238, 112, 255];
  },
  getPosition: data => {
    const rng = seedrandom(data.properties["揺全壊"]);
    const [lng, lat] = computeCenterOfBoundsFromMeshCode(String(data.properties["MESHCODE"]));
    return [lng, lat, rng.quick() * 10000];
  },
  colorThreashold: 10000,
  pointSize: 1000,
  brightness: 0.3,
  translation: 10000,
  animation: {
    startDuration: 150,
    endDuration: 100,
  },
};
const DEFAULT_PARTICLE_2: Omit<Extract<Layer, { type: "particle" }>, "id" | "type" | "url"> = {
  getColor: _data => {
    return [249, 121, 208, 255];
  },
  getPosition: data => {
    const rng = seedrandom(data.properties["揺全壊"]);
    const [lng, lat] = computeCenterOfBoundsFromMeshCode(String(data.properties["MESHCODE"]));
    return [lng, lat, rng.quick() * 10000];
  },
  colorThreashold: 10000,
  pointSize: 500,
  brightness: 0.3,
  translation: 10000,
  animation: {
    startDuration: 150,
    endDuration: 100,
  },
};
const DEFAULT_PARTICLE_3: Omit<Extract<Layer, { type: "particle" }>, "id" | "type" | "url"> = {
  getColor: _data => {
    return [201, 46, 255, 255];
  },
  getPosition: data => {
    const rng = seedrandom(data.properties["揺全壊"]);
    const [lng, lat] = computeCenterOfBoundsFromMeshCode(String(data.properties["MESHCODE"]));
    return [lng, lat, rng.quick() * 10000];
  },
  colorThreashold: 10000,
  pointSize: 300,
  brightness: 0.3,
  translation: 10000,
  animation: {
    startDuration: 150,
    endDuration: 100,
  },
};
const DEFAULT_PARTICLE_4: Omit<Extract<Layer, { type: "particle" }>, "id" | "type" | "url"> = {
  getColor: _data => {
    return [46, 167, 255, 255];
  },
  getPosition: data => {
    const rng = seedrandom(String(data.properties["揺全壊"]));
    const [lng, lat] = computeCenterOfBoundsFromMeshCode(String(data.properties["MESHCODE"]));
    return [lng, lat, rng.quick() * 10000];
  },
  colorThreashold: 10000,
  pointSize: 200,
  brightness: 0.3,
  translation: 10000,
  animation: {
    startDuration: 150,
    endDuration: 100,
  },
};

export const DESTROYED_LAYERS: LayerData[] = [
  {
    id: "scene3-scene-description-overlay",
    type: "overlay",
    scene: [MainScenes.Scene3],
    renderContent: props => <SceneDescriptionOverlay {...props} sceneName={MainScenes.Scene3} />,
    contentIndex: 0,
    contentDuration: SCENE_DESCRIPTION_TIMEOUT + 4000,
  },
  {
    id: "scene3-camera",
    type: "camera",
    viewState: {
      longitude: 139.6,
      latitude: 35.705,
      bearing: 360 * 0.93,
      pitch: 360 * 0.4,
      maxPitch: MAX_PITCH,
      zoom: 10.4,
      transitionDuration: 1000,
      transitionInterpolator: new FlyToInterpolator({ curve: 2.5 }),
    },
    enableInfiniteRotation: true,
    scene: [MainScenes.Scene3],
    contentIndex: 0,
    contentDuration: MAIN_SCENE_DURATION,
  },
  {
    id: "scene3-camera-2",
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
    scene: [MainScenes.Scene3],
    contentIndex: 1,
    isMain: true,
    contentDuration: MAIN_SCENE_DURATION,
  },
  {
    ...TOKYO23_MVT,
    type: "mvt",
    scene: [MainScenes.Scene3],
  },
  {
    ...BASE_LABEL_MVT,
    scene: [MainScenes.Scene3],
  },
  {
    ...DEFAULT_TERRAIN,
    id: "toshin-destroyed",
    type: "terrain",
    // url: "data/distributions/toshin-destroyed.geojson",
    terrainMap: TOSHIN_SHINDO_TERRAIN_MAP,
    maskMap: TOSHIN_SHINDO_MASK_MAP,
    bounds: [137.440625, 33.99999999999999, 141.41875000000002, 37.39999999999999],
    scene: [MainScenes.Scene3],
    subScene: [SubScenes.Toshin],
  },
  {
    ...DEFAULT_TERRAIN,
    id: "tama-destroyed",
    type: "terrain",
    // url: "data/distributions/tama-destroyed.geojson",
    terrainMap: TAMA_SHINDO_TERRAIN_MAP,
    maskMap: TAMA_SHINDO_MASK_MAP,
    bounds: [137.440625, 33.99999999999999, 141.41875000000002, 37.39999999999999],
    scene: [MainScenes.Scene3],
    subScene: [SubScenes.Tama],
  },

  // Particle for Toshin
  {
    ...DEFAULT_PARTICLE_2,
    id: "toshin-destroyed-particle2",
    type: "particle",
    data: ToshinParticle2 as any,
    scene: [MainScenes.Scene3],
    subScene: [SubScenes.Toshin],
  },
  {
    ...DEFAULT_PARTICLE_1,
    id: "toshin-destroyed-particle1",
    type: "particle",
    data: ToshinParticle1 as any,
    scene: [MainScenes.Scene3],
    subScene: [SubScenes.Toshin],
  },
  {
    ...DEFAULT_PARTICLE_3,
    id: "toshin-destroyed-particle3",
    type: "particle",
    data: ToshinParticle3 as any,
    scene: [MainScenes.Scene3],
    subScene: [SubScenes.Toshin],
  },
  {
    ...DEFAULT_PARTICLE_4,
    id: "toshin-destroyed-particle4",
    type: "particle",
    data: ToshinParticle4 as any,
    scene: [MainScenes.Scene3],
    subScene: [SubScenes.Toshin],
  },

  // Particle for Tama
  {
    ...DEFAULT_PARTICLE_2,
    id: "tama-destroyed-particle2",
    type: "particle",
    data: TamaParticle2 as any,
    scene: [MainScenes.Scene3],
    subScene: [SubScenes.Tama],
  },
  {
    ...DEFAULT_PARTICLE_1,
    id: "tama-destroyed-particle1",
    type: "particle",
    data: TamaParticle1 as any,
    scene: [MainScenes.Scene3],
    subScene: [SubScenes.Tama],
  },
  {
    ...DEFAULT_PARTICLE_3,
    id: "tama-destroyed-particle3",
    type: "particle",
    data: TamaParticle3 as any,
    scene: [MainScenes.Scene3],
    subScene: [SubScenes.Tama],
  },
  {
    ...DEFAULT_PARTICLE_4,
    id: "tama-destroyed-particle4",
    type: "particle",
    data: TamaParticle4 as any,
    scene: [MainScenes.Scene3],
    subScene: [SubScenes.Tama],
  },
];
