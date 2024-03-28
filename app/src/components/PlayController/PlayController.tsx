import { styled } from "@linaria/react";
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";

import { breakpointMediaQueries } from "../../constants";
import { useRefValue } from "../../hooks";
import { PlayBack } from "../icons/PlayBack";
import { PlayNext } from "../icons/PlayNext";
import { PlayButton } from "../PlayButton";
import { RoundButton } from "../RoundButton";

export type StepState = "main" | "content";

export type StepItem = {
  name?: string;
  duration: number;
  contents: Omit<StepItem, "contents">[];
};

type PlayControllerProps = {
  steps: Omit<StepItem, "duration">[];
  currentMainStepIndex?: number;
  currentContentStepIndex?: number;
  isPlaying?: boolean;
  onChangeStep?: (currentMainStepIndex: number, currentContentStepIndex: number) => void;
  onClickPlayButton?: () => void;
  onClick?: () => void;
};

const useSteps = ({
  steps,
  currentMainStepIndexProps,
  currentContentStepIndexProps,
  isPlaying,
}: {
  steps: Omit<StepItem, "duration">[];
  currentMainStepIndexProps?: number;
  currentContentStepIndexProps?: number;
  isPlaying: boolean;
}) => {
  const [currentMainStepIndex, setCurrentMainStepIndex] = useState<number>(0);
  const [currentContentStepIndex, setCurrentContentStepIndex] = useState<number>(0);

  const [isConrtolling, setIsControlling] = useState(false);

  const handleControllable = useCallback((cb: () => void) => {
    setIsControlling(true);
    setTimeout(cb, 100);
  }, []);

  const handleNextStep = useCallback(() => {
    if (currentMainStepIndex === undefined) return;
    const step = steps[currentMainStepIndex];
    const nextMainStepIndex = currentMainStepIndex + 1;
    if (!step) return;

    const updateMainStep = (nextStep: number) => {
      setCurrentMainStepIndex(Math.max(nextStep, 0));
    };
    const updateContentStep = (nextStep: number) => {
      setCurrentContentStepIndex(Math.max(nextStep, 0));
    };

    if (currentContentStepIndex === step.contents.length) {
      handleControllable(() => {
        updateMainStep(nextMainStepIndex);
        updateContentStep(0);
      });
      return;
    }
    if (currentContentStepIndex === undefined) {
      return;
    }

    const nextContentStepIndex = currentContentStepIndex + 1;
    const nextContent = step.contents[nextContentStepIndex];
    if (!step.contents.length || !nextContent) {
      handleControllable(() => {
        updateMainStep(nextMainStepIndex);
        updateContentStep(0);
      });
      return;
    }
    if (step.contents.length === nextContentStepIndex) {
      handleControllable(() => {
        updateMainStep(currentMainStepIndex);
        updateContentStep(0);
      });
      return;
    }

    handleControllable(() => {
      updateContentStep(nextContentStepIndex);
    });
  }, [currentMainStepIndex, currentContentStepIndex, steps, handleControllable]);

  const handlePrevStep = useCallback(() => {
    if (currentMainStepIndex === undefined) return;
    const step = steps[currentMainStepIndex];
    const nextMainStepIndex = currentMainStepIndex - 1;
    const nextStep = steps[nextMainStepIndex];
    if (!step && !nextStep) return;

    const contentStepLength = 1;

    const updateMainStep = (nextStep: number) => {
      setCurrentMainStepIndex(Math.max(nextStep, 0));
    };
    const updateContentStep = (nextStep: number) => {
      setCurrentContentStepIndex(Math.max(nextStep, 0));
    };

    if (steps.length === currentMainStepIndex) {
      handleControllable(() => {
        updateMainStep(nextMainStepIndex);
        updateContentStep(nextStep.contents.length - 1);
      });
      return;
    }

    if (nextStep && currentContentStepIndex === 0) {
      handleControllable(() => {
        updateMainStep(nextMainStepIndex);
        updateContentStep(nextStep.contents.length - 1);
      });
      return;
    }
    const nextContentStepIndex = currentContentStepIndex - contentStepLength;
    const nextContent = step?.contents[nextContentStepIndex];
    if (!nextContent) {
      handleControllable(() => {
        updateMainStep(currentMainStepIndex - 1);
        updateContentStep(0);
      });
      return;
    }

    handleControllable(() => {
      updateContentStep(nextContentStepIndex);
    });
  }, [currentMainStepIndex, currentContentStepIndex, steps, handleControllable]);

  useEffect(() => {
    if (currentMainStepIndexProps === undefined && currentContentStepIndexProps === undefined)
      return;
    handleControllable(() => {
      if (currentMainStepIndexProps !== undefined) {
        setCurrentMainStepIndex(currentMainStepIndexProps);
      }
      if (currentContentStepIndexProps !== undefined) {
        setCurrentContentStepIndex(currentContentStepIndexProps);
      }
    });
  }, [currentMainStepIndexProps, currentContentStepIndexProps, handleControllable]);

  useEffect(() => {
    if (currentMainStepIndex === undefined || !isPlaying) return;

    const step = steps[currentMainStepIndex];
    if (!step) return;
    const contents = step.contents;
    const content =
      currentContentStepIndex !== undefined ? contents[currentContentStepIndex] : undefined;

    let timer: number;

    if (content) {
      timer = window.setTimeout(() => {
        if (
          currentContentStepIndex !== undefined &&
          currentContentStepIndex + 1 === contents.length
        ) {
          setCurrentMainStepIndex(i => (i ?? 0) + 1);
          setCurrentContentStepIndex(0);
        } else {
          setCurrentContentStepIndex(i => (contents.length - 1 !== i ? (i ?? 0) + 1 : i));
        }
      }, content.duration);
    }

    return () => {
      window.clearTimeout(timer);
    };
  }, [currentContentStepIndex, currentMainStepIndex, steps, isPlaying]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsControlling(false);
    }, 500);
    return () => window.clearTimeout(timer);
  }, [isConrtolling]);

  return {
    currentMainStepIndex,
    currentContentStepIndex,
    handleNextStep,
    handlePrevStep,
    isConrtolling,
  };
};

