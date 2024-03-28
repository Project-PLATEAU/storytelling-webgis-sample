import { readFileSync, readdirSync, createWriteStream } from "node:fs";
import { XMLParser } from "fast-xml-parser";

const allFiles = readdirSync("./data/plateau_citygml_2023/udx/bldg").filter(file => file.endsWith(".gml"));

// TODO: Convert all Tokyo-23th city.
const GML_FILES = allFiles.map((file) => ({
  input:
      `./data/plateau_citygml_2023/udx/bldg/${file}`,
  output: file.split("_")[0],
  meshCode: file.split("_")[0],
}));

const chunkCoordinates = (posList) => {
  if(!posList || posList.length === 0) return;
  if(posList.length % 3 !== 0) {
    throw new Error("Length is wrong");
  }

  const result = [];
  for(let i = 0; i < posList.length; i += 3) {
    const [lat, lng, alt] = posList.slice(i, i + 3);
    result.push([lng, lat, alt]);
  }

  return result;
}

const getPolygonRing = (polygon) => {
  const exterior = polygon?.["gml:exterior"]?.["gml:LinearRing"]?.["gml:posList"]
    ?.split(" ")
    ?.map(pos => Number(pos));
  const interior = polygon?.["gml:interior"]?.["gml:LinearRing"]?.["gml:posList"]
    ?.split(" ")
    ?.map(pos => Number(pos));
  return [
    chunkCoordinates(exterior),
    chunkCoordinates(interior),
  ];
}

const makeGeoJson = (coordinates, properties) => {
  return {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates,
    },
    properties,
  }
}

let a = false;
const getFeature = (m, meshCode, result = []) => {
  const building = m["bldg:Building"];
  if(!building) return result;

  const gmlId = building["@_gml:id"];

  const measuredHeight = building["bldg:measuredHeight"];
  const [lod0RoofEdge] = getPolygonRing(building["bldg:lod0RoofEdge"]?.["gml:MultiSurface"]?.["gml:surfaceMember"]?.["gml:Polygon"]);
  const [lod0FootPrint] = getPolygonRing(building["bldg:lod0FootPrint"]?.["gml:MultiSurface"]?.["gml:surfaceMember"]?.["gml:Polygon"]);

  const buildingDetailAttribute = building["uro:buildingDetailAttribute"]?.["uro:BuildingDetailAttribute"];
  const keyValuePairs = building["uro:keyValuePairAttribute"];
  const buildingStructureType = keyValuePairs
    ? Array.isArray(keyValuePairs)
      ? keyValuePairs.filter(k => k["uro:KeyValuePairAttribute"]["uro:key"]["#text"] === 100).map(k => k["uro:KeyValuePairAttribute"]["uro:codeValue"]["#text"])[0]
      : keyValuePairs["uro:KeyValuePairAttribute"]["uro:key"]["#text"] === 100
        ? keyValuePairs["uro:KeyValuePairAttribute"]["uro:codeValue"]["#text"]
        : undefined
    : undefined;


  const properties = {
    gmlId,
    meshCode,
    measuredHeight: measuredHeight?.["#text"] ?? 0,
    fireproofStructureType: buildingDetailAttribute?.["uro:fireproofStructureType"]?.["#text"],
    buildingStructureType,
  };

  const surfaces = building["bldg:boundedBy"]?.reduce((res, bound) => {
    const roofPolygon = bound["bldg:RoofSurface"]?.["bldg:lod2MultiSurface"]?.["gml:MultiSurface"]?.["gml:surfaceMember"]?.["gml:Polygon"];
    const [roofPolygonExterior, roofPolygonInterior] = getPolygonRing(roofPolygon);
    const groundPolygon = bound["bldg:GroundSurface"]?.["bldg:lod2MultiSurface"]?.["gml:MultiSurface"]?.["gml:surfaceMember"]?.["gml:Polygon"];
    const [groundPolygonExterior, groundPolygonInterior] = getPolygonRing(groundPolygon);

    const item = { roof: undefined, ground: undefined };

    if(roofPolygonExterior) {
      item.roof = [roofPolygonExterior, roofPolygonInterior];
    }
    if(groundPolygonExterior) {
      item.ground = [groundPolygonExterior, groundPolygonInterior];
    }

    if(item.roof || item.ground) {
      res.push(item);
    }

    return res;
  }, []);

  const [groundMax, groundMin] = surfaces?.reduce((res, { ground: [exterior] = [] }) => {
    if(!exterior) return res;
    const [max, min] = exterior.reduce((res, pol) => [Math.max(pol[2], res[0]), Math.min(pol[2], res[1])], [exterior[0][2], exterior[0][2]]);
    return [res[0] ? Math.max(max, res[0]) : max, res[1] ? Math.min(min, res[1]) : min];
  }, [undefined, undefined]) ?? [];

  if(surfaces && groundMax && groundMin) {
    for(const surface of surfaces) {
      if(surface?.roof) {
        const {
          roof: [roofPolygonExterior, roofPolygonInterior],
        } = surface;
        const [roofMax, roofMin] = roofPolygonExterior.reduce((res, pol) => [Math.max(pol[2], res[0]), Math.min(pol[2], res[1])], [roofPolygonExterior[0][2], roofPolygonExterior[0][2]]);
        const z = ((roofMax + roofMin) / 2) - ((groundMax + groundMin) / 2)
        const coordinates = [roofPolygonExterior, roofPolygonInterior].filter(Boolean);
        result.push(makeGeoJson(coordinates, { ...properties, z }));
      }
    }
  } else {
    result.push(makeGeoJson([lod0RoofEdge ?? lod0FootPrint], { ...properties, z: Number(properties.measuredHeight || 0) }));
  }

  return result;
}

const run = (file) => {
  const xmlParser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix : "@_" });
  const fileBuf = readFileSync(file.input);
  const jsonObj = xmlParser.parse(fileBuf);
  const member = jsonObj["core:CityModel"]?.["core:cityObjectMember"];
  const features = (member && Array.isArray(member))
    ? member?.reduce((result, m) => getFeature(m, file.meshCode, result), [])
    : member ? getFeature(member, file.meshCode): []; 

  return features;
}

const writeStreem = createWriteStream("./tokyo23.geojsonl");

let index = 0;
for(const file of GML_FILES) {
  writeStreem.write(run(file).map(f => JSON.stringify(f)).join("\n"));
  index++;
  console.log(`${index} / ${GML_FILES.length} is completed`)
}

writeStreem.end();
