import { Meta, StoryObj } from "@storybook/react";

import { IconButton } from ".";

const meta: Meta<typeof IconButton> = {
  component: IconButton,
};

export default meta;

type Story = StoryObj<typeof IconButton>;

export const Default: Story = {
  args: {
    text: "This is a button",
  },
};
