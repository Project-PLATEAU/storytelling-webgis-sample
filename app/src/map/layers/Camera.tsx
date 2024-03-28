import { MapViewState } from "@deck.gl/core/typed";
import { easeLinear } from "d3-ease";
import { FC, useCallback, useEffect, useRef, useState } from "react";

import { animate } from "../../utils";

import { BaseLayer, BaseLayerProps } from "./BaseLayer";

export type CameraLayer = BaseLayer<{
  id: string;
  type: "camera";
  viewState?: Partial<MapViewState>;
  enableInfiniteRotation?: boolean;
  rotationSpeed?: number;
  delay?: number;
}>;

export type CameraProps = BaseLayerProps<CameraLayer>;

const useRefValue = <V,>(v: V) => {
  const vRef = useRef(v);
  vRef.current = v;
  return vRef;
};

export const Camera: FC<CameraProps> = ({
  id,
  viewState,
  enableInfiniteRotation,
  rotationSpeed = 1000,
  show = true,
  delay,
  onUpdateViewState,
}) => {
  const [initialized, setInitialized] = useState(false);
  const shouldStopRef = useRef(false);

  useEffect(() => {
    shouldStopRef.current = false;
    return () => {
      shouldStopRef.current = true;
    };
  }, [id]);

  const enableInfiniteRotationRef = useRefValue(enableInfiniteRotation);
  const showRef = useRefValue(show);
  const onUpdateViewStateRef = useRefValue(onUpdateViewState);

  const rotate = useCallback(() => {
    animate(rotationSpeed, easeLinear, next => {
      if (!enableInfiniteRotationRef.current || shouldStopRef.current || !showRef.current)
        return false;
      onUpdateViewStateRef.current?.(prev => ({
        bearing: ((prev.bearing ?? 0) + 0.05) % 360,
      }));
      if (next === 1) {
        rotate();
      }
    });
  }, [rotationSpeed, enableInfiniteRotationRef, showRef, onUpdateViewStateRef]);

  useEffect(() => {
    if (!enableInfiniteRotationRef.current || !initialized) return;
    rotate();
  }, [rotate, enableInfiniteRotationRef, initialized]);

  const initializedRef = useRefValue(initialized);
  useEffect(() => {
    if (!viewState) {
      setInitialized(true);
      return;
    }
    if (!show || initializedRef.current) return;
    let timer: number;
    let initializedTimer: number;
    if (delay) {
      timer = window.setTimeout(() => {
        onUpdateViewState?.(viewState);
        initializedTimer = window.setTimeout(
          () => {
            setInitialized(true);
          },
          Number(viewState.transitionDuration) || 0,
        );
      }, delay);
    } else {
      onUpdateViewState?.(viewState);
      initializedTimer = window.setTimeout(
        () => {
          setInitialized(true);
        },
        Number(viewState.transitionDuration) || 0,
      );
    }
    return () => {
      clearTimeout(initializedTimer);
      clearTimeout(timer);
    };
  }, [onUpdateViewState, viewState, show, delay, initializedRef]);

  const prevShow = useRef(show);
  useEffect(() => {
    if (show !== prevShow.current) {
      setInitialized(false);
    }
  }, [show]);

  return null;
};
