import { Meta, StoryObj } from "@storybook/react";

import { ScrollableContents } from ".";

const meta: Meta<typeof ScrollableContents> = {
  component: ScrollableContents,
};

export default meta;

type Story = StoryObj<typeof ScrollableContents>;

export const Default: Story = {
  args: {
    children: [
      <div key="1">
        <title>コンテンツ1</title>
      </div>,
    ],
  },
};
