import { styled } from "@linaria/react";
import { FC } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "../../components/Button";
import { breakpointMediaQueries } from "../../constants";

import { Initiatives } from "./Initiatives";
import { Preparations } from "./Preparations";
import { Sources } from "./Sources";

type Props = {
  handleBackButton: () => void;
  onClick: () => void;
};

export const Epilogue: FC<Props> = ({ handleBackButton, onClick }) => {
  const { t } = useTranslation();

  const handleClickButton = () => {
    onClick();
    handleBackButton();
  };

  return (
    <Root>
      <ContentContainer bgColor="#ffffff">
        <Initiatives />
      </ContentContainer>
      <ContentContainer bgColor="#e6e6fa">
        <Preparations />
      </ContentContainer>
      <ContentContainer bgColor="#ffffff">
        <Sources />
      </ContentContainer>
      <BackButtonContainer>
        <BackButton onClick={handleClickButton}>{t("Watch again from the beginning")}</BackButton>
      </BackButtonContainer>
    </Root>
  );
};

const Root = styled.div``;

const ContentContainer = styled.div<{ bgColor: string }>`
  padding: 0 12rem 4rem;
  background-color: ${({ bgColor }) => bgColor};

  ${breakpointMediaQueries.md} {
    padding: 20px 30px;
  }
`;

const BackButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  background-color: #ffffff;
  padding-bottom: 200px;
`;

const BackButton = styled(Button)`
  padding: 0 3rem;
  font-size: 20px;
  cursor: pointer;
  max-width: 400px;
  height: 60px;
  border: 1px #463c64 solid;
  background: #ffffff;
  border-radius: 60px;
  margin-top: 124px;
  font-color: #463c64;
  margin: auto;
`;
