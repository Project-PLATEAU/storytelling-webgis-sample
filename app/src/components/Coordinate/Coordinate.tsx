import { styled } from "@linaria/react";
import { FC } from "react";

type Props = {
  lng: number;
  lat: number;
};

export const Coordinate: FC<Props> = ({ lng, lat }) => {
  return (
    <Root>
      {lng}, {lat}
    </Root>
  );
};

const Root = styled.div`
  font-size: 10px;
  color: #ffffff;
  white-space: nowrap;
  pointer-events: auto;
`;
