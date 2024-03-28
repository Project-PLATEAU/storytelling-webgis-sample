import { styled } from "@linaria/react";
import { FC, Key, useCallback, useRef } from "react";
import { useSelect, HiddenSelect, AriaSelectOptions, useButton } from "react-aria";
import { useTranslation } from "react-i18next";
import { useSelectState, SelectStateOptions, Item } from "react-stately";

import { Popover } from "../Popover";

import { ListBox } from "./ListBox";

type Props = {
  label: string;
  selectedItem?: string;
  items: { id: string; label: string }[];
  onChange?: (id: string) => void;
  onClick?: () => void;
  shouldReplace?: boolean;
};

export const Select: FC<Props> = ({
  label,
  selectedItem,
  items,
  onChange,
  onClick,
  shouldReplace,
}) => {
  const { t } = useTranslation();

  const handleSelectionChange = useCallback(
    (key: Key) => {
      if (typeof key === "string") {
        onChange?.(key);
      }
    },
    [onChange],
  );

  return (
    <SelectInner
      label={label}
      selectedKey={selectedItem}
      onSelectionChange={handleSelectionChange}
      onClick={onClick}
      shouldReplace={shouldReplace}>
      {items.map(item => (
        <Item key={item.id}>{t(item.id)}</Item>
      ))}
    </SelectInner>
  );
};

const SelectInner: FC<
  SelectStateOptions<object> &
    AriaSelectOptions<object> & {
      onClick?: () => void;
      shouldReplace?: boolean;
    }
> = ({ onClick, shouldReplace, ...props }) => {
  const state = useSelectState(props);

  const ref = useRef(null);
  const { triggerProps, valueProps, menuProps } = useSelect(props, state, ref);
  const { buttonProps } = useButton(triggerProps, ref);

  return (
    <div>
      <HiddenSelect
        isDisabled={props.isDisabled}
        state={state}
        triggerRef={ref}
        label={props.label}
      />
      <Button {...buttonProps} onClick={onClick} ref={ref}>
        {shouldReplace ? (
          <>
            <span {...valueProps}>{state.selectedItem?.rendered ?? props.label}</span>
            <span />
          </>
        ) : (
          <>
            <span style={{ paddingRight: 5 }}>{props.label}:</span>
            <span {...valueProps}>{state.selectedItem ? state.selectedItem.rendered : ""}</span>
          </>
        )}
        <span aria-hidden="true">▼</span>
      </Button>
      {state.isOpen && (
        <Popover state={state} triggerRef={ref} placement="bottom start">
          <ListBox {...menuProps} onClick={onClick} state={state} />
        </Popover>
      )}
    </div>
  );
};

const Button = styled.button`
  font-size: 14px;
  color: #463c64;
  padding: 14px 25px;
  box-sizing: border-box;
  width: 180px;
  display: grid;
  grid-template-columns: auto auto 1fr;
  background: #ffffff;
  border: 1px solid #463c64;
  text-align: right;
`;
