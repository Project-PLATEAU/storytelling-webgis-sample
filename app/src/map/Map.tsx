import {
  AmbientLight,
  Layer as DeckLayer,
  FlyToInterpolator,
  LightingEffect,
  MapViewState,
  PickingInfo,
  _SunLight,
  DeckProps,
} from "@deck.gl/core/typed";
import { ViewStateChangeParameters } from "@deck.gl/core/typed/controllers/controller";
import DeckGl from "@deck.gl/react/typed";
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
  useEffect,
  useRef,
} from "react";
import Maplibre from "react-map-gl/maplibre";

import { useMarkerDataContext } from "../contexts/MarkerContexts";
import { Feature, Cursor } from "../utils";

import { CameraChangeEvent } from "./events";
import { Layer, LayerList } from "./LayerList";
import { RenderLayer } from "./RenderLayers";

const INITIAL_VIEW_STATE: Partial<MapViewState> = {
  longitude: 139.788877,
  latitude: 35.6943181,
  bearing: 360 * 0.2,
  pitch: 360 * 0.2,
  zoom: 12,
};
const MAP_STYLE = { width: "100vw", height: "100vh" };

type Props = {
  layers: Layer[];
  initialViewState?: Partial<MapViewState>;
  isOpening: boolean;
  isReportOpen: boolean;
  isBreakpointMd: boolean;
  pickable?: boolean;
  onViewStateChange?: (viewState: MapViewState) => void;
  onSelectFeature?: () => void;
  onClick?: DeckProps["onClick"];
};

export type MapRef = {
  zoom: (z: number) => void;
};

export const Map = forwardRef<MapRef, Props>(function MapPresenter(
  {
    layers,
    initialViewState = INITIAL_VIEW_STATE,
    isBreakpointMd,
    isOpening,
    pickable,
    onViewStateChange,
    onSelectFeature,
    onClick,
  },
  ref,
) {
  const [viewState, setViewState] = useState<Partial<MapViewState>>(initialViewState);
  const [displayedLayers, setDisplayedLayers] = useState<RenderLayer[]>([]);
  const [ready, setReady] = useState(false);
  const [onCameraChangeEvent] = useState(() => new CameraChangeEvent());

  const [selectedFeature, setSelectedFeature] = useState<Feature>();
  const handleSelectFeature = useCallback(
    (f?: Feature) => {
      onSelectFeature?.();
      setSelectedFeature(f);
    },
    [onSelectFeature],
  );

  const [cursor, setCursor] = useState<Cursor>("grab");
  const handleChangeCursor = useCallback((c: Cursor) => {
    setCursor(c);
  }, []);

  const { resetMarkerData } = useMarkerDataContext();

  const handleResetMarkerData = useCallback(
    (info?: PickingInfo) => {
      if (!info?.object) {
        setSelectedFeature(undefined);
        resetMarkerData();
      }
    },
    [resetMarkerData],
  );

  const handleLayerAdd = useCallback((l: RenderLayer) => setDisplayedLayers(v => [...v, l]), []);
  const handleLayerRemove = useCallback(
    (l: RenderLayer) =>
      setDisplayedLayers(v => {
        // TODO: Support nested layers
        const idx = v.findIndex(i =>
          i instanceof DeckLayer && l instanceof DeckLayer ? i.id === l.id : false,
        );
        return [...v.slice(0, idx), ...v.slice(idx + 1)];
      }),
    [],
  );

  const isCameraMovingRef = useRef(false);

  useEffect(() => {
    let timer: number;
    if (initialViewState.transitionDuration) {
      isCameraMovingRef.current = true;
      timer = window.setTimeout(() => {
        isCameraMovingRef.current = false;
      }, Number(initialViewState.transitionDuration));
    }
    return () => window.clearTimeout(timer);
  }, [initialViewState]);

  const handleUpdateViewState = useCallback(
    (
      nextViewState: Partial<MapViewState> | ((v: Partial<MapViewState>) => Partial<MapViewState>),
    ) => {
      if (isCameraMovingRef.current) return;
      setViewState(prev => {
        const next = typeof nextViewState === "function" ? nextViewState(prev) : nextViewState;
        return { ...prev, ...next };
      });
    },
    [],
  );

  const onReady = useCallback(() => {
    setReady(true);
  }, []);

  const handleViewStateChange = useCallback(
    ({ viewState }: ViewStateChangeParameters) => {
      const next = {
        ...viewState,
        transitionInterpolator: undefined,
      } as MapViewState;
      setViewState(next);
      onViewStateChange?.(next);
    },
    [onViewStateChange],
  );

  const effects = useMemo(() => {
    const now = new Date();
    const sunTime = new Date(now.getFullYear(), now.getMonth(), now.getDay(), 15);
    const sun = new _SunLight({
      timestamp: sunTime,
      color: [255, 255, 255],
      intensity: 1.5,
    });
    const ambient = new AmbientLight({
      color: [255, 255, 255],
      intensity: 7,
    });
    return [new LightingEffect({ ambient, sun })];
  }, []);

  const zoomingTimer = useRef<number>();
  const zoom = useCallback((z: number) => {
    const ZOOM_DURATION = 300;
    if (zoomingTimer.current) {
      window.clearTimeout(zoomingTimer.current);
    }
    isCameraMovingRef.current = true;
    setViewState(v => ({
      ...v,
      zoom: (v.zoom ?? INITIAL_VIEW_STATE.zoom ?? 0) + z,
      transitionDuration: ZOOM_DURATION,
      transitionInterpolator: new FlyToInterpolator({ curve: 1 }),
    }));
    zoomingTimer.current = window.setTimeout(() => {
      isCameraMovingRef.current = false;
    }, ZOOM_DURATION);
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      zoom,
    }),
    [zoom],
  );

  useEffect(() => {
    setViewState(currentViewState => ({
      ...currentViewState,
      ...initialViewState,
    }));
  }, [initialViewState]);

  useEffect(() => {
    onCameraChangeEvent.viewState = viewState;
    window.dispatchEvent(onCameraChangeEvent);
  }, [onCameraChangeEvent, viewState]);

  return (
    <DeckGl
      viewState={viewState}
      style={MAP_STYLE}
      _pickable={!!pickable}
      onLoad={onReady}
      onViewStateChange={params => {
        handleViewStateChange(params);
        handleResetMarkerData();
      }}
      layers={displayedLayers}
      effects={effects}
      onClick={(i, e) => {
        onClick?.(i, e);
        handleResetMarkerData(i);
      }}
      onDragStart={handleResetMarkerData}
      controller={
        isBreakpointMd
          ? {
              touchRotate: true,
            }
          : {}
      }
      getCursor={() => cursor}>
      <Maplibre
        key={`${isOpening}`}
        mapStyle={isOpening ? "base-map/opening.json" : "base-map/main.json"}
        maxPitch={85}
        antialias>
        {ready && (
          <LayerList
            layers={layers}
            onLayerAdd={handleLayerAdd}
            onLayerRemove={handleLayerRemove}
            onUpdateViewState={handleUpdateViewState}
            selectedFeature={selectedFeature}
            onSelectFeature={handleSelectFeature}
            onChangeCursor={handleChangeCursor}
          />
        )}
      </Maplibre>
    </DeckGl>
  );
});
