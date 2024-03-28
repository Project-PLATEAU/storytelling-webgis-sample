import { Meta, StoryObj } from "@storybook/react";

import { StartPage } from ".";

const meta: Meta<typeof StartPage> = {
  component: StartPage,
};

export default meta;

type Story = StoryObj<typeof StartPage>;

export const Default: Story = {};
