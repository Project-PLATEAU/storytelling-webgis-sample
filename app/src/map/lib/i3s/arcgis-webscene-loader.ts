// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import type { LoaderWithParser } from "@loaders.gl/loader-utils";

import { parseWebscene } from "./lib/parsers/parse-arcgis-webscene";
import type { ArcGisWebSceneData } from "./types";

// __VERSION__ is injected by babel-plugin-version-inline
// @ts-ignore TS2304: Cannot find name '__VERSION__'.
const VERSION = typeof __VERSION__ !== "undefined" ? __VERSION__ : "latest";

/**
 * Loader for ArcGis WebScene
 * Spec - https://developers.arcgis.com/web-scene-specification/objects/webscene/
 */
export const ArcGisWebSceneLoader: LoaderWithParser = {
  name: "ArcGIS Web Scene Loader",
  id: "arcgis-web-scene",
  module: "i3s",
  version: VERSION,
  mimeTypes: ["application/json"],
  parse,
  extensions: ["json"],
  options: {},
};

/**
 * Parse ArcGis webscene
 * @param data
 */
async function parse(data: ArrayBuffer): Promise<ArcGisWebSceneData> {
  return parseWebscene(data);
}