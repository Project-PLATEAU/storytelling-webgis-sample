import { Meta, StoryObj } from "@storybook/react";

import { Marker } from "../icons/Marker";

import { LegendWithImage } from ".";

const meta: Meta<typeof LegendWithImage> = {
  component: LegendWithImage,
};

export default meta;

type Story = StoryObj<typeof LegendWithImage>;

export const Default: Story = {
  args: {
    label: "避難施設",
    description: "クリックで詳細",
    img: <Marker color="#E000AF" />,
  },
};
