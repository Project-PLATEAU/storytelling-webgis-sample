import { styled } from "@linaria/react";
import { FC } from "react";

import { useSoundContext } from "../../contexts/SoundContexts";
import { useTranslation } from "../../i18n/hooks";
import { Language } from "../../utils/types/common";
import { IconButton } from "../IconButton";
import { IconWithOutline } from "../IconWithOutline";

export const StartPage: FC = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const toggleLanguage = (lang: Language) => i18n.changeLanguage(lang);

  const { setSound } = useSoundContext();

  return (
    <Root>
      <Title>{t("startpage_title")}</Title>
      <SoundToggle>
        <Instructions>{t("startpage_sount_instruction")}</Instructions>
        <SoundOptions>
          <IconButton text="SOUND ON" onClick={() => setSound("on")}>
            <IconWithOutline iconPath="img/sound-on.svg" size="5em" />
          </IconButton>
          <IconButton text="SOUND OFF" onClick={() => setSound("off")}>
            <IconWithOutline iconPath="img/sound-off.svg" size="5em" />
          </IconButton>
        </SoundOptions>
      </SoundToggle>
      <LanguageToggle>
        <LanguageOption onClick={() => toggleLanguage("ja")} selected={currentLanguage === "ja"}>
          {t("lang_ja")}
        </LanguageOption>
        {" | "}
        <LanguageOption onClick={() => toggleLanguage("en")} selected={currentLanguage === "en"}>
          {t("lang_en")}
        </LanguageOption>
      </LanguageToggle>
    </Root>
  );
};

const Root = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100svh;
  height: 100dvh;
  background-color: #313131;
  color: white;
  font-family: sans-serif; // Tokyo CityFont Cond StdN?
`;

const Title = styled.h1`
  font-size: 4em;
  font-weight: 700;
  width: 40%;
  white-space: pre-wrap;
  margin-left: 100px;
`;

const SoundToggle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  width: 60%;
  gap: 50px;
`;

const SoundOptions = styled.div`
  display: flex;
  justify-content: space-between;
  width: 50%;
`;

const LanguageToggle = styled.span`
  position: absolute;
  top: 30px;
  right: 30px;
  font-size: 2em;
  font-weight: 100;
`;

const Instructions = styled.span`
  font-size: 1.5em;
`;

const LanguageOption = styled.span<{ selected: boolean }>`
  cursor: pointer;
  text-decoration: ${props => (props.selected ? "underline" : "none")};
`;
