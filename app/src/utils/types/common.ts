export type Language = "ja" | "en";

export type Sound = "on" | "off";

export type Coordinates = [number, number] | [number, number, number];

export type Point =
  | {
      type: "Point";
      coordinates: Coordinates;
    }
  | {
      type: "MultiPoint";
      coordinates: Coordinates[];
    };

export interface LineString {
  type: "LineString";
  coordinates: Coordinates[];
}

export interface Polygon {
  type: "Polygon";
  coordinates: Coordinates[][];
}

export type Geometry = Point | LineString | Polygon;

export interface Feature<G extends Geometry = Geometry> {
  id: string;
  type: "Feature";
  geometry: G;
  properties: Record<string, unknown>;
}

export interface FeatureCollection<F extends Feature = Feature> {
  type: "FeatureCollection";
  features: F[];
}

export enum PageName {
  Opening = "OPENING",
  Main = "MAIN",
}

export enum OpeningScenes {
  Scene1 = "ENTRANCE",
  Scene2 = "FIRE_SPREAD",
  Scene3 = "PICTURES",
  Scene4 = "FOR_FUTURE",
  Scene5 = "COUNT_UP_1923_2023",
  Scene6 = "LOADING_MAP",
}

export enum MainScenes {
  Scene1 = "SCENE_01",
  Scene2 = "SCENE_02",
  Scene3 = "SCENE_03",
  Scene4 = "SCENE_04",
  Scene5 = "SCENE_05",
  Scene6 = "SCENE_06",
  // Scene6 = "SCENE_06",
  // Scene7 = "SCENE_07",
  // Scene8 = "SCENE_08",
  // Scene9 = "SCENE_09",
}

export enum SubScenes {
  Toshin = "Toshin",
  Tama = "Tama",
}

export type PageScenes = {
  [PageName.Opening]: OpeningScenes;
  [PageName.Main]: MainScenes;
};

export type NavigationState = {
  currentPage: PageName;
  currentScene: PageScenes[PageName];
  currentSceneContentIndex: number;
  currentSubScene: SubScenes;
};

export const initialNavigationState: NavigationState = {
  currentPage: PageName.Opening,
  currentScene: OpeningScenes.Scene1,
  currentSceneContentIndex: 0,
  currentSubScene: SubScenes.Toshin,
};

export const defaultScenes: { [K in PageName]: PageScenes[K] } = {
  [PageName.Opening]: OpeningScenes.Scene1,
  [PageName.Main]: MainScenes.Scene1,
};

export type Attribute = {
  name: string;
  value: string | number;
};

export type ScreenPosition = {
  x: number;
  y: number;
};

export type MarkerData = {
  screenPosition: ScreenPosition;
  attributes: Attribute[];
};

export type Area = {
  id: string;
  label: string;
  lat: number;
  lon: number;
};

export type Cursor = "move" | "grab" | "pointer";

export type FirstVisit = {
  disclaimerAccepted: boolean;
  isTutorialCompleted: boolean;
};
