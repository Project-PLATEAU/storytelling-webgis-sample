import { COORDINATE_SYSTEM, FilterContext } from "@deck.gl/core/typed";
import { Tile3DLayer, Tile3DLayerProps } from "@deck.gl/geo-layers/typed";
import { ScenegraphLayer } from "@deck.gl/mesh-layers/typed";
import { Tileset3D, Tile3D } from "@loaders.gl/tiles";
import GL from "@luma.gl/constants";
import { FC, useCallback, useEffect } from "react";

import { compareValues, ComparisonType } from "../../utils/compareValues";
import { RenderLayer } from "../RenderLayers";

import { BaseLayer, BaseLayerProps } from "./BaseLayer";
import { MATRIX_ATTRIBUTES } from "./utils/matrix";

type TileFilterFunction = (tile: Tile3D) => boolean;
interface CustomTile3DLayerProps extends Tile3DLayerProps {
  tileFilter: TileFilterFunction;
}
type FilterCondition = {
  key: string;
  value: unknown;
  comparisonType: ComparisonType;
};

const getColorBasedOnHeight = (height: number): [number, number, number, number] => {
  let color: [number, number, number, number];
  if (height <= 50) {
    color = [193, 194, 236, 255];
  } else if (height > 50 && height <= 100) {
    color = [185, 224, 233, 255];
  } else {
    color = [255, 248, 13, 255];
  }
  return color;
};

class CustomSceneGraphLayer extends ScenegraphLayer {
  initializeState() {
    const attributeManager = this.getAttributeManager();
    // attributeManager is always defined for primitive layers
    attributeManager?.addInstanced({
      instancePositions: {
        size: 3,
        type: GL.DOUBLE,
        fp64: this.use64bitPositions(),
        accessor: "getPosition",
        transition: true,
      },
      instanceColors: {
        type: GL.UNSIGNED_BYTE,
        size: this.props.colorFormat.length,
        accessor: instance => {
          const height = instance["bldg:measuredHeight"]
            .map((h: string) => Number(h))
            .reduce((a: number, b: number) => Math.min(a, b));
          return getColorBasedOnHeight(height);
        },
        normalized: true,
        defaultValue: [255, 255, 255, 255],
        transition: true,
      },
      instanceModelMatrix: MATRIX_ATTRIBUTES,
    });
  }
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
class CustomTile3DLayer extends Tile3DLayer {
  private tileFilter: TileFilterFunction;

  constructor(props: CustomTile3DLayerProps) {
    super(props);
    this.tileFilter = props.tileFilter;
  }

  _make3DModelLayer(tileHeader: any) {
    const { gltf, cartographicOrigin, modelMatrix, batchTableJson } = tileHeader.content;

    const SubLayerClass = this.getSubLayerClass("scenegraph", CustomSceneGraphLayer);

    return new SubLayerClass(
      {
        _lighting: "flat",
      },
      this.getSubLayerProps({
        id: "scenegraph",
      }),
      {
        id: `${this.id}-scenegraph-${tileHeader.id}`,
        tile: tileHeader,
        data: [batchTableJson] || [0],
        scenegraph: gltf,
        coordinateSystem: COORDINATE_SYSTEM.METER_OFFSETS,
        coordinateOrigin: cartographicOrigin,
        modelMatrix,
        getTransformMatrix: (instance: any) => instance.modelMatrix,
        getPosition: [0, 0, 0],
        _offset: 0,
      },
    );
  }

  filterSubLayer(context: FilterContext): boolean {
    const shouldRender = super.filterSubLayer(context);
    if (!shouldRender) return false;

    const tile = (context.layer.props as any).tile;
    if (!tile) return false;

    return this.tileFilter(tile);
  }
}

export type TilesetLayer = BaseLayer<{
  id: string;
  type: "tileset";
  url: string;
  onTilesetLoad?: (tileset: Tileset3D) => void;
  filterConditions?: FilterCondition[];
}>;

export type TilesetProps = BaseLayerProps<TilesetLayer>;

export const Tileset: FC<TilesetProps> = ({
  id,
  url,
  onLayerAdd,
  onLayerRemove,
  onTilesetLoad,
  filterConditions = [],
}) => {
  const handleOnTilesetLoad = useCallback(
    (tileset: Tileset3D) => {
      onTilesetLoad?.(tileset);
    },
    [onTilesetLoad],
  );

  const tileFilter = useCallback(
    (tile: Tile3D) => {
      if (!tile.content?.batchTableJson || filterConditions.length === 0) {
        return true;
      }

      return filterConditions.every(condition => {
        const tilePropertyValue = tile.content.batchTableJson[condition.key];

        const propertyValue = Array.isArray(tilePropertyValue)
          ? tilePropertyValue[0]
          : tilePropertyValue;

        return compareValues(propertyValue, condition.value, condition.comparisonType);
      });
    },
    [filterConditions],
  );

  useEffect(() => {
    const layer = new CustomTile3DLayer({
      id,
      // tileset json file url
      data: url,
      onTilesetLoad: handleOnTilesetLoad,
      pickable: true,
      _subLayerProps: {
        scenegraph: {
          _lighting: "pbr",
          material: {
            ambient: 1,
            diffuse: 1,
            shininess: 0,
            specularColor: [0, 0, 0],
          },
        },
      },
      tileFilter,
    }) as unknown as RenderLayer;
    onLayerAdd?.(layer);
    return () => onLayerRemove?.(layer);
  }, [id, url, onLayerAdd, onLayerRemove, handleOnTilesetLoad, tileFilter]);

  return null;
};
