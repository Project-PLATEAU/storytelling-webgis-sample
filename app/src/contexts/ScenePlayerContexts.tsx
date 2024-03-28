import { createContext, useContext, useState, FC, PropsWithChildren, useCallback } from "react";

type SoundContextType = {
  playing: boolean;
  shouldSceneDescriptioShow: boolean;
  play: () => void;
  stop: () => void;
  toggle: () => void;
  setShouldSceneDescriptionShow: (show: boolean) => void;
};

const ScenePlayerContext = createContext<SoundContextType>({
  playing: true,
  shouldSceneDescriptioShow: false,
  play: () => {},
  stop: () => {},
  toggle: () => {},
  setShouldSceneDescriptionShow: () => {},
});

export const ScenePlayerProvider: FC<PropsWithChildren> = ({ children }) => {
  const [playing, setPlaying] = useState(true);
  const [shouldSceneDescriptioShow, setShouldSceneDescriptionShow] = useState(false);

  const play = useCallback(() => {
    setPlaying(true);
  }, []);

  const stop = useCallback(() => {
    setPlaying(false);
  }, []);

  const toggle = useCallback(() => {
    setPlaying(v => !v);
  }, []);

  return (
    <ScenePlayerContext.Provider
      value={{
        playing,
        shouldSceneDescriptioShow,
        setShouldSceneDescriptionShow,
        play,
        stop,
        toggle,
      }}>
      {children}
    </ScenePlayerContext.Provider>
  );
};

export const useScenePlayerContext = () => useContext(ScenePlayerContext);
