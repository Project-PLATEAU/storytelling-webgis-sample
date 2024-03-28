import { createContext, useContext, useState, FC, PropsWithChildren } from "react";

import { Sound } from "../utils/types/common";

type SoundType = Sound | null;
type SoundContextType = {
  sound: SoundType;
  setSound: React.Dispatch<React.SetStateAction<SoundType>>;
};

const SoundContext = createContext<SoundContextType>({
  sound: null,
  setSound: () => {},
});

export const SoundProvider: FC<PropsWithChildren> = ({ children }) => {
  const [sound, setSound] = useState<SoundType>(null);

  return <SoundContext.Provider value={{ sound, setSound }}>{children}</SoundContext.Provider>;
};

export const useSoundContext = () => useContext(SoundContext);
