import { Meta, StoryObj } from "@storybook/react";

import { Map } from ".";

const meta: Meta<typeof Map> = {
  component: Map,
};

export default meta;

type Story = StoryObj<typeof Map>;

export const Default: Story = {
  args: {
    layers: [
      {
        id: "marker",
        type: "marker",
        data: {
          type: "FeatureCollection",
          features: [
            {
              id: "1",
              type: "Feature",
              properties: {},
              geometry: {
                coordinates: [139.7946595372241, 35.70050511377363],
                type: "Point",
              },
            },
            {
              id: "2",
              type: "Feature",
              properties: {},
              geometry: {
                coordinates: [139.79698837711567, 35.70203967315213],
                type: "Point",
              },
            },
            {
              id: "3",
              type: "Feature",
              properties: {},
              geometry: {
                coordinates: [139.79911760215828, 35.7000566278154],
                type: "Point",
              },
            },
          ],
        },
      },
    ],
  },
};

export const Opening: Story = {
  args: {
    layers: [],
    isOpening: true,
  },
};
