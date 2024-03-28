import { styled } from "@linaria/react";
import { ISourceOptions } from "@tsparticles/engine";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { useEffect, useMemo, useState } from "react";

import { loadSlim } from "./loadPreset";

type Props = {
  show?: boolean;
  backgroundColor?: string;
  backgroundOpacity?: number;
  particleColor?: string;
  delay?: number;
};

export const ParticleOverlay: React.FC<Props> = ({
  show = true,
  backgroundOpacity,
  backgroundColor,
  particleColor,
  delay,
}) => {
  const [init, setInit] = useState(false);
  const [delayedShow, setDelayedShow] = useState(show);

  useEffect(() => {
    initParticlesEngine(async engine => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDelayedShow(show);
    }, delay);
    return () => {
      window.clearTimeout(timer);
    };
  }, [show, delay]);

  const options: ISourceOptions = useMemo(
    () => ({
      background: {
        color: {
          value: backgroundColor ?? "#000",
        },
        opacity: backgroundOpacity ?? 1,
      },
      autoPlay: true,
      clear: true,
      defaultThemes: {},
      delay: 0,
      fullScreen: { enable: true, zIndex: 0 },
      detectRetina: true,
      duration: 0,
      fpsLimit: 120,
      manualParticles: [],
      particles: {
        bounce: { horizontal: { value: 1 }, vertical: { value: 1 } },
        color: {
          value: particleColor ?? "#fff",
        },
        effect: { close: true, fill: true, options: {}, type: [] },
        groups: {},
        move: {
          angle: { offset: 0, value: 90 },
          attract: { distance: 200, enable: false, rotate: { x: 3000, y: 3000 } },
          center: { x: 50, y: 50, mode: "percent", radius: 0 },
          decay: 0,
          distance: {},
          direction: "none",
          drift: 0,
          enable: true,
          gravity: { acceleration: 9.81, enable: false, inverse: false, maxSpeed: 50 },
          path: { clamp: true, delay: { value: 0 }, enable: false, options: {} },
          outModes: { default: "out" },
          random: false,
          size: false,
          speed: { min: 0.1, max: 1 },
          spin: { acceleration: 0, enable: false },
          straight: false,
          trail: { enable: false, length: 10, fill: {} },
          vibrate: false,
          warp: false,
        },
        number: {
          density: { enable: true, width: 1920, height: 1080 },
          limit: { mode: "delete", value: 0 },
          value: 1000,
        },
        opacity: {
          value: { min: 0.1, max: 1 },
          animation: {
            count: 0,
            enable: true,
            speed: 2,
            decay: 0,
            delay: 0,
            sync: false,
            mode: "auto",
            startValue: "random",
            destroy: "none",
          },
        },
        size: {
          value: { min: 0.1, max: 2 },
          animation: {
            count: 0,
            enable: true,
            speed: 1,
            decay: 0,
            delay: 0,
            sync: false,
            mode: "auto",
            startValue: "random",
            destroy: "none",
          },
        },
        reduceDuplicates: false,
        shape: { close: true, fill: true, options: {}, type: "circle" },
        zIndex: { value: 0, opacityRate: 1, sizeRate: 1, velocityRate: 1 },
        destroy: {
          bounds: {},
          mode: "none",
          split: {
            count: 1,
            factor: { value: 3 },
            rate: { value: { min: 4, max: 9 } },
            sizeOffset: true,
          },
        },
      },
      pauseOnBlur: true,
      pauseOnOutsideViewport: true,
      responsive: [],
      smooth: false,
      style: {},
      themes: [],
      zLayers: 100,
      motion: { disable: false, reduce: { factor: 4, value: true } },
    }),
    [backgroundColor, backgroundOpacity, particleColor],
  );

  if (init) {
    return (
      <Root show={delayedShow}>
        <Particles id="tsparticles" options={options} />;
      </Root>
    );
  }

  return;
};

const Root = styled.div<{ show: boolean }>`
  transition: opacity 300ms ease-out;
  opacity: ${({ show }) => (show ? 1 : 0)};
`;
