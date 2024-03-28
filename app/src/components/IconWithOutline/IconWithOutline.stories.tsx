import { Meta, StoryObj } from "@storybook/react";

import { IconWithOutline } from ".";

const meta: Meta<typeof IconWithOutline> = {
  component: IconWithOutline,
};

export default meta;

type Story = StoryObj<typeof IconWithOutline>;

export const Default: Story = {
  args: {
    iconPath: "/img/sound-on.svg",
  },
};
