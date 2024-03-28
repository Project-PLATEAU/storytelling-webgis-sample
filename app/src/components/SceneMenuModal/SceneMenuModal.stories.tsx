import { Meta, StoryObj } from "@storybook/react";

import { SceneMenuModal } from ".";

const meta: Meta<typeof SceneMenuModal> = {
  component: SceneMenuModal,
};

export default meta;

type Story = StoryObj<typeof SceneMenuModal>;

export const Default: Story = {
  args: {
    show: true,
    list: [
      {
        id: "イントロダクション",
        name: "イントロダクション",
      },
      {
        id: "都心南部 / 多摩東部直下地震",
        name: "都心南部 / 多摩東部直下地震",
        children: [
          {
            id: "震度分布",
            name: "震度分布",
          },
          {
            id: "倒壊棟数分布",
            name: "倒壊棟数分布",
          },
          {
            id: "焼失棟数分布",
            name: "焼失棟数分布",
          },
          {
            id: "液状化分布",
            name: "液状化分布",
          },
        ],
      },
      {
        id: "未来のために",
        name: "未来のために",
      },
    ],
  },
};

export const Render: Story = {
  args: {
    show: true,
    renderHeader: () => (
      <div>
        <h1 style={{ position: "fixed", top: 20, left: 20, margin: 0 }}>TITLE</h1>
        <div>HEADER</div>
      </div>
    ),
    renderFooter: () => (
      <div>
        <div>FOOTER</div>
      </div>
    ),
    list: [
      {
        id: "イントロダクション",
        name: "イントロダクション",
      },
      {
        id: "都心南部 / 多摩東部直下地震",
        name: "都心南部 / 多摩東部直下地震",
        children: [
          {
            id: "震度分布",
            name: "震度分布",
          },
          {
            id: "倒壊棟数分布",
            name: "倒壊棟数分布",
          },
          {
            id: "焼失棟数分布",
            name: "焼失棟数分布",
          },
          {
            id: "液状化分布",
            name: "液状化分布",
          },
        ],
      },
      {
        id: "未来のために",
        name: "未来のために",
      },
    ],
  },
};
