import { styled } from "@linaria/react";
import { FC, useMemo } from "react";
import { useTranslation, Trans } from "react-i18next";

import { WidthLimitedContent } from "../../components/Contents/BaseContent";
import { LineChart } from "../../components/Contents/Charts";
import {
  CHART_GREEN,
  CHART_PURPLE,
  CHART_YELLOW,
} from "../../components/Contents/Charts/constants";
import { TITLE_FONT_FAMILY } from "../../constants";
import { splitN } from "../../utils";

type Props = {};

export const Initiatives: FC<Props> = () => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === "en";

  return (
    <WidthLimitedContent>
      <FirstH2>{t("Public Assistance Initiatives")}</FirstH2>

      <figure>
        <LineChart
          options={useMemo(
            () => ({
              labels: isEn
                ? ["", "2017", "2018", "2019", "2020", "2021", "2022", ""]
                : ["", "17年度", "18年度", "19年度", "20年度", "21年度", "22年度", ""],
              datasets: [
                {
                  data: [NaN, 83, 90, 97, 100, 100],
                  color: CHART_GREEN,
                  legendText: t(
                    "Seismic retrofitting rate for water pipes（Evacuation shelter, Main Station）",
                  ),
                  dataLegendAlign: "start",
                },
                {
                  data: [NaN, 83.8, 84.8, 85.9, 86.7, 87.1, 87.7],
                  color: CHART_PURPLE,
                  legendText: t(
                    "Seismic retrofitting rate for buildings along designated transportation routes",
                  ),
                  dataLegendAlign: "end",
                },
                {
                  data: [NaN, NaN, 83.9, 85.5, 87.1, 91.9, 93.5],
                  color: CHART_YELLOW,
                  legendText: t("Progress of continuity planning in local governments"),
                  dataLegendAlign: "end",
                },
              ],
              axisLabel: "（％）",
            }),
            [isEn, t],
          )}
        />
        <figcaption>
          {t("Source: ")}
          <a
            href={
              "https://www.metro.tokyo.lg.jp/tosei/hodohappyo/press/2023/03/31/documents/12_a.pdf"
            }
            target="_blank"
            rel="noreferrer">
            {t("Tokyo Disaster Reduction Plan Progress Report 2023")}
          </a>
        </figcaption>
      </figure>

      <p>
        {splitN(
          t(
            'The "damage estimation" presented so far is based on data calculated to realistically reflect the situation of Tokyo as a major city. However, hypotheses always have exceptions. Natural disasters inherently involve unpredictable elements.',
          ),
        )}
      </p>

      <p>
        <Trans i18nKey="The future is always uncertain. That's why we must not be confined only to expected outcomes but steadily implement preventive measures such as seismic strengthening and fireproofing in preparation for large earthquakes that may occur anytime and under any conditions. Being prepared is what creates hope for the future." />
      </p>

      <h3>
        {t(
          "Percentage of public facilities serving as disaster prevention centers that are earthquake resistant",
        )}
      </h3>

      <figure>
        <LineChart
          options={useMemo(
            () => ({
              labels: [
                "",
                "2013",
                "2014",
                "2015",
                "2016",
                "2017",
                "2018",
                "2019",
                "2020",
                "2021",
                "",
              ],
              datasets: [
                {
                  data: [NaN, 86.9, 89.8, 92.2, 94.3, 95.2, 95.7, 96.3, 96.8, 97.3],
                  color: CHART_GREEN,
                  legendText: t("Metropolitan area"),
                  dataLegendAlign: "end",
                },
                {
                  data: [NaN, 82.6, 85.4, 88.3, 90.9, 92.2, 93.1, 94.2, 95.1, 95.6],
                  color: CHART_PURPLE,
                  legendText: t("Nation wide"),
                  dataLegendAlign: "start",
                },
              ],
              axisLabel: "（％）",
            }),
            [t],
          )}
        />
        <figcaption>
          {t("Source: ")}
          <a
            href={"https://www.mlit.go.jp/report/press/content/001614261.pdf"}
            target="_blank"
            rel="noreferrer">
            {t("Metropolitan Area White Paper 2023")}
          </a>
        </figcaption>
      </figure>

      <p>
        {splitN(
          t(
            "Furthermore, it is crucial to establish a comprehensive system to respond promptly according to the situation of disasters. Tokyo Metropolitan Government's disaster response system, centered around the Disaster Management Headquarters, is well-organized and collaborates with national, local government, and other agencies based on information from the Disaster Prevention Center to respond to disasters.",
          ),
        )}
      </p>

      <h3>{t("Tokyo Disaster Prevention System")}</h3>

      <figure>
        {isEn ? (
          <img src="img/content/epilogue/tokyo-crisis-management-en.png" width={400} height={157} />
        ) : (
          <img src="img/content/epilogue/tokyo-crisis-management-jp.png" width={400} height={157} />
        )}
        <figcaption>
          {t("Source: ")}
          <a
            href={"https://www.bousai.metro.tokyo.lg.jp/taisaku/torikumi/1000067/1000369.html"}
            target="_blank"
            rel="noreferrer">
            {t("Tokyo Metropolitan Government's Crisis Management System")}
          </a>
        </figcaption>
      </figure>

      <p>
        {splitN(
          t(
            "Based on the damage estimation, various agencies including the Tokyo Metropolitan Government, municipalities, and others will revise local disaster prevention plans and implement various measures to prepare for future disasters. And when a large earthquake occurs, it is essential for each citizen, community, businesses, and society as a whole to work together to minimize damage. We must join forces to protect lives and preserve what is precious.",
          ),
        )}
      </p>

      <h3>{t("Society-Wide Initiatives")}</h3>
      <figure>
        {isEn ? (
          <img
            src="img/content/epilogue/society-wide-initiatives-en.png"
            width={404}
            height={252}
          />
        ) : (
          <img
            src="img/content/epilogue/society-wide-initiatives-jp.png"
            width={404}
            height={252}
          />
        )}
      </figure>

      <p>
        <Trans i18nKey="Municipalities, government agencies, each citizen, and private businesses - by collaborating with each other, we can pave the way for tomorrow. Self-help, mutual assistance, and public support. Let's gather all our strengths and face the challenge of large earthquakes together." />
      </p>
    </WidthLimitedContent>
  );
};

const FirstH2 = styled.span`
  display: block;
  font-family: ${TITLE_FONT_FAMILY};
  font-weight: bold;
  font-weight: lighter;
  font-size: 50px;
  margin: 10px 0;
`;
