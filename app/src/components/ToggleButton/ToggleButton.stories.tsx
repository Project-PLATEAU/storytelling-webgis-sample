import { Meta, StoryObj } from "@storybook/react";

import { ToggleButton } from ".";

const meta: Meta<typeof ToggleButton> = {
  component: ToggleButton,
};

export default meta;

type Story = StoryObj<typeof ToggleButton>;

export const Default: Story = {
  args: {
    children: "This is a button",
  },
};