export const PlayController: React.FC<PlayControllerProps> = ({
  steps,
  currentMainStepIndex: currentMainStepIndexProps,
  currentContentStepIndex: currentContentStepIndexProps,
  isPlaying: initialIsPlaying = true,
  onChangeStep,
  onClickPlayButton,
  onClick,
}) => {
  const [isPlaying, setIsPlaying] = useState(initialIsPlaying);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    setIsPlaying(initialIsPlaying);
  }, [initialIsPlaying]);

  const handleOnPlay = useCallback(() => {
    setIsPlaying(v => !v);
    onClickPlayButton?.();
  }, [onClickPlayButton]);

  const {
    currentMainStepIndex,
    currentContentStepIndex,
    isConrtolling,
    handleNextStep,
    handlePrevStep,
  } = useSteps({
    steps,
    currentMainStepIndexProps,
    currentContentStepIndexProps,
    isPlaying,
  });

  const handleOnClickPlayButton = useCallback(() => {
    onClick?.();
    handleOnPlay();
  }, [handleOnPlay, onClick]);
  const handleOnClickPlayNextButton = useCallback(() => {
    onClick?.();
    handleNextStep();
  }, [handleNextStep, onClick]);
  const handleOnClickPlayPrevButton = useCallback(() => {
    onClick?.();
    handlePrevStep();
  }, [handlePrevStep, onClick]);

  const onChangeStepRef = useRefValue(onChangeStep);
  const initializedRef = useRefValue(initialized);
  useEffect(() => {
    if (!initializedRef.current) return;
    onChangeStepRef.current?.(currentMainStepIndex, currentContentStepIndex);
  }, [onChangeStepRef, currentMainStepIndex, currentContentStepIndex, initializedRef]);

  const currentContents = useMemo(
    () => steps[currentMainStepIndex]?.contents ?? [],
    [steps, currentMainStepIndex],
  );

  const progress = useMemo(() => {
    const playing = !isConrtolling && isPlaying;
    const addtional = playing ? 1 : 0;
    const currentMainStepProgress =
      currentContents.length <= 1 ? currentMainStepIndex + addtional : currentMainStepIndex;
    const movementOfProgress = currentContentStepIndex + addtional;
    const currentContentStepProgress =
      currentContents.length > 1 ? movementOfProgress / currentContents.length : 0;
    const next = currentMainStepProgress + currentContentStepProgress;
    return initialized ? Math.max(Math.min(next / steps.length, 1), 0) : 0;
  }, [
    currentMainStepIndex,
    currentContentStepIndex,
    steps,
    currentContents,
    isPlaying,
    isConrtolling,
    initialized,
  ]);

  const currentDuration = useMemo(() => {
    const currentContent = currentContents[currentContentStepIndex];
    return currentContent?.duration ?? 0;
  }, [currentContentStepIndex, currentContents]);

  useLayoutEffect(() => {
    requestAnimationFrame(() => {
      setInitialized(true);
    });
  }, []);

  return (
    <Root>
      <ButtonController>
        <div id="playBackButton">
          <RoundButton onClick={handleOnClickPlayPrevButton}>
            <PlayBackIcon />
          </RoundButton>
        </div>
        <div id="playButton">
          <PlayButton active={isPlaying} onClick={handleOnClickPlayButton} />
        </div>
        <div id="playNextButton">
          <RoundButton onClick={handleOnClickPlayNextButton}>
            <PlayNextIcon />
          </RoundButton>
        </div>
      </ButtonController>
      <ProgressRoot id="timeSequence">
        <ProgressBarBase />
        <ProgressBarActual
          duration={isPlaying && !isConrtolling ? currentDuration : 0}
          style={{ transform: `scaleX(${progress})` }}
        />
        <ProgressGrid mainStepLength={steps.length}>
          {steps.map((mainStep, i) => (
            <MainStep key={i}>
              <MainStepBox>{mainStep.name ?? String(i).padStart(2, "0")}</MainStepBox>
              <MainStepGrid contentStepLength={mainStep.contents.length}>
                {mainStep.contents.map((_, i) => (
                  <ContentStep key={i} />
                ))}
              </MainStepGrid>
            </MainStep>
          ))}
        </ProgressGrid>
      </ProgressRoot>
    </Root>
  );
};

