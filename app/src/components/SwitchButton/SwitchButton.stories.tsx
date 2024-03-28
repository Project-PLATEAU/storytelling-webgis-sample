import { Meta, StoryObj } from "@storybook/react";

import { SwitchButton } from ".";

const meta: Meta<typeof SwitchButton> = {
  component: SwitchButton,
};

export default meta;

type Story = StoryObj<typeof SwitchButton>;

export const Default: Story = {
  args: {
    contents: ["都心南部直下地震", "多摩東部直下地震"],
  },
};
