import { styled } from "@linaria/react";
import { FC, RefObject, useRef } from "react";
import { useListBox, useOption, AriaListBoxOptions } from "react-aria";
import { SelectState, Node } from "react-stately";

type Props = {
  state: SelectState<object>;
  listBoxRef?: RefObject<HTMLUListElement>;
  onClick?: () => void;
} & AriaListBoxOptions<object>;

export const ListBox: FC<Props> = ({ state, ...props }) => {
  const ref = useRef(null);
  const { listBoxRef = ref } = props;
  const { listBoxProps } = useListBox(props, state, listBoxRef);

  return (
    <ul
      {...listBoxProps}
      ref={listBoxRef}
      style={{
        margin: 0,
        padding: 0,
        listStyle: "none",
        maxHeight: 250,
        overflow: "auto",
        minWidth: 100,
        background: "lightgray",
      }}>
      {[...state.collection].map(item => (
        <Option key={item.key} item={item} state={state} />
      ))}
    </ul>
  );
};

function Option({ item, state }: { item: Node<object>; state: SelectState<object> }) {
  const ref = useRef(null);
  const { optionProps, isSelected, isFocused, isDisabled } = useOption(
    { key: item.key },
    state,
    ref,
  );

  return (
    <Item
      {...optionProps}
      isSelected={isSelected}
      isFocued={isFocused}
      isDisabled={isDisabled}
      ref={ref}>
      {item.rendered}
    </Item>
  );
}

const Item = styled.li<{
  isFocued: boolean;
  isSelected: boolean;
  isDisabled: boolean;
}>`
  background: ${({ isSelected, isFocued }) =>
    isSelected ? "#00bebe" : isFocued ? "#eeeeee" : "#ffffff"};
  width: 250px;
  padding: 15px 30px;
  box-sizing: border-box;
  color: #463c64;
`;
