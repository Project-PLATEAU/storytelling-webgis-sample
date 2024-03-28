import { styled } from "@linaria/react";
import { FC } from "react";

import { breakpointMediaQueries } from "../../constants";
import { useTranslation } from "../../i18n/hooks";
import { splitN } from "../../utils";
import { MainScenes, NavigationState } from "../../utils/types/common";

type SceneNavigationProps = {
  navigationState: NavigationState;
  setCurrentScene: (scene: MainScenes) => void;
  onClick?: () => void;
  resetTimer?: number;
  onNextScene?: () => void;
  isSpNavOpen: boolean;
  handleSpNavState: () => void;
};

export const SceneNavigation: FC<SceneNavigationProps> = ({
  navigationState,
  setCurrentScene,
  onClick,
  isSpNavOpen,
  handleSpNavState,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <Spacer />
      <SceneSelector isSpNavOpen={isSpNavOpen}>
        {!isSpNavOpen && <BaseLine />}

        {Object.values(MainScenes).map(scene => (
          <SceneButton
            key={scene}
            isSelected={navigationState.currentScene === scene}
            onClick={() => {
              setCurrentScene(scene);
              if (isSpNavOpen) handleSpNavState();
              onClick?.();
            }}
            isSpNavOpen={isSpNavOpen}>
            <span>{splitN(t(scene))}</span>
          </SceneButton>
        ))}
      </SceneSelector>
      <Spacer />
    </>
  );
};

const Spacer = styled.div``;

const SceneSelector = styled.div<{ isSpNavOpen: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 15px;
  position: relative;
  padding-left: ${({ isSpNavOpen }) => (isSpNavOpen ? `0px` : `20px`)};

  ${breakpointMediaQueries.md} {
    padding-left: ${({ isSpNavOpen }) => (isSpNavOpen ? `0px` : `10px`)};
    gap: ${({ isSpNavOpen }) => (isSpNavOpen ? `15px` : `5px`)};
  }
`;

const SceneButton = styled.button<{
  isSelected: boolean;
  isSpNavOpen: boolean;
}>`
  pointer-events: auto;
  background: none;
  border: none;
  color: ${props => (props.isSelected ? "#ffffff" : "#00BEBE")};
  font-weight: ${props => (props.isSelected ? "bold" : "normal")};
  background-color: ${props => (props.isSelected ? "#00BEBE" : "rgba(255, 255, 255, 0.7)")};
  text-align: left;
  padding: 5px;
  font-size: 0.8em;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  box-sizing: border-box;


  @media (hover: hover) {
    &:hover {
      text-decoration: underline;
    }
  }

  &:focus {
    outline: none;
  }

  ${breakpointMediaQueries.md} {
    font-size: ${props => (props.isSpNavOpen ? "15px" : "8px")};
    padding: 5px;
    margin: 2px;
    width: ${props => (props.isSpNavOpen ? "300px" : "150px")};
    height: ${props => (props.isSpNavOpen ? "100%" : "30px")};

    span {
      display: inline;
      padding: 2px
      box-decoration-break: clone;
      -webkit-box-decoration-break: clone;
    }
  }
`;

const BaseLine = styled.div`
  position: absolute;
  top: 0;
  left: 4px;
  width: 4px;
  background-color: #ffffff;
  height: 100%;
`;
