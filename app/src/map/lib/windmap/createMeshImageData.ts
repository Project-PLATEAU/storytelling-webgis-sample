import { omit } from "lodash";
import invariant from "tiny-invariant";

import { type MeshData } from "./createMeshData";

export interface MeshImageData extends Omit<MeshData, "windMap" | "maskTexture"> {
  windMap: HTMLCanvasElement;
}

export function createMeshImageData(meshData: MeshData): MeshImageData {
  const { windMap, width, height } = meshData;
  const windMapCanvas = document.createElement("canvas");
  windMapCanvas.width = width;
  windMapCanvas.height = height;
  const windMapContext = windMapCanvas.getContext("2d");

  invariant(windMapContext != null);

  const windMapImageData = new ImageData(windMap, width, height);
  windMapContext.putImageData(windMapImageData, 0, 0);

  return {
    ...omit(meshData, "data"),
    windMap: windMapCanvas,
  };
}
