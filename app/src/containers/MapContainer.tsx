import { MapViewState } from "@deck.gl/core/typed";
import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ViewState } from "react-map-gl";

import { useNavigationContext } from "../contexts/NavigationContexts";
import { useScenePlayerContext } from "../contexts/ScenePlayerContexts";
import { useRefValue } from "../hooks";
import { LayerData } from "../layers";
import { Map, MapRef } from "../map";
import { wait } from "../utils";
import { MainScenes, OpeningScenes, PageName } from "../utils/types/common";

type Props = {
  initialLayers: LayerData[];
  isReportOpen: boolean;
  isBreakpointMd: boolean;
  onViewStateChange?: (viewState: MapViewState) => void;
  onSelectFeature?: () => void;
  viewState?: Partial<ViewState>;
  onWaitNextSceneStart?: () => void;
  onWaitNextSceneEnd?: () => void;
  onChangeScene?: (currentScene: OpeningScenes | MainScenes) => void;
};

export const WAIT_ANIMATION = 1000;

export const MapContainer = forwardRef<MapRef, Props>(function MapContainerPresenter(
  {
    initialLayers,
    isReportOpen,
    isBreakpointMd,
    onViewStateChange,
    onSelectFeature,
    viewState,
    onWaitNextSceneStart,
    onWaitNextSceneEnd,
    onChangeScene,
  },
  ref,
) {
  const { navigationState } = useNavigationContext();
  const { playing } = useScenePlayerContext();
  const playingRef = useRefValue(playing);
  const currentScene = navigationState.currentScene;
  const currentSubScene = navigationState.currentSubScene;
  const currentSceneContentIndex = navigationState.currentSceneContentIndex;

  const [filteredLayers, setFilteredLayers] = useState<LayerData[]>([]);

  const prevFilteredLayers = useRef<LayerData[]>([]);
  prevFilteredLayers.current = filteredLayers;
  const prevCurrentScene = useRef<typeof currentScene>();
  const prevCurrentSubScene = useRef(currentSubScene);
  const prevCurrentSceneContentIndex = useRef(currentSceneContentIndex);

  const onWaitNextSceneStartRef = useRefValue(onWaitNextSceneStart);
  const onWaitNextSceneEndRef = useRefValue(onWaitNextSceneEnd);

  const sceneTimerRef = useRef<number>();
  const prevMaxAnimationDuration = useRef<number>();

  const updateNextScene = useCallback(
    (shouldWait = true) => {
      return window.setTimeout(
        () => {
          sceneTimerRef.current = undefined;
          prevMaxAnimationDuration.current = undefined;
          onWaitNextSceneEndRef.current?.();
          setFilteredLayers(
            initialLayers
              .filter(layer => layer.scene.includes(currentScene))
              .map(layer => {
                return layer.subScene && !layer.subScene.includes(currentSubScene)
                  ? { ...layer, hide: true }
                  : layer;
              })
              .filter(
                layer =>
                  layer.contentIndex === undefined ||
                  layer.contentIndex === currentSceneContentIndex ||
                  layer.contentIndexToDisableAnimation === currentSceneContentIndex,
              )
              .map(l =>
                l.contentIndexToDisableAnimation === currentSceneContentIndex
                  ? { ...l, inHiddenAnimation: true }
                  : { ...l, inHiddenAnimation: false },
              ),
          );
          onChangeScene?.(currentScene);
        },
        shouldWait ? prevMaxAnimationDuration.current ?? 0 : 0,
      );
    },
    [
      currentScene,
      currentSubScene,
      currentSceneContentIndex,
      onChangeScene,
      onWaitNextSceneEndRef,
      initialLayers,
    ],
  );

  const isSceneChangedRef = useRef(false);

  // For scene
  useEffect(() => {
    const update = async () => {
      const isSceneChanged = !prevCurrentScene.current || prevCurrentScene.current !== currentScene;
      const isSubSceneChanged = !isSceneChanged && prevCurrentSubScene.current !== currentSubScene;
      const isSceneContentIndexChanged =
        prevCurrentSceneContentIndex.current !== currentSceneContentIndex;

      if (isSceneChanged || isSceneContentIndexChanged) {
        if (!isSceneContentIndexChanged) {
          prevMaxAnimationDuration.current = prevFilteredLayers.current.reduce(
            (max, layer) =>
              Math.max(
                max,
                playingRef.current
                  ? layer.animation?.endDuration ?? layer.animation?.startDuration ?? 0
                  : 0,
              ),
            0,
          );
          prevMaxAnimationDuration.current =
            prevMaxAnimationDuration.current === 0
              ? 0
              : prevMaxAnimationDuration.current + WAIT_ANIMATION;

          const nextHiddenLayers = prevFilteredLayers.current.map(l =>
            (!l.subScene || l.subScene.includes(currentSubScene)) &&
            l.contentIndex !== currentSceneContentIndex &&
            l.contentIndexToDisableAnimation !== currentSceneContentIndex
              ? { ...l, show: false }
              : { ...l, inHiddenAnimation: true },
          );

          setFilteredLayers(nextHiddenLayers);

          // Wait until closing animation finishes
          onWaitNextSceneStartRef.current?.();
        }
        const timer = updateNextScene();
        sceneTimerRef.current = timer;
        isSceneChangedRef.current = true;
      }
      prevCurrentScene.current = currentScene;
      prevCurrentSceneContentIndex.current = currentSceneContentIndex;

      if (isSubSceneChanged) {
        const maxAnimationDuration = prevFilteredLayers.current.reduce(
          (max, layer) =>
            Math.max(
              max,
              layer.delayForNextSubScene ??
                (layer.subScene
                  ? layer.animation?.endDuration ?? layer.animation?.startDuration
                  : 0) ??
                0,
            ),
          0,
        );
        setFilteredLayers(layers =>
          layers.map(l =>
            l.subScene && !l.subScene.includes(currentSubScene) ? { ...l, show: false } : l,
          ),
        );
        // Wait until closing animation finishes
        if (maxAnimationDuration !== 0) {
          await wait(maxAnimationDuration + 500);
        }
        setFilteredLayers(layers =>
          layers.map(layer =>
            !layer.subScene || layer.subScene.includes(currentSubScene)
              ? { ...layer, show: true, hide: false }
              : layer,
          ),
        );
      }
      prevCurrentSubScene.current = currentSubScene;
    };
    update();
  }, [
    currentScene,
    currentSubScene,
    currentSceneContentIndex,
    onWaitNextSceneStartRef,
    updateNextScene,
    playingRef,
  ]);

  const isStoppedSceneTimer = useRef(false);
  useEffect(() => {
    if (isSceneChangedRef.current) {
      isSceneChangedRef.current = false;
      return;
    }
    if (!playing && !isStoppedSceneTimer.current) {
      window.clearTimeout(sceneTimerRef.current);
      isStoppedSceneTimer.current = true;
    }
    if (playing && isStoppedSceneTimer.current) {
      isStoppedSceneTimer.current = false;
      sceneTimerRef.current = updateNextScene();
    }
  }, [playing, updateNextScene]);

  const hasPickable = useMemo(() => filteredLayers.some(l => l.pickable), [filteredLayers]);

  // MEMO: Get data and inject the data to the component
  return (
    <Map
      initialViewState={viewState}
      ref={ref}
      pickable={hasPickable}
      layers={filteredLayers}
      isReportOpen={isReportOpen}
      isBreakpointMd={isBreakpointMd}
      isOpening={
        navigationState.currentPage === PageName.Opening &&
        navigationState.currentScene !== OpeningScenes.Scene6
      }
      onViewStateChange={onViewStateChange}
      onSelectFeature={onSelectFeature}
    />
  );
});
