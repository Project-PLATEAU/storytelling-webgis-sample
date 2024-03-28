import { FC } from "react";
import { useTranslation, Trans } from "react-i18next";

import { BaseContent } from "../../components/Contents/BaseContent";
import { DoughnutChartForTokyo23 } from "../../components/Contents/Charts";

type Props = {};

export const Tokyo23Content: FC<Props> = () => {
  const { t } = useTranslation();

  return (
    <BaseContent>
      <h2>{t("If an earthquake were to occur in Tokyo?")}</h2>

      <h3>{t("Ready for the future")}</h3>

      <p>
        <Trans i18nKey="A magnitude 7 earthquake is anticipated in the event of a capital region earthquake, with a probability of occurrence within the next 30 years estimated at around 70% in the southern Kanto region. Tokyo Metropolitan Government has been enhancing disaster preparedness to mitigate potential disasters such as capital region earthquakes. To protect lives and properties from disasters that can occur at any time, efforts in 'self-help' and 'mutual assistance' are necessary in addition to the government's 'public support' initiatives. Here, let's explore the expected damage overview in the event of an earthquake in Tokyo and the disaster prevention measures that the metropolitan government has implemented." />
      </p>

      <h3>{t("The Regional Characteristics of Tokyo Metropolitan Area")}</h3>

      <p>
        <Trans i18nKey="Tokyo Metropolitan Area has an elongated shape from east to west, characterized by significant differences in altitude. It includes various areas ranging from mountain ranges exceeding 2,000 meters above sea level to zero altitude zones." />
      </p>
      <p>
        <Trans i18nKey='Tokyo Metropolitan Area is divided into two regions: "inland" and "island areas." The inland region consists of four types of terrain: mountains, hills, plateaus, and lowlands. The island areas include islands like the Izu Islands and Ogasawara Islands, located on the western side of the Pacific Ocean.' />
      </p>
      <p>
        <Trans i18nKey="Furthermore, Tokyo features areas with rows of aging wooden houses, office districts with towering skyscrapers, zones along the bay with high-rise apartments, and lowland areas in the eastern part where the land becomes lower than the sea level at high tide. Disaster preparedness measures tailored to each region's characteristics are necessary." />
      </p>
      <span className="source">
        {t("Source: ")}
        <a
          href={
            "https://www.bousai.metro.tokyo.lg.jp/_res/projects/default_project/_page_/001/021/571/20220525/n/002n.pdf"
          }
          target="_blank"
          rel="noreferrer">
          {t(
            'Report on "Estimation of damage in the event of an earthquake directly hitting Tokyo"',
          )}
        </a>
      </span>

      <h3>{t("Number of buildings in Tokyo 23 ward")}</h3>

      <DoughnutChartForTokyo23 />

      <h2>{t("Central South Region Earthquake")}</h2>

      <p>
        <Trans i18nKey='"Central South Region Earthquake" is anticipated to be the most severe earthquake within Tokyo. In the event of this earthquake, it is estimated that the seismic intensity of 6 strong or higher will spread across about 60% of the wards. The expected death toll could reach a maximum of around 6,000 people. It is anticipated that approximately 190,000 buildings will be damaged.' />
      </p>
      <span className="source">
        {t("Source: ")}
        <a
          href="https://www.tfd.metro.tokyo.lg.jp/inf/bfc/high_school/cp5/index.html"
          target="_blank"
          rel="noreferrer">
          {t("Tokyo Fire Department | Guidebook for High School Student Members:Chapter 5")}
        </a>
      </span>

      <h2>{t("Tama East Region Earthquake")}</h2>

      <p>
        <Trans i18nKey='"Tama East Region Earthquake" is expected to cause significant damage in the Tama region. It is estimated that the seismic intensity of 6 strong or higher will spread across about 20% of the Tama area. Building damage is projected to affect approximately 160,000 buildings, with an anticipated death toll of around 5,000 people.' />
      </p>
      <span className="source">
        {t("Source: ")}
        <a
          href="https://www.tfd.metro.tokyo.lg.jp/inf/bfc/high_school/cp5/index.html"
          target="_blank"
          rel="noreferrer">
          {t("Tokyo Fire Department | Guidebook for High School Student Members:Chapter 5")}
        </a>
      </span>
    </BaseContent>
  );
};