const Root = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
`;

const PlayBackIcon = styled(PlayBack)`
  aspect-ratio: 13 / 18;
  width: 100%;
  margin-left: -5px;
  ${breakpointMediaQueries.md} {
    width: 14px;
    margin-left: -3px;
  }
`;
const PlayNextIcon = styled(PlayNext)`
  aspect-ratio: 13 / 18;
  width: 100%;
  margin-right: -5px;
  ${breakpointMediaQueries.md} {
    width: 14px;
    margin-right: -3px;
  }
`;

const ButtonController = styled.div`
  display: flex;
  gap: 10px;
  margin-right: 28px;

  ${breakpointMediaQueries.md} {
    margin-right: 10px;
    gap: 5px;
  }
`;

const ProgressRoot = styled.div`
  position: relative;
  height: 36px;
  width: 100%;
`;

const ProgressBarBase = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 5px;
  height: 10px;
  background: #fff;
  box-sizing: border-box;
`;

const ProgressBarActual = styled(ProgressBarBase)<{ duration: number }>`
  --duration: ${({ duration }) => `${duration}ms`};
  transition: transform var(--duration) linear;
  transform-origin: left;
  transform: scaleX(0);
  background: #ebf000;
  box-sizing: border-box;
`;

const ProgressGrid = styled.div<{ mainStepLength: number }>`
  --main-steps: ${({ mainStepLength }) => mainStepLength};
  display: grid;
  grid-template-columns: repeat(var(--main-steps), 1fr);
  position: relative;
  width: 100%;
  height: 100%;
`;

const MainStep = styled.div`
  --step-box-width: 18px;
  --step-box-height: 14px;

  display: flex;
  position: relative;
  box-sizing: border-box;
  padding-left: var(--step-box-width);
  padding-top: var(--step-box-height);
  border-left: 1px solid #463c64;
  align-items: end;
`;

const MainStepBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: calc(var(--step-box-width) / 2 * -1);
  top: 0;
  width: var(--step-box-width);
  height: var(--step-box-height);
  background-color: #463c64;
  font-size: 10px;
  color: #ffffff;
`;

const MainStepGrid = styled.div<{ contentStepLength: number }>`
  --content-steps: ${({ contentStepLength }) => contentStepLength};
  display: grid;
  grid-template-columns: repeat(var(--content-steps), 1fr);
  position: relative;
  margin-left: calc(var(--step-box-width) * -1);
  width: calc(100% + var(--step-box-width));
  height: 10px;
  margin-bottom: 5px;
`;

const ContentStep = styled.div`
  border-right: 1px solid #463c64;
  &:nth-last-of-type(1) {
    border-right: none;
  }
`;
