import { FC, useEffect, useState } from "react";

import { useMarkerDataContext } from "../../contexts/MarkerContexts";
import { Point as PointGeometry, Feature, FeatureCollection } from "../../utils/types/common";
import { Marker, MarkerProps } from "../layers";

export const MarkerContainer: FC<MarkerProps> = ({ ...props }) => {
  const [data, setData] = useState<FeatureCollection<Feature<PointGeometry>>>({
    type: "FeatureCollection",
    features: [],
  });

  const [selectedPinPosition, setSelectedPinPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const { setMarkerData } = useMarkerDataContext();

  const { url, onChangeCursor, data: defaultData } = props;
  useEffect(() => {
    if (!url) return;
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [url]);

  useEffect(() => {
    if (props.selectedFeature && selectedPinPosition) {
      const attributes = [
        {
          name: "名称",
          value: props.selectedFeature.properties.P20_002 as string,
        },
        {
          name: "住所",
          value: props.selectedFeature.properties.P20_003 as string,
        },
        {
          name: "施設の種類",
          value: props.selectedFeature.properties.P20_004 as string,
        },
        {
          name: "収容人数",
          value: props.selectedFeature.properties.P20_001 as string,
        },
      ];
      setMarkerData({ attributes, screenPosition: selectedPinPosition });
    }
  }, [props.selectedFeature, selectedPinPosition, setMarkerData]);

  return (
    <Marker
      {...props}
      data={defaultData ?? data}
      setSelectedPinPosition={setSelectedPinPosition}
      onChangeCursor={onChangeCursor}
    />
  );
};
