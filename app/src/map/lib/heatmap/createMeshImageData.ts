import { omit } from "lodash";
import invariant from "tiny-invariant";

import { type MeshData } from "./createMeshData";

export interface MeshImageData extends Omit<MeshData, "heightMap" | "maskTexture"> {
  heightMap: HTMLCanvasElement;
  maskTexture: HTMLCanvasElement;
}

export function createMeshImageData(meshData: MeshData): MeshImageData {
  const { heightMap, maskTexture, width, height } = meshData;
  const heightMapCanvas = document.createElement("canvas");
  heightMapCanvas.width = width;
  heightMapCanvas.height = height;
  const heightMapContext = heightMapCanvas.getContext("2d");

  const maskTextureCanvas = document.createElement("canvas");
  maskTextureCanvas.width = width;
  maskTextureCanvas.height = height;
  const maskTextureContext = maskTextureCanvas.getContext("2d");

  invariant(heightMapContext != null);
  invariant(maskTextureContext != null);

  const heightMapImageData = new ImageData(heightMap, width, height);
  heightMapContext.putImageData(heightMapImageData, 0, 0);

  const maskTextureImageData = new ImageData(maskTexture, width, height);
  maskTextureContext.putImageData(maskTextureImageData, 0, 0);

  return {
    ...omit(meshData, "data"),
    heightMap: heightMapCanvas,
    maskTexture: maskTextureCanvas,
  };
}
