import { Meta, StoryObj } from "@storybook/react";

import { SceneDescription } from ".";

const meta: Meta<typeof SceneDescription> = {
  component: SceneDescription,
};

export default meta;

type Story = StoryObj<typeof SceneDescription>;

export const Default: Story = {
  args: {
    content: "東京都内で最大規模の被害が想定される地震が「都心南部直下地震」です。",
    source: {
      title: "首都直下地震等による東京の被害想定報告書",
      url: "https://www.bousai.metro.tokyo.lg.jp/_res/projects/default_project/_page_/001/021/571/20220525/n/002n.pdf",
    },
  },
};
