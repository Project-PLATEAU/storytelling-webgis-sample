import { Meta, StoryObj } from "@storybook/react";

import { Legend } from ".";

const meta: Meta<typeof Legend> = {
  component: Legend,
};

export default meta;

type Story = StoryObj<typeof Legend>;

export const Default: Story = {
  args: {
    items: [
      {
        label: "7",
        color: "#DA3F3F",
      },
      {
        label: "6",
        color: "#EB9436",
      },
      {
        label: "5",
        color: "#EBF000",
      },
      {
        label: "4",
        color: "#9CF259",
      },
      {
        label: "3",
        color: "#6EE0C4",
      },
    ],
  },
};

export const HasArrow: Story = {
  args: {
    items: [
      {
        label: "7",
        color: "#DA3F3F",
      },
      {
        label: "6",
        color: "#EB9436",
      },
      {
        label: "5",
        color: "#EBF000",
      },
      {
        label: "4",
        color: "#9CF259",
      },
      {
        label: "3",
        color: "#6EE0C4",
      },
    ],
    showRange: true,
  },
};

export const Reverse: Story = {
  args: {
    items: [
      {
        label: "7",
        color: "#DA3F3F",
      },
      {
        label: "6",
        color: "#EB9436",
      },
      {
        label: "5",
        color: "#EBF000",
      },
      {
        label: "4",
        color: "#9CF259",
      },
      {
        label: "3",
        color: "#6EE0C4",
      },
    ],
    reverse: true,
  },
};
