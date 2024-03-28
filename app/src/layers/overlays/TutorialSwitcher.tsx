import { FC, useCallback, useEffect, useState } from "react";

import { CircleTextContainer } from "../../containers/CircleTextContainer";
import { useFirstVisitContext } from "../../contexts/FirstVisitContexts";
import { OverlayContentProps } from "../../map/layers";
import { MainScenes } from "../../utils";

import { SceneDescriptionOverlay } from "./SceneDescriptionOverlay";
import { TutorialOverlay } from "./TutorialOverlay";

type Props = OverlayContentProps;

export const TUTORIAL_TIMEOUT = 10000;

export const TutorialSwitcher: FC<Props> = ({ show }) => {
  const { firstVisit, setFirstVisit } = useFirstVisitContext();
  const { isTutorialCompleted } = firstVisit;
  const [showTutorialOverlay, setShowTutorialOverlay] = useState(!isTutorialCompleted);

  const handleTutorialSkip = useCallback(() => {
    setFirstVisit(currentFirstVisit => ({
      ...currentFirstVisit,
      isTutorialCompleted: true,
    }));
    setShowTutorialOverlay(false);
  }, [setFirstVisit]);

  useEffect(() => {
    if (!isTutorialCompleted) {
      const timer = setTimeout(() => {
        handleTutorialSkip();
      }, TUTORIAL_TIMEOUT);
      return () => clearTimeout(timer);
    }
  }, [isTutorialCompleted, handleTutorialSkip]);

  if (showTutorialOverlay) {
    return (
      <>
        <TutorialOverlay show={show} onSkip={handleTutorialSkip} />
        <CircleTextContainer />
      </>
    );
  } else {
    return (
      <SceneDescriptionOverlay
        show={show}
        sceneName={MainScenes.Scene1}
        backgroundColor="#E6E6FA"
        color="#463C64"
      />
    );
  }
};
