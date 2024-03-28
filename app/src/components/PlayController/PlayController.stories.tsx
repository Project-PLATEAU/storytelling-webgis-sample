import { Meta, StoryObj } from "@storybook/react";

import { PlayController } from ".";

const meta: Meta<typeof PlayController> = {
  component: PlayController,
};

export default meta;

type Story = StoryObj<typeof PlayController>;

export const Default: Story = {
  args: {
    steps: [
      {
        name: "OP",
        contents: [
          {
            duration: 5000,
          },
        ],
      },
      {
        contents: [
          {
            duration: 5000,
          },
          {
            duration: 5000,
          },
        ],
      },
      {
        contents: [
          {
            duration: 5000,
          },
          {
            duration: 5000,
          },
          {
            duration: 5000,
          },
        ],
      },
      {
        contents: [
          {
            duration: 5000,
          },
        ],
      },
      {
        name: "ED",
        contents: [
          {
            duration: 5000,
          },
          {
            duration: 5000,
          },
        ],
      },
    ],
  },
};

export const ChangeByProps: Story = {
  args: {
    currentMainStepIndex: 2,
    currentContentStepIndex: 2,
    steps: [
      {
        name: "OP",
        contents: [
          {
            duration: 5000,
          },
        ],
      },
      {
        contents: [
          {
            duration: 5000,
          },
          {
            duration: 5000,
          },
        ],
      },
      {
        contents: [
          {
            duration: 5000,
          },
          {
            duration: 5000,
          },
          {
            duration: 5000,
          },
        ],
      },
      {
        contents: [
          {
            duration: 5000,
          },
        ],
      },
      {
        name: "ED",
        contents: [
          {
            duration: 5000,
          },
          {
            duration: 5000,
          },
        ],
      },
    ],
  },
};
