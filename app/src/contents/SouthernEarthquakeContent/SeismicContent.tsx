import { FC, useMemo } from "react";
import { useTranslation, Trans } from "react-i18next";

import { BaseContent } from "../../components/Contents/BaseContent";
import { DoublePieChart } from "../../components/Contents/Charts";
import { splitN } from "../../utils";

type Props = {};

export const SeismicContent: FC<Props> = () => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === "en";

  return (
    <BaseContent>
      <h2>{t("Seismic intensity distribution")}</h2>
      <p>
        {t(
          "In the event of the central south region earthquake, areas with seismic intensity of 6 strong or higher are expected to be concentrated in the eastern and southwestern parts of the wards. The area with seismic intensity of 7 is approximately 14 km², while the area with seismic intensity of 6 strong is about 388 km².",
        )}
      </p>

      <span className="subtitle">{t("Legend")}</span>

      {isEn ? (
        <img src="img/content/seismic/usage-guide_en.png" width={400} height={136} />
      ) : (
        <img src="img/content/seismic/usage-guide_jp.png" width={400} height={136} />
      )}
      <figcaption className="source">
        {t("Source: ")}
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
      </figcaption>

      <h3>{t("Impact on Capital Functions")}</h3>
      <p>
        <Trans i18nKey="The central south region earthquake is expected to have a significant impact on the capital functions. Additionally, there are concerns about the impact on transportation networks such as Shinkansen and airports located in the southern part of Tokyo, as well as the risk of fire spread in areas densely populated with wooden houses. Therefore, the 'central south region earthquake' is considered a central earthquake in the considerations for earthquake countermeasures directly beneath the capital." />
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
            'Report on "Estimation of damage in the event of an earthquake directly hitting Tokyo" set',
          )}
        </a>
      </p>

      <h2>{t("Efforts and Disaster Reduction Effects Over the Past 10 Years")}</h2>
      <p>
        <Trans i18nKey="Tokyo has been making efforts to enhance disaster resilience in preparation for earthquakes such as capital region earthquakes since the 2011 off the Pacific coast of Tohoku Earthquake. Here, let's first examine the efforts made over the past 10 years in terms of seismic strengthening, fireproofing, self-help, and mutual assistance, and the anticipated disaster reduction effects resulting from these efforts." />
      </p>
      <p className="source">
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
      </p>

      <h3>{t("Earthquake Resistance")}</h3>
      <p>
        <Trans i18nKey='In Tokyo, efforts have been made to promote "earthquake resistance." Firstly, comprehensive plans have been developed to promote the seismic strengthening of buildings, and ordinances have been established to advance earthquake resistance. Since 2012, there has been a push for mandatory seismic diagnosis. Buildings along designated emergency transport routes, crucial for evacuation, emergency services, and the transportation of essential supplies during disasters, are required to undergo seismic diagnosis. This initiative also includes subsidies for renovation costs. Since 2018, the results of seismic diagnosis have been publicly disclosed. Additionally, financial support and the dispatch of experts to municipalities have been provided. These efforts aim to accelerate seismic diagnosis and renovation of residential buildings. Tokyo has also implemented its unique "Tokyo Seismic Mark Display System" and conducted various awareness and promotion activities from different perspectives.' />
      </p>
      <p className="source">
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
      </p>

      <h4>{t("Anticipated Disaster Reduction Effects")}</h4>
      <p>
        {t(
          "The seismic retrofitting rate for buildings along designated emergency transport routes has increased by approximately 10.3% (from 81.3% to about 91.6%), and the seismic retrofitting rate for residences has increased by approximately 10.8% (from 81.2% to about 92.0%).",
        )}
      </p>

      <h4>{t("Seismic retrofitting rate for housing")}</h4>
      <DoublePieChart
        pie1={useMemo(() => ({ percent: 81.2, title: t("2012") }), [t])}
        pie2={useMemo(() => ({ percent: 92.0, title: t("2022") }), [t])}
      />
      <p className="source">
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
      </p>

      <h3>{t("Self-help and Mutual Assistance")}</h3>
      <p>
        <Trans
          i18nKey="We created and distributed 'Disaster Preparedness Tokyo' and 'Disaster Readiness Guide,' which compile information for disaster preparedness and self-protection. Through 'Tokyo Stockpiling Navi,' we promoted stockpiling of food, daily necessities, and other essentials. Furthermore, we conducted training for disaster coordinators to develop female leadership. We have been promoting awareness through activities such as holding 'Tokyo Disaster Preparedness Learning Seminar' at various locations in Tokyo."
          components={{
            l1: (
              <a
                href="https://www.bousai.metro.tokyo.lg.jp/content/pdf2023/tb2023.pdf"
                target="_blank"
                rel="noreferrer">
                l1
              </a>
            ),
            l2: (
              <a
                href="https://www.bousai.metro.tokyo.lg.jp/content/pdf2023/kb2023.pdf"
                target="_blank"
                rel="noreferrer">
                l2
              </a>
            ),
            l3: (
              <a href="https://www.bichiku.metro.tokyo.lg.jp/" target="_blank" rel="noreferrer">
                l3
              </a>
            ),
          }}
        />
      </p>

      <h4>
        {t("Implementation rate of measures for preventing furniture and object tipping/falling")}
      </h4>
      <DoublePieChart
        pie1={useMemo(() => ({ percent: 53.6, title: t("2012") }), [t])}
        pie2={useMemo(() => ({ percent: 57.3, title: t("2022") }), [t])}
      />
      <h4>{t("Implementation rate of daily stockpiling")}</h4>
      <DoublePieChart
        pie1={useMemo(() => ({ percent: 46.4, title: t("2017") }), [t])}
        pie2={useMemo(() => ({ percent: 56.3, title: t("2022") }), [t])}
      />
      <p>
        {splitN(
          t(
            "As a result, the implementation rate of measures such as preventing furniture from toppling increased from about 53.6% to about 57.3%, and the implementation rate of daily stockpiling increased from about 46.4% to about 56.3%. （*The changes from fiscal year 2017）",
          ),
        )}
      </p>
      <p className="source">
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
      </p>
    </BaseContent>
  );
};
