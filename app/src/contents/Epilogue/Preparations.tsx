import { styled } from "@linaria/react";
import { FC } from "react";
import { useTranslation } from "react-i18next";

import { WidthLimitedContent } from "../../components/Contents/BaseContent";

type Props = {};

export const Preparations: FC<Props> = () => {
  const { t } = useTranslation();

  return (
    <WidthLimitedContent>
      <h2>{t("Let’s Get Prepared")}</h2>

      <LinksGrid>
        <div>
          <h3>
            <a
              href="https://www.bousai.metro.tokyo.lg.jp/1002147/1007120.html"
              target="_blank"
              rel="noreferrer">
              {t("Disaster Preparedness Tokyo")}
            </a>
          </h3>
          <p>
            {t(
              '"Disaster Preparedness Tokyo" is a fully Tokyo-specific disaster preparedness guide that takes into account Tokyo\'s regional characteristics, urban structure, and the lifestyle of its residents. It provides easy-to-understand information on proactive preparation for disasters, as well as how to respond during emergencies, making it a valuable resource that can be utilized immediately and proves useful when the need arises.',
            )}
          </p>
        </div>

        <div>
          <h3>
            <a
              href="https://www.bousai.metro.tokyo.lg.jp/1005427/1005746.html"
              target="_blank"
              rel="noreferrer">
              {t("Disaster Readiness Guide")}
            </a>
          </h3>
          <p>
            {t(
              "It includes disaster prevention measures that can be easily implemented in daily life, such as breastfeeding and crime prevention measures in evacuation shelters, as well as solutions to various challenges faced during disaster-affected living conditions.",
            )}
          </p>
        </div>

        <div>
          <h3>
            <a
              href="https://www.bousai.metro.tokyo.lg.jp/1028747/index.html"
              target="_blank"
              rel="noreferrer">
              {t("The Disaster Preparedness Tokyo App")}
            </a>
          </h3>
          <p>
            {t(
              "It is the official Tokyo disaster prevention app that is useful both in everyday life and in times of emergency. With the concept of 'play,' 'learn,' and 'use,' it is equipped with content that is helpful during disasters, allowing users to gain basic knowledge of disaster prevention in an enjoyable way.",
            )}
          </p>
        </div>
        <div>
          <h3>
            <a
              href="https://www.kantei.go.jp/jp/headline/bousai/sonae.html"
              target="_blank"
              rel="noreferrer">
              {t("Things to Do Before a Disaster Strikes")}
            </a>
          </h3>
          <p>
            {t(
              "It's a website that summarizes what you can do before a disaster strikes, including how to arrange furniture, what to stockpile, and a checklist for emergency evacuation bags.",
            )}
          </p>
        </div>
      </LinksGrid>
    </WidthLimitedContent>
  );
};

const LinksGrid = styled.div`
  display: grid;
  grid-template:
    "1fr 1fr"
    "1fr 1fr";
  gap: 20px;
  margin: 20px 0;
`;
