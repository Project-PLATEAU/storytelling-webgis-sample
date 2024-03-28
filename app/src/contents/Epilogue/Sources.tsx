import { styled } from "@linaria/react";
import { FC } from "react";
import { useTranslation } from "react-i18next";

import { WidthLimitedContent } from "../../components/Contents/BaseContent";
import { splitN } from "../../utils";

type Props = {};

const sources = [
  {
    i18nKey: "Asahi Shimbun, May 25, 2022",
    link: "https://digital.asahi.com/articles/ASQ5T4TGCQ5SUTIL01H.html",
  },
  {
    i18nKey: "MLIT | White Paper on National Capital Region Development,The Year of Reiwa 4",
    link: "https://www.mlit.go.jp:8088/report/press/toshi03_hh_000090.html",
  },
  {
    i18nKey: "MLIT | About Liquefaction phenomenon",
    link: "https://www.mlit.go.jp/toshi/toshi_fr1_000010.html",
  },
  {
    i18nKey:
      "Disaster Prevention Information | Tokyo Metropolitan Government's Crisis Management System",
    link: "https://www.bousai.metro.tokyo.lg.jp/taisaku/torikumi/1000067/1000369.html",
  },
  {
    i18nKey:
      "This site is based on the Tokyo Metropolitan Government's Disaster Prevention website's \"Disaster Prevention Information | Projected Damage to Tokyo from a Capital Region Earthquake and Similar Events (Announced on May 25, 2022),\" and processed and visualized independently by this site.",
    link: "https://www.bousai.metro.tokyo.lg.jp/taisaku/torikumi/1000902/1021571.html",
  },
  {
    i18nKey:
      "Disaster Prevention Information | The Aspect of Possible Damage in One's Immediate Surroundings",
    link: "https://www.bousai.metro.tokyo.lg.jp/taisaku/torikumi/1000902/1021641/index.html",
  },
  {
    i18nKey:
      "Disaster Prevention Information | Major Initiatives and Disaster Reduction Effects Over the Past 10 Years",
    link: "https://www.bousai.metro.tokyo.lg.jp/_res/projects/default_project/_page_/001/021/571/20220525/torikumi.pdf",
  },
  {
    i18nKey: "Tokyo Disaster Preparedness Plan Progress Report 2023",
    link: "https://www.metro.tokyo.lg.jp/tosei/hodohappyo/press/2023/03/31/12.html",
  },
  {
    i18nKey:
      'Tokyo Metropolitan Government Bureau of Urban Development | "Mokumitsu Area Fireproofing 10-Year Project" Implementation Policy',
    link: "https://www.toshiseibi.metro.tokyo.lg.jp/bosai/mokumitu/pdf/houshin.pdf",
  },
  {
    i18nKey:
      "Tokyo Metropolitan Government Bureau of Urban Development | The Fireproofing Special Zone System and Efforts in Specific Development Routes",
    link: "https://www.funenka.metro.tokyo.lg.jp/initiatives/fireproof-special-zone-system/",
  },
  {
    i18nKey: "Tokyo earthquake-resistant portal site | When will the big earthquake occur?",
    link: "https://www.taishin.metro.tokyo.lg.jp/why/topic01.html",
  },
  {
    i18nKey:
      "Tokyo Metropolitan Government's Liquefaction Countermeasures Portal Site | What is Liquefaction?",
    link: "https://kenchiku-ekijoka.metro.tokyo.lg.jp/about.html",
  },
  {
    i18nKey: "Tokyo Fire Department | Guidebook for High School Student Members",
    link: "https://www.tfd.metro.tokyo.lg.jp/inf/bfc/high_school/cp5/index.html",
  },
  {
    i18nKey:
      "Colorized Photo Provision and Project Advice: University of Tokyo Graduate School, Hidenori Watanave Laboratory",
    link: "https://labo.wtnv.jp/",
  },
];

const SourceItem: FC<{ text: string; link: string }> = ({ text, link }) => (
  <Source>
    <p>{splitN(text)}</p>
    <a href={link} target="_blank" rel="noreferrer">
      {link}
    </a>
  </Source>
);

export const Sources: FC<Props> = () => {
  const { t } = useTranslation();

  return (
    <WidthLimitedContent>
      <h2>{t("Reference Links and Sources")}</h2>
      {sources.map(({ i18nKey, link }, i) => (
        <SourceItem key={i} text={t(i18nKey)} link={link} />
      ))}
    </WidthLimitedContent>
  );
};

const Source = styled.div`
  margin: 20px 0;
  font-size: 14px;
  & > p {
    margin-bottom: 0px;
  }
  & > a {
    word-break: break-all;
  }
`;
