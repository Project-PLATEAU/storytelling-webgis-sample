import { MapViewState } from "@deck.gl/core/typed";

export class CameraChangeEvent extends Event {
  viewState?: Partial<MapViewState>;
  constructor() {
    super("camerachange");
  }
}
