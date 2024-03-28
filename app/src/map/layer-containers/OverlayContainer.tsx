import { FC } from "react";

import { Overlay, OverlayProps } from "../layers/Overlay";

type Props = OverlayProps;

export const OverlayContainer: FC<Props> = ({ ...props }) => {
  return <Overlay {...props} />;
};
