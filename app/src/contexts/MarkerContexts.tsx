import { createContext, useContext, useState, FC, PropsWithChildren } from "react";

import { MarkerData } from "../utils/types/common";

type MarkerDataType = MarkerData | null;

type MarkerDataContextType = {
  markerData: MarkerDataType;
  setMarkerData: React.Dispatch<React.SetStateAction<MarkerDataType>>;
  resetMarkerData: () => void;
};

const MarkerDataContext = createContext<MarkerDataContextType>({
  markerData: null,
  setMarkerData: () => {},
  resetMarkerData: () => {},
});

export const MarkerDataProvider: FC<PropsWithChildren> = ({ children }) => {
  const [markerData, setMarkerData] = useState<MarkerDataType>(null);
  const resetMarkerData = () => setMarkerData(null);

  return (
    <MarkerDataContext.Provider value={{ markerData, setMarkerData, resetMarkerData }}>
      {children}
    </MarkerDataContext.Provider>
  );
};

export const useMarkerDataContext = () => useContext(MarkerDataContext);
