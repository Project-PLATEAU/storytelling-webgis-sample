import { Meta, StoryObj } from "@storybook/react";

import { MainScenes } from "../../utils";

import { SceneDescriptionOverlay } from ".";

const meta: Meta<typeof SceneDescriptionOverlay> = {
  component: SceneDescriptionOverlay,
};

export default meta;

type Story = StoryObj<typeof SceneDescriptionOverlay>;

export const Default: Story = {
  args: {
    show: true,
    sceneName: MainScenes.Scene2,
    timeout: Infinity,
  },
};

export const WithoutSubtitle: Story = {
  args: {
    show: true,
    sceneName: MainScenes.Scene1,
    backgroundColor: "#E6E6FA",
    color: "#463C64",
  },
};
