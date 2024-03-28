import { FC } from "react";

import { CameraProps, Camera } from "../layers";

type Props = CameraProps;

export const CameraContainer: FC<Props> = ({ ...props }) => {
  return <Camera {...props} />;
};
