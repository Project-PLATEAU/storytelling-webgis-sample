import { createContext, useContext, useState, FC, PropsWithChildren } from "react";

import {
  NavigationState,
  PageName,
  PageScenes,
  SubScenes,
  defaultScenes,
  initialNavigationState,
} from "../utils/types/common";

type NavigationContextType = {
  navigationState: NavigationState;
  setCurrentPage: (page: PageName) => void;
  setCurrentScene: <T extends PageName>(scene: PageScenes[T]) => void;
  setCurrentSceneContentIndex: (contentIndex: number) => void;
  setCurrentSubScene: (subScene: SubScenes) => void;
};

const defaultNavigationContext: NavigationContextType = {
  navigationState: initialNavigationState,
  setCurrentPage: () => {
    throw new Error("setCurrentPage was called without being overridden");
  },
  setCurrentScene: () => {
    throw new Error("setCurrentScene was called without being overridden");
  },
  setCurrentSceneContentIndex: () => {
    throw new Error("setCurrentSceneContentIndex was called without being overridden");
  },
  setCurrentSubScene: () => {
    throw new Error("setCurrentSubScene was called without being overridden");
  },
};

const NavigationContext = createContext<NavigationContextType>(defaultNavigationContext);

export const NavigationProvider: FC<PropsWithChildren> = ({ children }) => {
  const [navigationState, setNavigationState] = useState<NavigationState>(initialNavigationState);

  const setCurrentPage = (page: PageName) => {
    setNavigationState(prevState => ({
      ...prevState,
      currentPage: page,
      currentScene: defaultScenes[page],
      currentSceneContentIndex: 0,
    }));
  };

  const setCurrentScene = <T extends PageName>(scene: PageScenes[T]) => {
    setNavigationState(prevState => ({
      ...prevState,
      currentScene: scene as PageScenes[T],
    }));
  };

  const setCurrentSceneContentIndex = (currentSceneContentIndex: number) => {
    setNavigationState(prevState => ({
      ...prevState,
      currentSceneContentIndex,
    }));
  };

  const setCurrentSubScene = (subScene: SubScenes) => {
    setNavigationState(prevState => ({
      ...prevState,
      currentSubScene: subScene,
    }));
  };

  return (
    <NavigationContext.Provider
      value={{
        navigationState,
        setCurrentPage,
        setCurrentScene,
        setCurrentSubScene,
        setCurrentSceneContentIndex,
      }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigationContext = () => useContext(NavigationContext);
