import { FC } from "react";

import { Particle, ParticleProps } from "../layers";

type Props = ParticleProps;

export const ParticleContainer: FC<Props> = ({ ...props }) => {
  return <Particle {...props} />;
};
