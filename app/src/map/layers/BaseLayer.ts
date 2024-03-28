import { MapViewState } from "@deck.gl/core/typed";

import { Feature, Cursor } from "../../utils";
import { RenderLayer } from "../RenderLayers";

export type BaseLayer<T extends { id: string; type: string }> = T & {
  show?: boolean;
  hide?: boolean;
  pickable?: boolean;
  animation?: {
    startDuration?: number;
    endDuration?: number;
  };
  delayForNextSubScene?: number;
  inHiddenAnimation?: boolean;
};
export type BaseLayerProps<T> = T & LayerEventProps;

export type LayerEventProps = {
  onLayerAdd?: (l: RenderLayer) => void;
  onLayerRemove?: (l: RenderLayer) => void;
  onUpdateViewState?: (
    viewState: Partial<MapViewState> | ((v: Partial<MapViewState>) => Partial<MapViewState>),
  ) => void;
  onSelectFeature?: (feature?: Feature) => void;
  selectedFeature?: Feature;
  onChangeCursor?: (cursor: Cursor) => void;
};
