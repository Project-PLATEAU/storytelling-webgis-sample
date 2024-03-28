import { FC, useMemo } from "react";
import { useTranslation, Trans } from "react-i18next";

import { BaseContent } from "../../components/Contents/BaseContent";
import { BarAndLineChart } from "../../components/Contents/Charts";
import { splitN } from "../../utils";

type Props = {};

export const DestroyedContent: FC<Props> = () => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === "en";

  return (
    <BaseContent>
      <h2>{t("Collapsed buildings distribution")}</h2>
      <p>
        <Trans i18nKey="Total destruction refers to buildings that have lost the basic functions necessary for habitation. This includes cases where the entire residence has collapsed, washed away, buried, or burned down. Additionally, severe damage to the residence that makes it difficult to restore and reuse through repairs also falls under 'total destruction.' This refers to cases where the damaged, burned, or washed away area of the residence accounts for 70% or more of the total floor area. Furthermore, if the economic damage suffered by the main components of the residence accounts for 50% or more of the total economic loss, it is also considered 'total destruction.'" />
      </p>
      {isEn ? (
        <img src="img/content/destroyed/tokyo-table-en.png" width={400} height={98} />
      ) : (
        <img src="img/content/destroyed/tokyo-table-jp.png" width={400} height={98} />
      )}
      <span className="source">
        {t(`*"Shaking" includes damage to man-made land.`)}
        <br />
        {t(`*Totals may not add up due to rounding to the nearest whole number.`)}
        <br />
        {t(`Source: `)}
        <a
          href={
            "https://www.bousai.metro.tokyo.lg.jp/_res/projects/default_project/_page_/001/021/571/20220525/n/002n.pdf"
          }
          target="_blank"
          rel="noreferrer">
          {t(
            "Report on Assumed Damage to Tokyo from an Earthquake, etc., Directly Under the Tokyo Metropolitan Area",
          )}
        </a>
      </span>
      <span className="subtitle">
        {t("Legend")}:{t("Collapse rate within the area range")}
      </span>
      {isEn ? (
        <img src="img/content/destroyed/legend-color_en.png" width={402} height={73} />
      ) : (
        <img src="img/content/destroyed/legend-color_jp.png" width={402} height={73} />
      )}

      <h3>{t("Increase in seismic retrofitting rate")}</h3>
      <p>
        <Trans i18nKey="Tokyo has been working on initiatives to improve the seismic resistance ratio in order to reduce building and human damage caused by shaking. As of 2020, the seismic resistance ratio of residential buildings in Tokyo is 92%. Furthermore, there is a need to promote seismic retrofitting for buildings constructed before 1980, which were built according to older seismic standards. By rebuilding or retrofitting all buildings to meet the Building Standards Act (1981 Standards) implemented since June 1981, the damage can be further reduced. Moreover, if all buildings are rebuilt to meet the Building Standards Act (2000 Standards) implemented since June 2000, it will lead to even greater reduction in damage." />
      </p>
      <span className="source">
        {t(`Source: `)}
        <a
          href={
            "https://www.bousai.metro.tokyo.lg.jp/_res/projects/default_project/_page_/001/021/571/20220525/n/002n.pdf"
          }
          target="_blank"
          rel="noreferrer">
          {t(
            "Report on Assumed Damage to Tokyo from an Earthquake, etc., Directly Under the Tokyo Metropolitan Area",
          )}
        </a>
      </span>

      <h3>{t("Seismic retrofitting outcomes")}</h3>
      <BarAndLineChart
        options={useMemo(
          () => ({
            labels: [t("Present condition"), t("100% earthquake resistant"), t("All rebuilt")],
            datasets: {
              base: {
                data: [80530, 31552, 14252],
                axisLabel: t("Number of buildings totally destroyed due to shaking (buildings)"),
                legendText: t("Total number of buildings"),
                tickStepSize: 20000,
              },
              primary: {
                data: [3209, 1154, 474],
                axisLabel: t("Number of deaths due to shaking (persons)"),
                legendText: t("Number of deaths"),
                tickStepSize: 1000,
                axisMax: 4000,
              },
            },
            compareLabels: [
              {
                text: t("Approximately 60% reduction"),
                left: isEn ? "41%" : "42%",
                top: isEn ? "40%" : "45%",
              },
              {
                text: t("Approximately 50% reduction"),
                left: isEn ? "64%" : "64%",
                top: isEn ? "57%" : "66%",
              },
            ],
            chartHeight: isEn ? "260px" : undefined,
            isEn,
          }),
          [t, isEn],
        )}
      />
      <p>
        {splitN(
          t(
            "If seismic retrofitting according to the '1981 Standards (New Seismic Standards)' is achieved, it is estimated that the number of completely collapsed buildings and fatalities will decrease by about 60% compared to the current situation. If seismic retrofitting according to the '2000 Standards' is achieved, it is estimated that the number of completely collapsed buildings and fatalities will decrease by an additional approximately 50% compared to seismic retrofitting based on the '1981 Standards (New Seismic Standards)' (a total reduction of about 80% from the current situation).",
          ),
        )}
      </p>

      <span className="source">
        {t(
          `*Depending on the magnitude of the earthquake shaking, even buildings based on the 2000 standard may suffer a certain degree of damage, so the damage will not be zero.`,
        )}
      </span>
      <span className="source">
        {t(`*"Shaking" includes damage to man-made land.`)}
        <br />
        {t(`*Totals may not add up due to rounding to the nearest whole number.`)}
        <br />
        {t(`Source: `)}
        <a
          href={
            "https://www.bousai.metro.tokyo.lg.jp/_res/projects/default_project/_page_/001/021/571/20220525/n/002n.pdf"
          }
          target="_blank"
          rel="noreferrer">
          {t(
            "Report on Assumed Damage to Tokyo from an Earthquake, etc., Directly Under the Tokyo Metropolitan Area",
          )}
        </a>
      </span>

      <h3>
        {t(
          "Increase in the implementation rate of measures for preventing furniture and object tipping/falling, and the resultant outcomes",
        )}
      </h3>
      <BarAndLineChart
        options={useMemo(
          () => ({
            labels: [t("Present condition"), t("Improvement①"), t("Improvement②")],
            datasets: {
              base: {
                data: [239, 141, 44],
                axisLabel: t("Number of deaths (persons)"),
                legendText: t("Number of deaths"),
                axisMax: 300,
              },
              primary: {
                data: [1362, 818, 255],
                axisLabel: t("Number of seriously injured (persons)"),
                legendText: t("Number of seriously injured"),
                axisMax: 1500,
                tickStepSize: 500,
              },
            },
            compareLabels: [
              {
                text: t("Approximately 40% reduction"),
                left: isEn ? "24%" : "34%",
                top: isEn ? "34%" : "25%",
              },
              {
                text: t("Approximately 70% reduction"),
                left: isEn ? "62%" : "62%",
                top: isEn ? "60%" : "57%",
              },
            ],
            legendMaxWidth: isEn ? "150px" : undefined,
            isEn,
          }),
          [t, isEn],
        )}
      />
      <p>
        <Trans i18nKey="Implementing measures to prevent furniture and objects from toppling, falling, and moving is believed to reduce the number of fatalities and severe injuries. As of 2020, the implementation rate is 57.3%. If this rate is increased to 75% (Accelerator 1), it is expected to reduce the number of fatalities and severe injuries by about 40% from the current situation. Furthermore, if it is increased to 100% (Accelerator 2), an estimated reduction of about 70% is anticipated." />
      </p>
      <p>
        {t(
          "It's important to note that even if furniture and objects are fixed, if they are not properly secured, the effectiveness of implementation can be reduced. Therefore, promoting the proper method of securing furniture through future dissemination and awareness campaigns is expected to further mitigate damages.",
        )}
      </p>
      <span className="source">
        {splitN(
          t(
            `*It is assumed that the percentage of ineffective implementation will be reduced to 10% by encouraging appropriate fall prevention measures.`,
          ),
        )}
      </span>
      <span className="source">
        {t(`*"Shaking" includes damage to man-made land.`)}
        <br />
        {t(`*Totals may not add up due to rounding to the nearest whole number.`)}
        <br />
        {t(`Source: `)}
        <a
          href={
            "https://www.bousai.metro.tokyo.lg.jp/_res/projects/default_project/_page_/001/021/571/20220525/n/002n.pdf"
          }
          target="_blank"
          rel="noreferrer">
          {t(
            "Report on Assumed Damage to Tokyo from an Earthquake, etc., Directly Under the Tokyo Metropolitan Area",
          )}
        </a>
      </span>
    </BaseContent>
  );
};
