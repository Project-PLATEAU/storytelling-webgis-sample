import { Meta, StoryObj } from "@storybook/react";

import { MainScenes, NavigationState, PageName, SubScenes } from "../../utils/types/common";

import { SceneNavigation } from ".";

const meta: Meta<typeof SceneNavigation> = {
  component: SceneNavigation,
};

export default meta;

type Story = StoryObj<typeof SceneNavigation>;

const mockNavigationState: NavigationState = {
  currentPage: PageName.Opening,
  currentScene: MainScenes.Scene1,
  currentSubScene: SubScenes.Tama,
  currentSceneContentIndex: 0,
};

const mockSetCurrentScene = (scene: MainScenes) => {
  console.log("Scene changed to: ", scene);
};

export const Default: Story = {
  args: {
    navigationState: mockNavigationState,
    setCurrentScene: mockSetCurrentScene,
  },
};
