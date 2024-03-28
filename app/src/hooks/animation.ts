import { useEffect, useRef, useState } from "react";

import { useRefValue } from "./ref";

export const useHideAnimation = <S>(
  state: S,
  timeout: number,
  avoidUpdateIfStateIsSame: boolean = false,
) => {
  const [nextState, setNextState] = useState(state);
  const [hide, setHide] = useState(false);
  const timeoutRef = useRef(timeout);
  timeoutRef.current = timeout;
  const prevStateRef = useRef(state);
  useEffect(() => {
    if (avoidUpdateIfStateIsSame && prevStateRef.current === state) {
      return;
    }
    prevStateRef.current = state;
    setHide(true);
    const timer = window.setTimeout(() => {
      setNextState(state);
      setHide(false);
    }, timeoutRef.current);
    return () => window.clearTimeout(timer);
  }, [state, avoidUpdateIfStateIsSame, prevStateRef]);

  return {
    value: nextState,
    hide,
  };
};

export const useFrameTime = (offset: number = 500, playing: boolean = true) => {
  const [time, setTime] = useState(0);
  const offsetRef = useRefValue(offset);
  const playingRef = useRefValue(playing);
  useEffect(() => {
    if (!playing) return;

    let timer: number;
    let start: number;

    const run = (time: number) => {
      if (!playingRef.current) {
        cancelAnimationFrame(timer);
        return;
      }
      if (!start) {
        start = time;
      }
      setTime(prev => {
        return playingRef.current ? (time - start) / offsetRef.current : prev;
      });
      timer = requestAnimationFrame(run);
    };
    timer = requestAnimationFrame(run);
    return () => cancelAnimationFrame(timer);
  }, [offsetRef, playingRef, playing]);

  return time;
};
