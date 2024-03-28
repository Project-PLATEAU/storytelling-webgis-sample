import { Meta, StoryObj } from "@storybook/react";

import { ParticleOverlay } from ".";

const meta: Meta<typeof ParticleOverlay> = {
  component: ParticleOverlay,
};

export default meta;

type Story = StoryObj<typeof ParticleOverlay>;

export const Default: Story = {
  args: {},
};
