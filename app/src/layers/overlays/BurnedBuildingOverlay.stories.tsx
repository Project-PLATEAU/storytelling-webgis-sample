import { Meta, StoryObj } from "@storybook/react";

import ToshinBurnedAreaJSON from "../data/toshin-burned-area3-zero.json";

import { BurnedBuildingOverlay } from ".";

const meta: Meta<typeof BurnedBuildingOverlay> = {
  component: BurnedBuildingOverlay,
};

export default meta;

type Story = StoryObj<typeof BurnedBuildingOverlay>;

export const Default: Story = {
  args: {
    show: true,
    data: ToshinBurnedAreaJSON.list,
    getColor: (value: number) => {
      if (100 < value) return "rgb(235, 51, 35)";
      if (50 < value) return "rgb(222, 130, 68)";
      if (20 < value) return "rgb(255, 254, 85)";
      if (10 < value) return "rgb(117, 250, 76)";
      if (1 < value) return "rgb(116, 252, 253)";
      if (0 < value) return "rgb(144, 138, 212)";
      return "rgb(160, 179, 206)";
    },
  },
};
