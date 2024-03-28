import { Marker } from "../../components/icons/Marker";
import { LegendItem } from "../../components/MinimizedReport";
import { MainScenes } from "../../utils";

const TOKYO23_LEGEND_COLORS = [
  {
    color: "rgb(160, 192, 222)",
  },
  {
    color: "rgb(166, 222, 214)",
  },
  {
    color: "rgb(189, 182, 222)",
  },
  {
    color: "rgb(222, 171, 153)",
  },
  {
    color: "rgb(202, 202, 202)",
  },
];

export const BURNED_OVERLAY = "BURNED_OVERLAY";

export const SCENE_LEGEND: {
  [K in MainScenes | typeof BURNED_OVERLAY]?: {
    items: LegendItem[];
  }[];
} = {
  [MainScenes.Scene1]: [
    {
      items: TOKYO23_LEGEND_COLORS,
    },
    {
      items: [
        {
          img: <Marker color="#E000AF" />,
        },
      ],
    },
  ],
  [MainScenes.Scene2]: [
    {
      items: TOKYO23_LEGEND_COLORS,
    },
    {
      items: [
        {
          color: "#FF5631",
        },
        {
          color: "#FFA068",
        },
        {
          color: "#FFD72E",
        },
        {
          color: "#8AFF2E",
        },
        {
          color: "#2EFFD9",
        },
        {
          color: "#2EA7FF",
        },
        {
          color: "#464EFF",
        },
      ],
    },
  ],
  [MainScenes.Scene3]: [
    {
      items: TOKYO23_LEGEND_COLORS,
    },
    {
      items: [
        {
          color: "#FEEE70",
        },
        {
          color: "#F979D0",
        },
        {
          color: "#AE52CF",
        },
        {
          color: "#6DABD8",
        },
        {
          color: "#CACACA",
        },
      ],
    },
  ],
  [MainScenes.Scene4]: [
    {
      items: [
        {
          color: "rgb(4, 41, 64)",
        },
        {
          color: "rgb(0, 92, 83)",
        },
      ],
    },
    {
      items: [
        {
          color: "rgb(31, 76, 166)",
        },
        {
          color: "rgb(113, 166, 201)",
        },
        {
          color: "rgb(62, 110, 140)",
        },
        {
          color: "rgb(242, 185, 172)",
        },
        {
          color: "rgb(202, 202, 202)",
        },
      ],
    },
    {
      items: [
        {
          color: "rgba(235, 51, 35, 1)",
        },
        {
          color: "rgba(222, 130, 68, 1)",
        },
        {
          color: "rgba(255, 254, 85, 1)",
        },
        {
          color: "rgba(117, 250, 76, 1)",
        },
        {
          color: "rgba(116, 252, 253, 1)",
        },
        {
          color: "rgba(144, 138, 212, 1)",
        },
        {
          color: "rgba(160, 179, 206, 1)",
        },
      ],
    },
  ],
  [BURNED_OVERLAY]: [
    {
      items: [
        {
          color: "rgba(235, 51, 35, 1)",
        },
        {
          color: "rgba(222, 130, 68, 1)",
        },
        {
          color: "rgba(255, 254, 85, 1)",
        },
        {
          color: "rgba(117, 250, 76, 1)",
        },
        {
          color: "rgba(116, 252, 253, 1)",
        },
        {
          color: "rgba(144, 138, 212, 1)",
        },
        {
          color: "rgba(160, 179, 206, 1)",
        },
      ],
    },
  ],
  [MainScenes.Scene5]: [
    {
      items: TOKYO23_LEGEND_COLORS,
    },
    {
      items: [
        {
          color: "#2FFF82",
          // color: "rgb(180, 85, 66)",
        },
        {
          color: "#38E8E8",
          // color: "rgb(180, 114, 66)",
        },
        {
          color: "#4085EE",
          // color: "rgb(180, 143, 66)",
        },
        {
          color: "#7284C5",
          // color: "rgb(180, 172, 66)",
        },
        {
          color: "#CACACA",
        },
      ],
    },
  ],
};
