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
        id: "urbanplan-fireproof-mvt",
        type: "mvt",
        url: "data/urbanplan-fireproof-mvt/{z}/{x}/{y}.pbf",
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
      },
    ],
  },
};

export const Label: Story = {
  args: {
    initialViewState: {
      longitude: 139.788877,
      latitude: 35.6943181,
      bearing: 360 * 0.2,
      pitch: 360 * 0.2,
      zoom: 11,
    },
    layers: [
      {
        id: "label-mvt",
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
      },
    ],
  },
};

export const Building: Story = {
  args: {
    initialViewState: {
      bearing: -32.58251286455476,
      latitude: 35.65882019024542,
      longitude: 139.7438420394692,
      pitch: 73.73208989259854,
      zoom: 16.16825896291775,

      maxPitch: 85,
    },
    layers: [
      {
        id: "building-mvt",
        type: "mvt",
        url: "data/tokyo23-mvt/{z}/{x}/{y}.pbf",
        getElevation: ({ properties }) => properties.z ?? 0,
        getFillColor: () => [255, 255, 255, 255],
        minZoom: 10,
        maxZoom: 16,
        extruded: true,
      },
    ],
  },
};
