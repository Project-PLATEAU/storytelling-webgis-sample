import { LayerData } from "../../types";

import { BURNED_LAYERS } from "./burned";
import { DESTROYED_LAYERS } from "./destroyed";
import { EPILOGUE_LAYERS } from "./epilogue";
import { LIQUID_LAYERS } from "./liquid";
import { SHINDO_LAYERS } from "./shindo";
import { TOKYO23_LAYERS } from "./tokyo23";

export const MAIN_LAYERS: LayerData[] = [
  // Scene1
  ...TOKYO23_LAYERS,

  // Scene2
  ...SHINDO_LAYERS,

  // Scene3
  ...DESTROYED_LAYERS,

  // Scene4
  ...BURNED_LAYERS,

  // Scene5
  ...LIQUID_LAYERS,

  // Scene6
  ...EPILOGUE_LAYERS,
];
