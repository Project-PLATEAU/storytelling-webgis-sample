import { FC, useEffect, useRef } from "react";

import { useSoundContext } from "../contexts/SoundContexts";

export const BGMContainer: FC = () => {
  const { sound } = useSoundContext();
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (sound === "on" && audioRef.current) {
      audioRef.current.volume = 0.1;
      audioRef.current.play();
    } else {
      audioRef.current?.pause();
    }
  }, [sound]);

  return <audio ref={audioRef} src="music/bgm.wav" hidden loop />;
};
