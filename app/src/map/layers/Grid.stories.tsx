import { Meta, StoryObj } from "@storybook/react";

import { Map } from "..";
import { computeCenterOfBoundsFromMeshCode } from "../../helpers";

const meta: Meta<typeof Map> = {
  component: Map,
};

export default meta;

type Story = StoryObj<typeof Map>;

export const Default: Story = {
  args: {
    layers: [
      {
        id: "grid",
        type: "grid",
        url: "data/distributions/toshin-burned.geojson",
        opacity: 0.5,
        cellSize: 300,
        getColorWeight: data => {
          const value = data.properties["焼失8M18時：焼失棟数（風速8ｍ、冬・夕）\n"];
          if (150 <= value) return 100;
          if (80 <= value) return 60;
          if (20 <= value) return 40;
          if (0 < value) return 20;
          return value;
        },
        getPosition: data => {
          return computeCenterOfBoundsFromMeshCode(String(data.properties.MESHCODE));
        },
        getElevationWeight: data => {
          return data.properties["焼失8M18時：焼失棟数（風速8ｍ、冬・夕）\n"];
        },
        colorRange: [
          [202, 202, 202, 255],
          [138, 255, 46, 255],
          [255, 215, 46, 255],
          [255, 160, 104, 255],
          [255, 86, 49, 255],
        ],
        scale: 8,
        brightness: 0.3,
        animation: {
          startDuration: 300,
          endDuration: 100,
        },
      },
    ],
  },
};
