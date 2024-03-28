declare module "deck.gl-particle" {
  class ParticleLayer {
    constructor(options: {
      id?: string;
      image?: string; // see deck.gl BitmapLayer image property
      imageUnscale?: [number, number];
      bounds?: [number, number, number, number];
      numParticles?: number;
      maxAge?: number;
      speedFactor?: number;
      color?: [number, number, number, number];
      width?: number;
      opacity?: number;
    });
  }
}
