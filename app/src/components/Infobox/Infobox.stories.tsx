import { Meta, StoryObj } from "@storybook/react";

import { Infobox } from ".";

const meta: Meta<typeof Infobox> = {
  component: Infobox,
  title: "Components/Infobox",
};

export default meta;

type Story = StoryObj<typeof Infobox>;

export const Default: Story = {
  args: {
    screenPosition: { x: 0, y: 0 },
    attributes: [
      {
        name: "名称",
        value: "錦糸中学校",
      },
      {
        name: "住所",
        value: "東京都墨田区石原",
      },
      {
        name: "施設の種類",
        value: "避難所収容",
      },
      {
        name: "収容人数",
        value: 1805,
      },
    ],
  },
};
