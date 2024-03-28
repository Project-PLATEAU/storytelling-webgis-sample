import { Meta, StoryObj } from "@storybook/react";

import { CircleWithText } from ".";

const meta: Meta<typeof CircleWithText> = {
  component: CircleWithText,
};

export default meta;

type Story = StoryObj<typeof CircleWithText>;

export const Default: Story = {
  args: {
    position: { x: 100, y: 100 },
    text: "テスト",
  },
};
