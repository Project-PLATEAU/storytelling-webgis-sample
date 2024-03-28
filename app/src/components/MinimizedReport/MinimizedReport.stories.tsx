import { Meta, StoryObj } from "@storybook/react";

import { Marker } from "../icons/Marker";

import { MinimizedReport } from ".";

const meta: Meta<typeof MinimizedReport> = {
  component: MinimizedReport,
};

export default meta;

type Story = StoryObj<typeof MinimizedReport>;

export const Default: Story = {
  args: {
    title: `都心南部直下地震
焼失棟数分布`,
    description: "火災によって焼失する家屋は、最大で約12万棟にのぼると想定されています。",
    sourceLabel: "首都直下地震等による東京の被害想定報告書",
    sourceUrl:
      "https://www.bousai.metro.tokyo.lg.jp/_res/projects/default_project/_page_/001/021/571/20220525/n/002n.pdf",
    legends: [
      {
        title: "エリア範囲内の焼失棟数",
        items: [
          {
            label: "Hello World\nHello World",
            color: "#DA3F3F",
          },
          {
            label: "6",
            color: "#EB9436",
          },
          {
            label: "5",
            color: "#EBF000",
          },
          {
            label: "4",
            color: "#9CF259",
          },
          {
            label: "3",
            color: "#6EE0C4",
          },
        ],
      },
      {
        title: "避難施設",
        items: [
          {
            label: "クリックで詳細",
            img: <Marker />,
          },
        ],
      },
    ],
  },
};
