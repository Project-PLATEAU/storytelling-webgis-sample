import { Meta, StoryObj } from "@storybook/react";
import seedrandom from "seedrandom";

import { Layer, Map } from "..";
import { computeCenterOfBoundsFromMeshCode } from "../../helpers";

const meta: Meta<typeof Map> = {
  component: Map,
};

export default meta;

type Story = StoryObj<typeof Map>;

const DEFAULT_TERRAIN: Omit<Extract<Layer, { type: "terrain" }>, "id" | "type"> = {
  valueProperty: "揺全壊",
  meshCodeProperty: "MESHCODE",
  getValue: v => v * 1e7,
  opacity: 0.5,
  getTerrainColor: (_value, _scale, ratio) => {
    if (ratio >= 0.4) {
      return [254, 238, 112, 255];
    }
    if (ratio >= 0.1) {
      return [249, 121, 208, 255];
    }
    if (ratio >= 0.05) {
      return [201, 46, 255, 255];
    }
    if (ratio > 0.01) {
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
  filterData: data => {
    return {
      ...data,
      features: data.features.filter(f => Number(f.properties["揺全壊"]) >= 60),
    };
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
  filterData: data => {
    return {
      ...data,
      features: data.features.filter(
        f => Number(f.properties["揺全壊"]) < 25 && Number(f.properties["揺全壊"]) >= 15,
      ),
    };
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
  filterData: data => {
    return {
      ...data,
      features: data.features.filter(
        f =>
          Number(f.properties["揺全壊"]) < 15 &&
          Number(f.properties["揺全壊"]) >= 10 &&
          Math.floor(Math.random() * 100) >= 70,
      ),
    };
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
  filterData: data => {
    return {
      ...data,
      features: data.features.filter(
        f => Number(f.properties["揺全壊"]) < 0.05 && Number(f.properties["揺全壊"]) >= 0.03,
      ),
    };
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

export const Default: Story = {
  args: {
    initialViewState: {
      longitude: 139.588877,
      latitude: 35.6811101,
      bearing: 360 * 0.95,
      pitch: 360 * 0.35,
      zoom: 10.5,
    },
    layers: [
      {
        ...DEFAULT_TERRAIN,
        id: "toshin-destroyed",
        type: "terrain",
        // url: "data/distributions/toshin-destroyed.geojson",
        terrainMap: "data/distributions/maps/toshin-destroyed_terrain.png",
        maskMap: "data/distributions/maps/toshin-destroyed_mask.png",
        bounds: [137.440625, 33.99999999999999, 141.41875000000002, 37.39999999999999],
      },
      {
        ...DEFAULT_PARTICLE_2,
        id: "toshin-destroyed-particle2",
        type: "particle",
        url: "data/distributions/toshin-destroyed.geojson",
      },
      {
        ...DEFAULT_PARTICLE_1,
        id: "toshin-destroyed-particle1",
        type: "particle",
        url: "data/distributions/toshin-destroyed.geojson",
      },
      {
        ...DEFAULT_PARTICLE_3,
        id: "toshin-destroyed-particle3",
        type: "particle",
        url: "data/distributions/toshin-destroyed.geojson",
      },
      {
        ...DEFAULT_PARTICLE_4,
        id: "toshin-destroyed-particle4",
        type: "particle",
        url: "data/distributions/toshin-destroyed.geojson",
      },
    ],
  },
};

export const Tama: Story = {
  args: {
    initialViewState: {
      longitude: 139.588877,
      latitude: 35.6811101,
      bearing: 360 * 0.95,
      pitch: 360 * 0.35,
      zoom: 10.5,
    },
    layers: [
      {
        ...DEFAULT_TERRAIN,
        id: "tama-destroyed",
        type: "terrain",
        // url: "data/distributions/tama-destroyed.geojson",
        terrainMap: "data/distributions/maps/tama-destroyed_terrain.png",
        maskMap: "data/distributions/maps/tama-destroyed_mask.png",
        bounds: [137.440625, 33.99999999999999, 141.41875000000002, 37.39999999999999],
      },
      {
        ...DEFAULT_PARTICLE_2,
        id: "tama-destroyed-particle2",
        type: "particle",
        url: "data/distributions/tama-destroyed.geojson",
        filterData: data => {
          return {
            ...data,
            features: data.features.filter(
              f =>
                Number(f.properties["揺全壊"]) < 4 &&
                Number(f.properties["揺全壊"]) >= 1 &&
                Math.floor(Math.random() * 100) >= 70,
            ),
          };
        },
      },
      {
        ...DEFAULT_PARTICLE_1,
        id: "tama-destroyed-particle1",
        type: "particle",
        url: "data/distributions/tama-destroyed.geojson",
        filterData: data => {
          return {
            ...data,
            features: data.features.filter(f => Number(f.properties["揺全壊"]) >= 4),
          };
        },
      },
      {
        ...DEFAULT_PARTICLE_3,
        id: "tama-destroyed-particle3",
        type: "particle",
        url: "data/distributions/tama-destroyed.geojson",
        filterData: data => {
          return {
            ...data,
            features: data.features.filter(
              f =>
                Number(f.properties["揺全壊"]) < 1 &&
                Number(f.properties["揺全壊"]) >= 0.5 &&
                Math.floor(Math.random() * 100) >= 90,
            ),
          };
        },
      },
      {
        ...DEFAULT_PARTICLE_4,
        id: "tama-destroyed-particle4",
        type: "particle",
        url: "data/distributions/tama-destroyed.geojson",
        filterData: data => {
          return {
            ...data,
            features: data.features.filter(
              f =>
                Number(f.properties["揺全壊"]) < 0.5 &&
                Number(f.properties["揺全壊"]) >= 0.01 &&
                Math.floor(Math.random() * 100) >= 95,
            ),
          };
        },
      },
    ],
  },
};
