import { styled } from "@linaria/react";
import { FC, ReactElement } from "react";

import { breakPoint, breakpointMediaQueries, TITLE_FONT_FAMILY } from "../../constants";
import { useHideAnimation, useMediaQuery } from "../../hooks";
import { CloseButton } from "../CloseButton";
import { FadeAnimation } from "../FadeAnimation/FadeAnimation";

export type SceneMenuItem = { id: string; name: string; disabled?: boolean };

type Props = {
  show?: boolean;
  list: (SceneMenuItem & { children?: SceneMenuItem[] })[];
  onClickItem?: (item: SceneMenuItem) => void;
  onClose?: () => void;
  renderHeader?: () => ReactElement | null;
  renderFooter?: () => ReactElement | null;
  zIndex: number;
};

const DURATION = 300;

export const SceneMenuModal: FC<Props> = ({
  show = true,
  list,
  zIndex,
  onClickItem,
  onClose,
  renderHeader,
  renderFooter,
}) => {
  const { value: showAnimation, hide } = useHideAnimation(show, DURATION);
  const isBreakpointMd = useMediaQuery(`(max-width: ${breakPoint.md}px)`);

  if (!showAnimation) return;

  return (
    <Root duration={DURATION} zIndex={zIndex} className={hide ? "hide" : ""}>
      <Container>
        {renderHeader?.()}
        <CloseButtonContainer>
          <CloseButton
            color="#fff"
            onClick={onClose}
            width={isBreakpointMd ? 30 : 50}
            height={isBreakpointMd ? 30 : 50}
          />
        </CloseButtonContainer>
        <List>
          {list.map(item => (
            <ListItem key={item.id}>
              <ListItemButton disabled={item.disabled} onClick={() => onClickItem?.(item)}>
                {item.name}
              </ListItemButton>
              {item.children?.length && (
                <ChildrenList>
                  {item.children.map(child => (
                    <ChildListItem key={child.id} onClick={() => onClickItem?.(child)}>
                      <ListItemButton disabled={child.disabled}>{child.name}</ListItemButton>
                    </ChildListItem>
                  ))}
                </ChildrenList>
              )}
            </ListItem>
          ))}
        </List>
        {renderFooter?.()}
      </Container>
    </Root>
  );
};

const Root = styled(FadeAnimation)<{ zIndex: number }>`
  position: fixed;
  inset: 0;
  background: rgba(70, 60, 100, 0.9);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${TITLE_FONT_FAMILY};
  overflow-y: auto;
  z-index: ${({ zIndex }) => zIndex};
`;

const Container = styled.div`
  position: relative;
  width: 80vw;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding: 0 20px;

  ${breakpointMediaQueries.md} {
    align-items: start;
    flex-direction: column;
    width: auto;
    height: 100%;
  }
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 30px 0;

  ${breakpointMediaQueries.md} {
    gap: 10px 0;
  }
`;

const ListItem = styled.li`
  font-size: 25px;

  ${breakpointMediaQueries.md} {
    font-size: 16px;
  }
`;

const ChildrenList = styled(List)`
  margin-top: 30px
  gap: 20px 0;
  padding-left: 50px;

  ${breakpointMediaQueries.md} {
    padding-left: 20px;
    gap: 10px 0;
    margin-top: 10px
  }
`;

const ChildListItem = styled(ListItem)`
  display: flex;
  font-size: 20px;
  gap: 0 12px;
  align-items: center;
  cursor: pointer;
  &:before {
    content: "";
    display: block;
    width: 30px;
    height: 1px;
    background: #fff;
    margin-right: 12px;
    flex-shrink: 0;
    flex-basis: 30px;
  }

  ${breakpointMediaQueries.md} {
    font-size: 12px;
  }
`;

const ListItemButton = styled.button`
  cursor: pointer;
  background: transparent;
  border: none;
  font-size: inherit;
  color: inherit;
  font-family: inherit;
  text-align: left;

  @media (hover: hover) {
    &:hover {
      color: #00bebe;
    }
  }
  &:active {
    color: #5a2dc5;
  }

  &:disabled {
    cursor: auto;
    @media (hover: hover) {
      &:hover {
        color: #fff;
      }
    }
    &:active {
      color: #fff;
    }
  }
`;

const CloseButtonContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  transform: translateY(-50%);
  ${breakpointMediaQueries.md} {
    position: fixed;
    transform: translateY(0%);
    top: 20px;
    right: 20px;
  }
`;
