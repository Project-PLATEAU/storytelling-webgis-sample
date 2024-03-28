import invariant from "tiny-invariant";

import { convertCodeToBounds, getMeshSize, type MeshBounds, type MeshType } from "../regional-mesh";

export const MAX_VALUE = 0x7fffff;
export const MIN_VALUE = -0x800000;

export interface MeshDataInput {
  codes: Float64Array;
  values: Float32Array;
  meshType: MeshType;
  max: number;
  min: number;
  backgroundColor: [number, number, number, number];
  getTerrainColor: (
    value: number,
    scale: number,
    ration: number,
  ) => [number, number, number, number];
  scale?: number;
  brightness?: number;
  shouldSpreadPixel?: boolean;
  extendBounds?: number;
}

export interface MeshData {
  heightMap: Uint8ClampedArray;
  maskTexture: Uint8ClampedArray;
  width: number;
  height: number;
  bounds: MeshBounds;
}

const PIXEL_OFFSET = 4;

export function createMeshData({
  codes,
  values,
  meshType,
  max,
  min,
  getTerrainColor,
  backgroundColor,
  scale = 1,
  brightness = 1,
  shouldSpreadPixel,
  extendBounds = 1.5,
}: MeshDataInput): MeshData {
  invariant(codes.length === values.length);
  const xs = new Float32Array(codes.length);
  const ys = new Float32Array(codes.length);
  let x1 = Infinity;
  let y1 = Infinity;
  let x2 = -Infinity;
  let y2 = -Infinity;
  codes.forEach((code, index) => {
    const bounds = convertCodeToBounds(`${code}`, meshType);
    xs[index] = bounds.west;
    ys[index] = bounds.south;
    if (bounds.west < x1) x1 = bounds.west;
    if (bounds.east > x2) x2 = bounds.east;
    if (bounds.south < y1) y1 = bounds.south;
    if (bounds.north > y2) y2 = bounds.north;
  });
  x1 -= extendBounds;
  x2 += extendBounds;
  y1 -= extendBounds;
  y2 += extendBounds;
  const { longitude, latitude } = getMeshSize(meshType);
  const width = Math.round((x2 - x1) / longitude);
  const height = Math.round((y2 - y1) / latitude);
  const heightMap = new Uint8ClampedArray(width * height * 4);
  const maskTexture = new Uint8ClampedArray(width * height * 4);
  for (let i = 0; i < heightMap.length; i += 4) {
    heightMap[i] = 0x00;
    heightMap[i + 1] = 0x00;
    heightMap[i + 2] = 0x00;
    heightMap[i + 3] = 0xff;

    maskTexture[i] = 0x00;
    maskTexture[i + 1] = 0x00;
    maskTexture[i + 2] = 0x00;
    maskTexture[i + 3] = 0xff;
  }
  values.forEach((value, index) => {
    const x = Math.round((xs[index] - x1) / longitude);
    const y = height - Math.round((ys[index] - y1) / latitude) - 1;
    const i = (y * width + x) * 4;
    const scaledValue = Math.round(value * scale);
    // if (scaledValue > MAX_VALUE || scaledValue < MIN_VALUE) {
    //   throw new Error(
    //     `Value must be within MIN_VALUE and MAX_VALUE: value = ${value}, scale = ${scale}`,
    //   );
    // }

    const ratio = (scaledValue - min) / (max - min);
    const v = 0xff * ratio;

    heightMap[i] = v;
    heightMap[i + 1] = v;
    heightMap[i + 2] = v;
    heightMap[i + 3] = 0xff;

    const terrainColor = getTerrainColor(value, scale, ratio);
    const defaultColor = brightness < 1 ? 0xff * brightness : 0xff;
    const [r, g, b, a] = [
      Math.min(terrainColor[0] * brightness, defaultColor),
      Math.min(terrainColor[1] * brightness, defaultColor),
      Math.min(terrainColor[2] * brightness, defaultColor),
      terrainColor[3],
    ];
    maskTexture[i] = r;
    maskTexture[i + 1] = g;
    maskTexture[i + 2] = b;
    maskTexture[i + 3] = a;

    if (shouldSpreadPixel) {
      const pixelWidth = width * PIXEL_OFFSET;

      const nextI = i + PIXEL_OFFSET;
      if (nextI % pixelWidth !== 0 && nextI < maskTexture.length) {
        maskTexture[nextI] = r;
        maskTexture[nextI + 1] = g;
        maskTexture[nextI + 2] = b;
        maskTexture[nextI + 3] = a;
      }

      const prevI = i - PIXEL_OFFSET;
      if (i % pixelWidth !== 0 && prevI >= 0) {
        maskTexture[prevI] = r;
        maskTexture[prevI + 1] = g;
        maskTexture[prevI + 2] = b;
        maskTexture[prevI + 3] = a;
      }

      const topI = i - pixelWidth;
      if (topI >= 0) {
        maskTexture[topI] = r;
        maskTexture[topI + 1] = g;
        maskTexture[topI + 2] = b;
        maskTexture[topI + 3] = a;
      }
      const topNextI = i - pixelWidth + PIXEL_OFFSET;
      if ((i + PIXEL_OFFSET) % pixelWidth !== 0 && topNextI >= 0) {
        maskTexture[topNextI] = r;
        maskTexture[topNextI + 1] = g;
        maskTexture[topNextI + 2] = b;
        maskTexture[topNextI + 3] = a;
      }
      const topPrevI = i - pixelWidth - PIXEL_OFFSET;
      if (i % pixelWidth !== 0 && topPrevI >= 0) {
        maskTexture[topPrevI] = r;
        maskTexture[topPrevI + 1] = g;
        maskTexture[topPrevI + 2] = b;
        maskTexture[topPrevI + 3] = a;
      }

      const bottomI = i + pixelWidth;
      if (bottomI < maskTexture.length) {
        maskTexture[bottomI] = r;
        maskTexture[bottomI + 1] = g;
        maskTexture[bottomI + 2] = b;
        maskTexture[bottomI + 3] = a;
      }
      const bottomNextI = i + pixelWidth + PIXEL_OFFSET;
      if ((i + PIXEL_OFFSET) % pixelWidth !== 0 && bottomNextI < maskTexture.length) {
        maskTexture[bottomNextI] = r;
        maskTexture[bottomNextI + 1] = g;
        maskTexture[bottomNextI + 2] = b;
        maskTexture[bottomNextI + 3] = a;
      }
      const bottomPrevI = i + pixelWidth - PIXEL_OFFSET;
      if (i % pixelWidth !== 0 && bottomPrevI >= 0) {
        maskTexture[bottomPrevI] = r;
        maskTexture[bottomPrevI + 1] = g;
        maskTexture[bottomPrevI + 2] = b;
        maskTexture[bottomPrevI + 3] = a;
      }
    }
  });
  const neighbors = [];
  for (let i = 0; i < maskTexture.length; i += 4) {
    const isDefaultColor =
      maskTexture[i] === 0x00 &&
      maskTexture[i + 1] === 0x00 &&
      maskTexture[i + 2] === 0x00 &&
      maskTexture[i + 3] === 0xff;
    const pixelWidth = width * PIXEL_OFFSET;
    const isNeighborDefaultColor =
      // Prev
      (i % pixelWidth !== 0 && i - PIXEL_OFFSET >= 0
        ? (maskTexture[i - PIXEL_OFFSET] === 0x00 &&
            maskTexture[i - PIXEL_OFFSET + 1] === 0x00 &&
            maskTexture[i - PIXEL_OFFSET + 2] === 0x00 &&
            maskTexture[i - PIXEL_OFFSET + 3] === 0xff) ||
          (maskTexture[i - PIXEL_OFFSET] === backgroundColor[0] &&
            maskTexture[i - PIXEL_OFFSET + 1] === backgroundColor[1] &&
            maskTexture[i - PIXEL_OFFSET + 2] === backgroundColor[2] &&
            maskTexture[i - PIXEL_OFFSET + 3] === backgroundColor[3])
        : true) &&
      // Next
      ((i + PIXEL_OFFSET) % pixelWidth !== 0 && i + PIXEL_OFFSET < maskTexture.length
        ? (maskTexture[i + PIXEL_OFFSET] === 0x00 &&
            maskTexture[i + PIXEL_OFFSET + 1] === 0x00 &&
            maskTexture[i + PIXEL_OFFSET + 2] === 0x00 &&
            maskTexture[i + PIXEL_OFFSET + 3] === 0xff) ||
          (maskTexture[i + PIXEL_OFFSET] === backgroundColor[0] &&
            maskTexture[i + PIXEL_OFFSET + 1] === backgroundColor[1] &&
            maskTexture[i + PIXEL_OFFSET + 2] === backgroundColor[2] &&
            maskTexture[i + PIXEL_OFFSET + 3] === backgroundColor[3])
        : true) &&
      // Prev * 2
      ((i - PIXEL_OFFSET) % pixelWidth !== 0 && i % pixelWidth !== 0 && i - PIXEL_OFFSET * 2 >= 0
        ? (maskTexture[i - PIXEL_OFFSET * 2] === 0x00 &&
            maskTexture[i - PIXEL_OFFSET * 2 + 1] === 0x00 &&
            maskTexture[i - PIXEL_OFFSET * 2 + 2] === 0x00 &&
            maskTexture[i - PIXEL_OFFSET * 2 + 3] === 0xff) ||
          (maskTexture[i - PIXEL_OFFSET * 2] === backgroundColor[0] &&
            maskTexture[i - PIXEL_OFFSET * 2 + 1] === backgroundColor[1] &&
            maskTexture[i - PIXEL_OFFSET * 2 + 2] === backgroundColor[2] &&
            maskTexture[i - PIXEL_OFFSET * 2 + 3] === backgroundColor[3])
        : true) &&
      // Next * 2
      ((i + PIXEL_OFFSET) % pixelWidth !== 0 &&
      (i + PIXEL_OFFSET * 2) % pixelWidth !== 0 &&
      i + PIXEL_OFFSET * 2 < maskTexture.length
        ? (maskTexture[i + PIXEL_OFFSET * 2] === 0x00 &&
            maskTexture[i + PIXEL_OFFSET * 2 + 1] === 0x00 &&
            maskTexture[i + PIXEL_OFFSET * 2 + 2] === 0x00 &&
            maskTexture[i + PIXEL_OFFSET * 2 + 3] === 0xff) ||
          (maskTexture[i + PIXEL_OFFSET * 2] === backgroundColor[0] &&
            maskTexture[i + PIXEL_OFFSET * 2 + 1] === backgroundColor[1] &&
            maskTexture[i + PIXEL_OFFSET * 2 + 2] === backgroundColor[2] &&
            maskTexture[i + PIXEL_OFFSET * 2 + 3] === backgroundColor[3])
        : true) &&
      // Top
      (i - pixelWidth >= 0
        ? (maskTexture[i - pixelWidth] === 0x00 &&
            maskTexture[i - pixelWidth + 1] === 0x00 &&
            maskTexture[i - pixelWidth + 2] === 0x00 &&
            maskTexture[i - pixelWidth + 3] === 0xff) ||
          (maskTexture[i - pixelWidth] === backgroundColor[0] &&
            maskTexture[i - pixelWidth + 1] === backgroundColor[1] &&
            maskTexture[i - pixelWidth + 2] === backgroundColor[2] &&
            maskTexture[i - pixelWidth + 3] === backgroundColor[3])
        : true) &&
      // Bottom
      (i + pixelWidth < maskTexture.length
        ? (maskTexture[i + pixelWidth] === 0x00 &&
            maskTexture[i + pixelWidth + 1] === 0x00 &&
            maskTexture[i + pixelWidth + 2] === 0x00 &&
            maskTexture[i + pixelWidth + 3] === 0xff) ||
          (maskTexture[i + pixelWidth] === backgroundColor[0] &&
            maskTexture[i + pixelWidth + 1] === backgroundColor[1] &&
            maskTexture[i + pixelWidth + 2] === backgroundColor[2] &&
            maskTexture[i + pixelWidth + 3] === backgroundColor[3])
        : true) &&
      // Top & Prev
      (i % pixelWidth !== 0 && i - pixelWidth - PIXEL_OFFSET >= 0
        ? (maskTexture[i - pixelWidth - PIXEL_OFFSET] === 0x00 &&
            maskTexture[i - pixelWidth - PIXEL_OFFSET + 1] === 0x00 &&
            maskTexture[i - pixelWidth - PIXEL_OFFSET + 2] === 0x00 &&
            maskTexture[i - pixelWidth - PIXEL_OFFSET + 3] === 0xff) ||
          (maskTexture[i - pixelWidth - PIXEL_OFFSET] === backgroundColor[0] &&
            maskTexture[i - pixelWidth - PIXEL_OFFSET + 1] === backgroundColor[1] &&
            maskTexture[i - pixelWidth - PIXEL_OFFSET + 2] === backgroundColor[2] &&
            maskTexture[i - pixelWidth - PIXEL_OFFSET + 3] === backgroundColor[3])
        : true) &&
      // Top & Next
      ((i + PIXEL_OFFSET) % pixelWidth !== 0 && i - pixelWidth + PIXEL_OFFSET >= 0
        ? (maskTexture[i - pixelWidth + PIXEL_OFFSET] === 0x00 &&
            maskTexture[i - pixelWidth + PIXEL_OFFSET + 1] === 0x00 &&
            maskTexture[i - pixelWidth + PIXEL_OFFSET + 2] === 0x00 &&
            maskTexture[i - pixelWidth + PIXEL_OFFSET + 3] === 0xff) ||
          (maskTexture[i - pixelWidth + PIXEL_OFFSET] === backgroundColor[0] &&
            maskTexture[i - pixelWidth + PIXEL_OFFSET + 1] === backgroundColor[1] &&
            maskTexture[i - pixelWidth + PIXEL_OFFSET + 2] === backgroundColor[2] &&
            maskTexture[i - pixelWidth + PIXEL_OFFSET + 3] === backgroundColor[3])
        : true) &&
      // Top & Prev * 2
      ((i - PIXEL_OFFSET) % pixelWidth !== 0 &&
      i % pixelWidth !== 0 &&
      i - pixelWidth - PIXEL_OFFSET * 2 >= 0
        ? (maskTexture[i - pixelWidth - PIXEL_OFFSET * 2] === 0x00 &&
            maskTexture[i - pixelWidth - PIXEL_OFFSET * 2 + 1] === 0x00 &&
            maskTexture[i - pixelWidth - PIXEL_OFFSET * 2 + 2] === 0x00 &&
            maskTexture[i - pixelWidth - PIXEL_OFFSET * 2 + 3] === 0xff) ||
          (maskTexture[i - pixelWidth - PIXEL_OFFSET * 2] === backgroundColor[0] &&
            maskTexture[i - pixelWidth - PIXEL_OFFSET * 2 + 1] === backgroundColor[1] &&
            maskTexture[i - pixelWidth - PIXEL_OFFSET * 2 + 2] === backgroundColor[2] &&
            maskTexture[i - pixelWidth - PIXEL_OFFSET * 2 + 3] === backgroundColor[3])
        : true) &&
      // Top & Next * 2
      ((i + PIXEL_OFFSET) % pixelWidth !== 0 &&
      (i + PIXEL_OFFSET * 2) % pixelWidth !== 0 &&
      i - pixelWidth + PIXEL_OFFSET * 2 >= 0
        ? (maskTexture[i - pixelWidth + PIXEL_OFFSET * 2] === 0x00 &&
            maskTexture[i - pixelWidth + PIXEL_OFFSET * 2 + 1] === 0x00 &&
            maskTexture[i - pixelWidth + PIXEL_OFFSET * 2 + 2] === 0x00 &&
            maskTexture[i - pixelWidth + PIXEL_OFFSET * 2 + 3] === 0xff) ||
          (maskTexture[i - pixelWidth + PIXEL_OFFSET * 2] === backgroundColor[0] &&
            maskTexture[i - pixelWidth + PIXEL_OFFSET * 2 + 1] === backgroundColor[1] &&
            maskTexture[i - pixelWidth + PIXEL_OFFSET * 2 + 2] === backgroundColor[2] &&
            maskTexture[i - pixelWidth + PIXEL_OFFSET * 2 + 3] === backgroundColor[3])
        : true) &&
      // Bottom & Prev
      (i % pixelWidth !== 0 && i + pixelWidth - PIXEL_OFFSET < maskTexture.length
        ? (maskTexture[i + pixelWidth - PIXEL_OFFSET] === 0x00 &&
            maskTexture[i + pixelWidth - PIXEL_OFFSET + 1] === 0x00 &&
            maskTexture[i + pixelWidth - PIXEL_OFFSET + 2] === 0x00 &&
            maskTexture[i + pixelWidth - PIXEL_OFFSET + 3] === 0xff) ||
          (maskTexture[i + pixelWidth - PIXEL_OFFSET] === backgroundColor[0] &&
            maskTexture[i + pixelWidth - PIXEL_OFFSET + 1] === backgroundColor[1] &&
            maskTexture[i + pixelWidth - PIXEL_OFFSET + 2] === backgroundColor[2] &&
            maskTexture[i + pixelWidth - PIXEL_OFFSET + 3] === backgroundColor[3])
        : true) &&
      // Bottom & Next
      ((i + PIXEL_OFFSET) % pixelWidth !== 0 && i + pixelWidth + PIXEL_OFFSET < maskTexture.length
        ? (maskTexture[i + pixelWidth + PIXEL_OFFSET] === 0x00 &&
            maskTexture[i + pixelWidth + PIXEL_OFFSET + 1] === 0x00 &&
            maskTexture[i + pixelWidth + PIXEL_OFFSET + 2] === 0x00 &&
            maskTexture[i + pixelWidth + PIXEL_OFFSET + 3] === 0xff) ||
          (maskTexture[i + pixelWidth + PIXEL_OFFSET] === backgroundColor[0] &&
            maskTexture[i + pixelWidth + PIXEL_OFFSET + 1] === backgroundColor[1] &&
            maskTexture[i + pixelWidth + PIXEL_OFFSET + 2] === backgroundColor[2] &&
            maskTexture[i + pixelWidth + PIXEL_OFFSET + 3] === backgroundColor[3])
        : true) &&
      // Bottom & Prev * 2
      ((i - PIXEL_OFFSET) % pixelWidth !== 0 &&
      i % pixelWidth !== 0 &&
      i + pixelWidth - PIXEL_OFFSET * 2 < maskTexture.length
        ? (maskTexture[i + pixelWidth - PIXEL_OFFSET * 2] === 0x00 &&
            maskTexture[i + pixelWidth - PIXEL_OFFSET * 2 + 1] === 0x00 &&
            maskTexture[i + pixelWidth - PIXEL_OFFSET * 2 + 2] === 0x00 &&
            maskTexture[i + pixelWidth - PIXEL_OFFSET * 2 + 3] === 0xff) ||
          (maskTexture[i + pixelWidth - PIXEL_OFFSET * 2] === backgroundColor[0] &&
            maskTexture[i + pixelWidth - PIXEL_OFFSET * 2 + 1] === backgroundColor[1] &&
            maskTexture[i + pixelWidth - PIXEL_OFFSET * 2 + 2] === backgroundColor[2] &&
            maskTexture[i + pixelWidth - PIXEL_OFFSET * 2 + 3] === backgroundColor[3])
        : true) &&
      // Bottom & Next * 2
      ((i + PIXEL_OFFSET) % pixelWidth !== 0 &&
      (i + PIXEL_OFFSET * 2) % pixelWidth !== 0 &&
      i + pixelWidth + PIXEL_OFFSET * 2 < maskTexture.length
        ? (maskTexture[i + pixelWidth + PIXEL_OFFSET * 2] === 0x00 &&
            maskTexture[i + pixelWidth + PIXEL_OFFSET * 2 + 1] === 0x00 &&
            maskTexture[i + pixelWidth + PIXEL_OFFSET * 2 + 2] === 0x00 &&
            maskTexture[i + pixelWidth + PIXEL_OFFSET * 2 + 3] === 0xff) ||
          (maskTexture[i + pixelWidth + PIXEL_OFFSET * 2] === backgroundColor[0] &&
            maskTexture[i + pixelWidth + PIXEL_OFFSET * 2 + 1] === backgroundColor[1] &&
            maskTexture[i + pixelWidth + PIXEL_OFFSET * 2 + 2] === backgroundColor[2] &&
            maskTexture[i + pixelWidth + PIXEL_OFFSET * 2 + 3] === backgroundColor[3])
        : true);

    if (!isDefaultColor) continue;

    if (!isNeighborDefaultColor) {
      neighbors.push(i);
      continue;
    }

    maskTexture[i] = backgroundColor[0];
    maskTexture[i + 1] = backgroundColor[1];
    maskTexture[i + 2] = backgroundColor[2];
    maskTexture[i + 3] = backgroundColor[3];
  }

  for (const i of neighbors) {
    const terrainColor = getTerrainColor(0, scale, 0);
    const defaultColor = brightness < 1 ? 0xff * brightness : 0xff;
    maskTexture[i] = Math.min(terrainColor[0] * brightness, defaultColor);
    maskTexture[i + 1] = Math.min(terrainColor[1] * brightness, defaultColor);
    maskTexture[i + 2] = Math.min(terrainColor[2] * brightness, defaultColor);
    maskTexture[i + 3] = terrainColor[3];
  }

  return {
    heightMap,
    maskTexture,
    width,
    height,
    bounds: {
      west: x1,
      south: y1,
      east: x2,
      north: y2,
    },
  };
}
