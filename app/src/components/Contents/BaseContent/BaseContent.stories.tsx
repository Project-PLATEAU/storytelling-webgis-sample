import { Meta, StoryObj } from "@storybook/react";

import { BaseContent } from ".";

const meta: Meta<typeof BaseContent> = {
  component: BaseContent,
};

export default meta;

type Story = StoryObj<typeof BaseContent>;

export const Default: Story = {};
