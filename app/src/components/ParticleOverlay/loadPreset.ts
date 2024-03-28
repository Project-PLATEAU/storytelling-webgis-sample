import { loadBasic } from "@tsparticles/basic";
import { tsParticles } from "@tsparticles/engine";
import type { Engine } from "@tsparticles/engine";
import { loadExternalAttractInteraction } from "@tsparticles/interaction-external-attract";
import { loadExternalBounceInteraction } from "@tsparticles/interaction-external-bounce";
import { loadExternalBubbleInteraction } from "@tsparticles/interaction-external-bubble";
import { loadExternalConnectInteraction } from "@tsparticles/interaction-external-connect";
import { loadExternalGrabInteraction } from "@tsparticles/interaction-external-grab";
import { loadExternalPauseInteraction } from "@tsparticles/interaction-external-pause";
import { loadExternalPushInteraction } from "@tsparticles/interaction-external-push";
import { loadExternalRemoveInteraction } from "@tsparticles/interaction-external-remove";
import { loadExternalRepulseInteraction } from "@tsparticles/interaction-external-repulse";
import { loadExternalSlowInteraction } from "@tsparticles/interaction-external-slow";
import { loadParticlesAttractInteraction } from "@tsparticles/interaction-particles-attract";
import { loadParticlesCollisionsInteraction } from "@tsparticles/interaction-particles-collisions";
import { loadParticlesLinksInteraction } from "@tsparticles/interaction-particles-links";
import { loadParallaxMover } from "@tsparticles/move-parallax";
import { loadEasingQuadPlugin } from "@tsparticles/plugin-easing-quad";
import { loadEmojiShape } from "@tsparticles/shape-emoji";
import { loadImageShape } from "@tsparticles/shape-image";
import { loadLineShape } from "@tsparticles/shape-line";
import { loadPolygonShape } from "@tsparticles/shape-polygon";
import { loadSquareShape } from "@tsparticles/shape-square";
import { loadStarShape } from "@tsparticles/shape-star";
import { loadLifeUpdater } from "@tsparticles/updater-life";
import { loadRotateUpdater } from "@tsparticles/updater-rotate";
import { loadStrokeColorUpdater } from "@tsparticles/updater-stroke-color";

async function loadSlim(engine: Engine, refresh = true): Promise<void> {
  await loadParallaxMover(engine, false);

  await loadExternalAttractInteraction(engine, false);
  await loadExternalBounceInteraction(engine, false);
  await loadExternalBubbleInteraction(engine, false);
  await loadExternalConnectInteraction(engine, false);
  await loadExternalGrabInteraction(engine, false);
  await loadExternalPauseInteraction(engine, false);
  await loadExternalPushInteraction(engine, false);
  await loadExternalRemoveInteraction(engine, false);
  await loadExternalRepulseInteraction(engine, false);
  await loadExternalSlowInteraction(engine, false);

  await loadParticlesAttractInteraction(engine, false);
  await loadParticlesCollisionsInteraction(engine, false);
  await loadParticlesLinksInteraction(engine, false);

  await loadEasingQuadPlugin();

  await loadEmojiShape(engine, false);
  await loadImageShape(engine, false);
  await loadLineShape(engine, false);
  await loadPolygonShape(engine, false);
  await loadSquareShape(engine, false);
  await loadStarShape(engine, false);

  await loadLifeUpdater(engine, false);
  await loadRotateUpdater(engine, false);
  await loadStrokeColorUpdater(engine, false);

  await loadBasic(engine, refresh);
}

void loadSlim(tsParticles);

export { loadSlim };
