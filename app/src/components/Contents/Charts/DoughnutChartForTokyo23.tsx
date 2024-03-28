import { styled } from "@linaria/react";
import { Chart, ArcElement } from "chart.js";
import ChartDeferred from "chartjs-plugin-deferred";
import { CountUp } from "countup.js";
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { useTranslation } from "react-i18next";

import { BASE_COLOR, HIGHLIGHT_COLOR } from "./constants";

Chart.register(ArcElement, ChartDeferred);

export const DoughnutChartForTokyo23: FC = () => {
  const { t } = useTranslation();

  const percent = (100 * 1161714) / (1161714 + 602225);
  const title = t("Population: 9,733,276 people");

  const [labelVisible, setLabelVisible] = useState(false);
  const animationStarted = useRef(false);

  const countup1Ref = useRef(null);
  const counter1Ref = useRef<CountUp | null>(null);

  const countup2Ref = useRef(null);
  const counter2Ref = useRef<CountUp | null>(null);

  useEffect(() => {
    if (countup1Ref.current) {
      counter1Ref.current = new CountUp(countup1Ref.current, 1161714, {
        duration: 2,
        decimalPlaces: 0,
      });
    }
    if (countup2Ref.current) {
      counter2Ref.current = new CountUp(countup2Ref.current, 602225, {
        duration: 2,
        decimalPlaces: 0,
      });
    }
  }, []);

  const startCountUp = useCallback(() => {
    setTimeout(() => {
      setLabelVisible(true);
      counter1Ref.current?.start();
      counter2Ref.current?.start();
    }, 200);
  }, []);

  const data = useMemo(
    () => ({
      datasets: [
        {
          data: [percent, 100 - percent],
          backgroundColor: [BASE_COLOR, "transparent"],
          borderWidth: 0,
          datalabels: {
            display: false,
          },
          cutout: "20%",
        },
        {
          data: [percent, 100 - percent],
          backgroundColor: [BASE_COLOR, HIGHLIGHT_COLOR],
          borderWidth: 0,
          datalabels: {
            display: false,
          },
          cutout: "21%",
        },
        {
          data: [percent, 100 - percent],
          backgroundColor: [BASE_COLOR, HIGHLIGHT_COLOR],
          borderWidth: 0,
          datalabels: {
            display: false,
          },
          cutout: "22%",
        },
        {
          data: [percent, 100 - percent],
          backgroundColor: [BASE_COLOR, HIGHLIGHT_COLOR],
          borderWidth: 0,
          datalabels: {
            display: false,
          },
          cutout: "23%",
        },
        {
          data: [percent, 100 - percent],
          backgroundColor: [BASE_COLOR, "transparent"],
          borderWidth: 0,
          datalabels: {
            display: false,
          },
          cutout: "24%",
        },
      ],
    }),
    [percent],
  );

  const options = useMemo(
    () => ({
      events: [],
      plugins: {
        deferred: {
          yOffset: "50%" as const,
          delay: 200,
        },
      },
      animation: {
        onProgress: () => {
          if (animationStarted.current) {
            return;
          }
          animationStarted.current = true;
          startCountUp();
        },
      },
    }),
    [startCountUp],
  );

  const label1Position = useMemo(() => ({ top: "55%", left: "80%" }), []);
  const label2Position = useMemo(() => ({ top: "40%", left: "23%" }), []);

  useEffect(() => {
    if (animationStarted.current) {
      counter1Ref.current?.start();
      counter2Ref.current?.start();
    }
  }, []);

  return (
    <Wrapper>
      <DoughnutWrapper>
        <Doughnut data={data} options={options} />
        <CounterWrapper style={label1Position} color={"#FFF"} visible={labelVisible}>
          <Label>
            <MainLabel>{t("Wooden")}</MainLabel>
          </Label>
          <Counter ref={countup1Ref}>0</Counter>
          <Unit>{t("Buildings")}</Unit>
        </CounterWrapper>
        <CounterWrapper style={label2Position} color={BASE_COLOR} visible={labelVisible}>
          <Label>
            <MainLabel>{t("Non wooden")}</MainLabel>
            <SubLabel>{t("Etc.")}</SubLabel>
          </Label>
          <Counter ref={countup2Ref}>0</Counter>
          <Unit>{t("Buildings")}</Unit>
        </CounterWrapper>
      </DoughnutWrapper>

      {!!title && <Title>{title}</Title>}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
  margin-top: 20px;
`;

const DoughnutWrapper = styled.div`
  position: relative;
`;

const Label = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 3px;
`;

const MainLabel = styled.div`
  font-size: 20px;
  font-weight: 700;
`;

const SubLabel = styled.div`
  font-size: 12px;
  font-weight: 700;
  padding-bottom: 3px;
`;

const Title = styled.div`
  text-align: center;
  font-size: 20px;
  margin-top: 15px;
`;

const CounterWrapper = styled.div<{
  left?: string;
  top?: string;
  color?: string;
  visible?: boolean;
}>`
  position: absolute;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  top: ${({ left }) => left || "50%"};
  left: ${({ top }) => top || "50%"};
  color: ${({ color }) => color || BASE_COLOR};
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  transition: opacity 0.5s ease-in-out;
`;

const Counter = styled.div`
  font-size: 24px;
  font-weight: 400;
`;

const Unit = styled.div`
  font-size: 12px;
  font-weight: 700;
`;
