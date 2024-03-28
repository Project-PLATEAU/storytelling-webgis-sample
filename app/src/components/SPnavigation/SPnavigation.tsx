import { styled } from "@linaria/react";
import { FC } from "react";

import { breakpointMediaQueries } from "../../constants";
import { useTranslation } from "../../i18n/hooks";
import { Close } from "../icons/Close";
import { Select } from "../Select";

type SPnavigationProps = {
  areas: { id: string; label: string }[];
  languages: { id: string; label: string }[];
  selectedArea?: string;
  selectedLanguage: string;
  onCloseSpNav: () => void;
  onChangeArea?: (area: string) => void;
  onChangeLanguage?: (lang: string) => void;
  onClick?: () => void;
};

export const SPnavigation: FC<SPnavigationProps> = ({
  languages,
  areas,
  selectedArea,
  selectedLanguage,
  onCloseSpNav,
  onChangeArea,
  onChangeLanguage,
  onClick,
}) => {
  const { t } = useTranslation();

  return (
    <Header>
      <Title>{t("content_navigation_header")}</Title>
      <SelectWrapper>
        <Select
          selectedItem={selectedArea}
          label="Select Area"
          items={areas}
          onChange={onChangeArea}
          onClick={onClick}
          shouldReplace
        />
      </SelectWrapper>
      <SelectWrapper>
        <Select
          selectedItem={selectedLanguage}
          label="Language"
          items={languages}
          onChange={onChangeLanguage}
          onClick={onClick}
        />
      </SelectWrapper>
      <CloseButton onClick={onCloseSpNav}>
        <Close />
      </CloseButton>
    </Header>
  );
};

const Header = styled.header`
  width: 100%;
  background: rgba(0, 0, 0, 0);
  display: flex;
  align-items: center;
  padding: 30px;
  box-sizing: border-box;
  gap: 0 20px;

  ${breakpointMediaQueries.md} {
    padding: 20px;
  }
`;

const Title = styled.h1`
  display: flex;
  flex: 1;
  margin: 0;
  font-size: 1.5em;
  color: #ffffff;
  min-width: 300px;

  ${breakpointMediaQueries.md} {
    font-size: 0.8em;
  }
`;

const SelectWrapper = styled.div`
  pointer-events: auto;
`;

const CloseButton = styled.button`
  display: none;

  ${breakpointMediaQueries.md} {
    position: fixed;
    top: 20px;
    right: 20px;
    display: block;
    cursor: pointer;
    background: transparent;
    color: white;
    border: none;
    pointer-events: auto;
    user-select: none;
    & > * {
      user-drag: none;
    }
  }
`;
