import { FC, useEffect, useMemo, useState } from "react";

import { Point as PointGeometry, Feature, FeatureCollection } from "../../utils/types/common";
import { AnimationGradientPoint, AnimationGradientPointProps } from "../layers";

type Props = AnimationGradientPointProps;

const NUM_GROUPS = 12;

export const AnimationGradientPointContainer: FC<Props> = ({ ...props }) => {
  const [time, setTime] = useState(0);
  const [data, setData] = useState<FeatureCollection<Feature<PointGeometry>>>({
    type: "FeatureCollection",
    features: [],
  });
  const { url, altitude = 200 } = props;

  useEffect(() => {
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
    const time = setInterval(() => {
      setTime(prev => prev + 0.01);
    }, 10);
    return () => clearInterval(time);
  }, []);

  const splitData = useMemo(
    () =>
      Array.from({ length: NUM_GROUPS }).map((_, i) =>
        data.features.filter(d => (d.properties.OBJECTID as number) % NUM_GROUPS === i),
      ),
    [data.features],
  );

  return (
    <>
      {splitData.map((d, i) => {
        props = { ...props, time, data: d, delay: i, altitude };
        return <AnimationGradientPoint key={props.id + i} {...props} id={props.id + i} />;
      })}
    </>
  );
};
