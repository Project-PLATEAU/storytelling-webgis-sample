import { Meta, StoryObj } from "@storybook/react";

import { Map } from "../";

const meta: Meta<typeof Map> = {
  component: Map,
};

export default meta;

type Story = StoryObj<typeof Map>;

export const Default: Story = {
  args: {
    layers: [
      {
        id: "liquid",
        type: "liquid",
        valueProperty: "PLcorrecte",
        meshCodeProperty: "MeshCode",
        getValue: v => v * 1e7,
        opacity: 1,
        url: "data/distributions/toshin-ekijo.geojson",
        getTerrainColor: (_value, _scale, ratio) => {
          if (ratio >= 0.4) {
            return [180, 85, 66, 255];
          }
          if (ratio >= 0.1) {
            return [180, 114, 66, 255];
          }
          if (ratio >= 0.05) {
            return [180, 143, 66, 255];
          }
          if (ratio > 0.01) {
            return [180, 172, 66, 255];
          }
          return [202, 202, 202, 0];
        },
        shouldSpreadPixel: true,
        backgroundColor: [255, 255, 255, 0],
        scaleTerrain: 3,
        brightness: 0.3,
        animation: {
          startDuration: 300,
          endDuration: 200,
        },
      },
    ],
  },
};
