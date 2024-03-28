import { LayerData } from "../types";

import { MAIN_LAYERS } from "./main";
import { OPENING_LAYERS } from "./opening";

export const LAYERS: LayerData[] = [...OPENING_LAYERS, ...MAIN_LAYERS];
