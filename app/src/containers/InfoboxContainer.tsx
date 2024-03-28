import { FC } from "react";

import { Infobox } from "../components/Infobox";
import { useMarkerDataContext } from "../contexts/MarkerContexts";

export const InfoboxContainer: FC = () => {
  const { markerData } = useMarkerDataContext();

  return markerData ? (
    <Infobox attributes={markerData.attributes} screenPosition={markerData.screenPosition} />
  ) : null;
};
