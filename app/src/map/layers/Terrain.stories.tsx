import { Meta, StoryObj } from "@storybook/react";

import { Map } from "..";

const meta: Meta<typeof Map> = {
  component: Map,
};

export default meta;

type Story = StoryObj<typeof Map>;

export const Default: Story = {
  args: {
    layers: [
      {
        id: "terrain",
        type: "terrain",
        // url: "data/distributions/tama-shindo.geojson",
        terrainMap: "data/distributions/maps/toshin-shindo_terrain.png",
        maskMap: "data/distributions/maps/toshin-shindo_mask.png",
        bounds: [137.428125, 33.997916666666654, 141.41875000000002, 37.39791666666666],
        getValue: value => {
          const scaleValue = 1e20;
          return value > 6
            ? Math.round(value * scaleValue) + scaleValue
            : Math.round(value * scaleValue);
        },
        getCode: code => code.slice(0, -2),
        valueProperty: "IJMAs",
        meshCodeProperty: "MeshCode",
        opacity: 0.5,
        getTerrainColor: value => {
          const scaleValue = 1e20;

          if (value >= 7 * scaleValue) {
            return [255, 86, 49, 255];
          }
          if (value >= 6 * scaleValue) {
            return [255, 160, 104, 255];
          }
          if (value >= 5 * scaleValue) {
            return [255, 215, 46, 255];
          }
          if (value >= 4 * scaleValue) {
            return [138, 255, 46, 255];
          }
          if (value >= 3 * scaleValue) {
            return [46, 215, 217, 255];
          }
          if (value >= 2 * scaleValue) {
            return [46, 167, 255, 255];
          }
          if (value >= 1 * scaleValue) {
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
      },
    ],
  },
};
