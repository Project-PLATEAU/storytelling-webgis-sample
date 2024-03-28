import { convertCodeToBounds, inferMeshType } from "../map";

export const computeCenterOfBoundsFromMeshCode = (meshCode: string) => {
  const code = String(meshCode);
  const meshType = inferMeshType(code);
  if (!meshType) {
    throw new Error("meshType could not find");
  }
  const bounds = convertCodeToBounds(code, meshType);
  return [(bounds.west + bounds.east) / 2, (bounds.south + bounds.north) / 2] as [number, number];
};
