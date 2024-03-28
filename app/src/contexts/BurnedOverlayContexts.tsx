import { createContext, useContext, useState, FC, PropsWithChildren } from "react";

type BurnedOverlayContextType = {
  isInBurnedOverlay: boolean;
  setIsInBurnedOverlay: React.Dispatch<React.SetStateAction<boolean>>;
};

const BurnedOverlayContext = createContext<BurnedOverlayContextType>({
  isInBurnedOverlay: false,
  setIsInBurnedOverlay: () => {},
});

export const BurnedOverlayProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isInBurnedOverlay, setIsInBurnedOverlay] = useState(false);
  return (
    <BurnedOverlayContext.Provider value={{ isInBurnedOverlay, setIsInBurnedOverlay }}>
      {children}
    </BurnedOverlayContext.Provider>
  );
};

export const useBurnedOverlayContext = () => useContext(BurnedOverlayContext);
