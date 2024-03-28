import { Layer } from "../map";
import { MainScenes, OpeningScenes, SubScenes } from "../utils";

export type LayerData = Layer & {
  scene: (OpeningScenes | MainScenes)[];
  subScene?: SubScenes[];
  isMain?: boolean;
  contentIndex?: number;
  contentDuration?: number;
  contentIndexToDisableAnimation?: number;
};
