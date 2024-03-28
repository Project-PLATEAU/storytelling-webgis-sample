import { FC, useMemo } from "react";
import { useTranslation, Trans } from "react-i18next";

import { BaseContent } from "../../components/Contents/BaseContent";
import { BarAndLineChart, DoublePieChart } from "../../components/Contents/Charts";
import { splitN } from "../../utils";

type Props = {};

export const BurnedContent: FC<Props> = () => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === "en";

  return (
    <BaseContent>
      <h2>{t("Burned buildings distribution")}</h2>

      <p>
        {t(
          "When the Central South Region Earthquake occurs, it is estimated that up to approximately 120,000 houses could be lost due to fires. This number represents about 4% of the entire Tokyo area, excluding the island regions.",
        )}
      </p>

      <span className="subtitle">
        {t(
          "Table: List of number of burned buildings (including shaking damage) at wind speed of 8m/s",
        )}
      </span>
      <figure>
        {isEn ? (
          <img src="img/content/burned/earthquake-wind-table-en.png" width={400} height={157} />
        ) : (
          <img src="img/content/burned/earthquake-wind-table-jp.png" width={400} height={157} />
        )}
        <figcaption>
          {t("Source: ")}
          <a
            href={
              "https://www.bousai.metro.tokyo.lg.jp/_res/projects/default_project/_page_/001/021/571/20220525/n/002n.pdf"
            }
            target="_blank"
            rel="noreferrer">
            {t("Report on Assumed Damage to Tokyo from a Metropolitan Earthquake, etc.")}
          </a>
        </figcaption>
      </figure>
      <span className="subtitle">
        {t("Legend")}:{t("Central South Burned Buildings")}
      </span>
      <img src="img/content/burned/legend-color.png" width={402} height={73} />

      <h3>{t("Actions for fireproofing in the previous decade")}</h3>
      <p>
        <Trans i18nKey='In Tokyo, there are densely populated wooden housing areas centered around the Yamanote Line outer loop. To prevent the spread of fires, the "10-Year Fireproofing Project for Mokumitsu Areas" was launched. This project aimed to create areas (fire spread prevention zones) that prevent fires from spreading and simultaneously promote fireproofing in areas expected to suffer particularly severe damage during disasters (development areas).' />
      </p>
      <p>
        {t(
          "As a result, the density of wooden housing areas decreased from approximately 16 thousand hectares to approximately 8.6 thousand hectares. The fire-resistant area rate in urban areas (development areas), which indicates the fire resistance of the city, increased significantly from about 58.4% to about 64.0%.",
        )}
      </p>
      <p>
        {t(
          "However, the number of firefighting brigade members, who play a crucial role in regional disaster prevention activities such as firefighting and rescue operations, decreased from approximately 24,000 to approximately 22,000.",
        )}
      </p>
      <span className="source">
        {t("Source: ")}
        <a
          href={
            "https://www.bousai.metro.tokyo.lg.jp/_res/projects/default_project/_page_/001/021/571/20220525/torikumi.pdf"
          }
          target="_blank"
          rel="noreferrer">
          {t(
            "Disaster Prevention Information | Major Initiatives and Disaster Reduction Effects Over the Past 10 Years",
          )}
        </a>
        ，
        <a
          href={"https://www.kensetsu.metro.tokyo.lg.jp/jimusho/sanken/doro_mokumitsu.html"}
          target="_blank"
          rel="noreferrer">
          {t('Bureau of Construction | Introduction to the "Mokumitsu Project"')}
        </a>
      </span>

      <h4>{t("The fire-resistant area rate in urban areas (development area)")}</h4>
      <DoublePieChart
        pie1={useMemo(() => ({ percent: 58.4, title: t("2012") }), [t])}
        pie2={useMemo(() => ({ percent: 64.0, title: t("2022") }), [t])}
      />
      <span className="source">
        {t("Source: ")}
        <a
          href={
            "https://www.bousai.metro.tokyo.lg.jp/_res/projects/default_project/_page_/001/021/571/20220525/torikumi.pdf"
          }
          target="_blank"
          rel="noreferrer">
          {t(`Major initiatives and disaster mitigation effects over the past 10 years`)}
        </a>
      </span>

      <h3>{t("The effectiveness and challenges of fireproofing")}</h3>
      <p>
        {splitN(
          t(
            "From 2012 to 2022, Tokyo has made efforts in fireproofing, resulting in a decrease in the estimated number of buildings lost due to fires from about 200,000 to about 120,000, and a reduction in fire-related deaths from about 4,100 to about 2,500. However, significant damage is still anticipated, and there are concerns about the decline in the number of firefighting brigade members, leading to a decrease in the overall disaster prevention capacity of the region. This highlights the need for further efforts in both hardware and software measures to address the challenges effectively.",
          ),
        )}
      </p>
      <BarAndLineChart
        options={useMemo(
          () => ({
            labels: [t("2012 estimated"), t("2022 estimated")],
            datasets: {
              base: {
                data: [200000, 120000],
                axisLabel: t("Number of buildings burned (buildings)"),
                legendText: t("Number of buildings burned"),
                dataLabelPrefix: t("Approximately"),
                axisMax: 240000,
                tickStepSize: 60000,
              },
              primary: {
                data: [4100, 2500],
                axisLabel: t("Number of deaths by fire (persons)"),
                legendText: t("Number of deaths"),
                dataLabelPrefix: t("Approximately"),
                axisMax: 4500,
                tickStepSize: 1000,
              },
            },
            legendMaxWidth: isEn ? "150px" : undefined,
            isEn,
          }),
          [t, isEn],
        )}
      />
      <span className="source">
        {t("Source: ")}
        <a
          href={
            "https://www.bousai.metro.tokyo.lg.jp/_res/projects/default_project/_page_/001/021/571/20220525/torikumi.pdf"
          }
          target="_blank"
          rel="noreferrer">
          {t(
            "Disaster Prevention Information | Major Initiatives and Disaster Reduction Effects Over the Past 10 Years",
          )}
        </a>
      </span>

      <h3>{t("Measures for fire outbreak suppression")}</h3>

      <p>
        <Trans i18nKey="To reduce damage caused by fires, it is crucial to decrease the number of fire incidents. Let's examine the effectiveness of fire outbreak suppression measures." />
      </p>
      <p>
        {splitN(
          t(
            "Here, we will look at the impact of implementing fire outbreak suppression measures, specifically focusing on reducing electrical-related fires and increasing the cases that can be extinguished at an early stage.",
          ),
        )}
      </p>
      <p>
        {splitN(
          t(
            'Currently, the rate of reducing electrical-related fires is set at 8.3%, indicated by the "installation rate of seismic breakers." Additionally, the early extinguishment rate during the Tokyo Metropolitan Area Direct Subsurface Earthquake (winter, evening, wind speed of 8m/s) is 36.6%. We will consider the effects of implementing measures up to "Accelerator 1" (reducing electrical-related fires by about 25% and increasing early extinguishment by about 60%) and "Accelerator 2" (reducing electrical-related fires by about 50% and increasing early extinguishment by about 90%).',
          ),
        )}
      </p>

      {isEn ? (
        <img src="img/content/burned/table2-en.png" width={400} height={157} />
      ) : (
        <img src="img/content/burned/table2-jp.png" width={400} height={157} />
      )}
      <span className="source">
        {t("Calculation criteria for fire suppression measures' effectiveness")}
      </span>

      <h3>{t("Effect of fire prevention initiative")}</h3>
      <p>
        {t(
          'If "Accelerator 1" is achieved, it is estimated that both the number of burnt buildings and the number of fatalities will decrease by approximately 70% compared to the current situation. Furthermore, if "Accelerator 2" is achieved, both the number of burnt buildings and the number of fatalities can be reduced by an additional approximately 60% from "Accelerator 1," which corresponds to a 90% reduction from the current situation.',
        )}
      </p>
      {isEn ? (
        <img src="img/content/burned/table3-en.png" width={400} height={73} />
      ) : (
        <img src="img/content/burned/table3-jp.png" width={400} height={73} />
      )}
      <span className="source">
        {splitN(
          t(
            "Impact of mitigation measures on fire and loss cases（Central South Region Earthquake,Winter/afternoon/at wind speed of 8m/s）",
          ),
        )}
      </span>
      <BarAndLineChart
        options={useMemo(
          () => ({
            labels: [t("Present condition"), t("Improvement①"), t("Improvement②")],
            datasets: {
              base: {
                data: [118734, 39573, 14067],
                axisLabel: t("Number of buildings burned (buildings)"),
                legendText: t("Number of buildings burned"),
                axisMax: 150000,
                tickStepSize: 50000,
              },
              primary: {
                data: [2462, 807, 293],
                axisLabel: t("Number of deaths by fire (persons)"),
                legendText: t("Number of deaths"),
                axisMax: 3000,
                tickStepSize: 1000,
              },
            },
            compareLabels: [
              {
                text: t("Approximately 70% reduction"),
                left: isEn ? "30%" : "40%",
                top: isEn ? "46%" : "43%",
              },
              {
                text: t("Approximately 60% reduction"),
                left: isEn ? "62%" : "63%",
                top: isEn ? "62%" : "69%",
              },
            ],
            legendMaxWidth: isEn ? "150px" : undefined,
            chartHeight: isEn ? "250px" : undefined,
            isEn,
          }),
          [t, isEn],
        )}
      />
      <span className="source">{splitN(t("Impact of measures on death toll"))}</span>
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
    </BaseContent>
  );
};
