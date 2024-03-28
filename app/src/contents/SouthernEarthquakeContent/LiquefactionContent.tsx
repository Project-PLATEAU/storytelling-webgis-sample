import { FC } from "react";
import { useTranslation, Trans } from "react-i18next";

import { BaseContent } from "../../components/Contents/BaseContent";
import { splitN } from "../../utils";

type Props = {};

export const LiquefactionContent: FC<Props> = () => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === "en";

  return (
    <BaseContent>
      <h2>{t("Liquefaction area distribution")}</h2>
      <p>
        <Trans i18nKey="When an earthquake occurs and the ground experiences a strong impact, soil particles that were previously supporting each other become loose and disjointed. This phenomenon is known as liquefaction." />
        <br />
        {t(
          "During liquefaction, water may spout out from the ground, stable ground can suddenly become soft, leading to buildings sinking or tilting, and buried manholes or pipes may surface. The ground as a whole may also flow towards lower areas.",
        )}
      </p>
      <span className="source">
        {t("Source: ")}
        <a
          href="https://www.mlit.go.jp/toshi/toshi_fr1_000010.html"
          target="_blank"
          rel="noreferrer">
          {t(
            'Ministry of Land, Infrastructure, Transport and Tourism "About the Liquefaction Phenomenon"',
          )}
        </a>
      </span>
      <br />
      <span className="subtitle">{t("Legend")}</span>
      {isEn ? (
        <img src="img/content/liquefaction/label-en.png" width={422} height={118} />
      ) : (
        <img src="img/content/liquefaction/label-jp.png" width={422} height={118} />
      )}

      <h3>{t("Anticipated damages caused by liquefaction")}</h3>
      <p>
        {splitN(
          t(
            "In reclaimed areas, coastal areas, and bay areas, liquefaction occurrences are anticipated. Liquefaction can lead to complete collapse of buildings, especially in regions like the Tokyo Bay coastal reclaimed areas and riverbanks, where approximately 1,500 buildings could be affected in the event of the Central South Region Earthquake.",
          ),
        )}
        <Trans i18nKey="In areas with seismic intensity of lower than or equal to 6, not only building collapses are expected but also the leaning or sinking of utility poles due to liquefaction, which could lead to power outages." />
        <Trans i18nKey="Reflecting on past liquefaction incidents, various impacts have been observed, including the spouting of water and sand, sinking or tilting of detached houses, deformation of roads, and damage to lifeline facilities. The effects of liquefaction-related damages on post-earthquake life are extensive and diverse, and their occurrence in combination can result in a prolonged impact period." />
      </p>
      <p className="source">
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
      </p>

      <h3>{t("Strategies to prevent liquefaction")}</h3>

      <p>
        {splitN(
          t(
            "To reduce liquefaction damage in residential areas, a proactive approach by residents and businesses, along with prompt response from authorities during disasters, is crucial. Administrative-led preemptive measures aligned with community initiatives are essential.",
          ),
        )}
        {splitN(
          t(
            "The Ministry of Land, Infrastructure, Transport and Tourism has published guidelines for creating liquefaction hazard maps to facilitate risk communication. Promoting the creation of liquefaction hazard maps at the local level using available resources and increasing awareness about liquefaction-related risks can enhance community disaster resilience.",
          ),
        )}
      </p>
      <span className="source">
        {t("Source: ")}
        <a
          href="https://www.mlit.go.jp/toshi/toshi_tobou_tk_000044.html"
          target="_blank"
          rel="noreferrer">
          {t("Guidelines for Creating Liquefaction Hazard Maps for Risk Communication")}
        </a>
      </span>
    </BaseContent>
  );
};
