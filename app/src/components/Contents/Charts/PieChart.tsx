import { styled } from "@linaria/react";
import { Chart, ArcElement } from "chart.js";
import ChartDeferred from "chartjs-plugin-deferred";
import { CountUp } from "countup.js";
import { FC, useCallback, useEffect, useMemo, useRef } from "react";
import { Pie } from "react-chartjs-2";

import { BASE_COLOR, HIGHLIGHT_COLOR } from "./constants";

Chart.register(ArcElement, ChartDeferred);

export type PieChartProps = {
  percent?: number;
  title?: string;
};

export const PieChart: FC<PieChartProps> = ({ percent = 0, title }) => {
  const animationStarted = useRef(false);

  const countupRef = useRef(null);
  const counterRef = useRef<CountUp | null>(null);

  useEffect(() => {
    if (countupRef.current) {
      counterRef.current = new CountUp(countupRef.current, percent, {
        duration: 2,
        decimalPlaces: 1,
      });
    }
  }, [percent]);

  const countPosition = useMemo(() => (percent > 75 ? "bottom" : "right"), [percent]);

  const startCountUp = useCallback(() => {
    counterRef.current?.start();
  }, []);

  const data = useMemo(
    () => ({
      datasets: [
        {
          data: [percent, 100 - percent],
          backgroundColor: [HIGHLIGHT_COLOR, BASE_COLOR],
          borderWidth: 0,
          datalabels: {
            display: false,
          },
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

  return (
    <Wrapper>
      <PieWrapper>
        <Pie data={data} options={options} />
        <CounterWrapper pos={countPosition}>
          <Counter ref={countupRef}>0</Counter>
          <Unit>%</Unit>
        </CounterWrapper>
      </PieWrapper>

      {!!title && <Title>{title}</Title>}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
  margin-top: 20px;
`;

const PieWrapper = styled.div`
  position: relative;
`;

const Title = styled.div`
  text-align: center;
  font-size: 12px;
  margin-top: 6px;
`;

const CounterWrapper = styled.div<{ pos: "bottom" | "right" }>`
  position: absolute;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 3px;
  align-items: flex-end;
  top: ${({ pos }) => (pos === "bottom" ? "72%" : "50%")};
  left: ${({ pos }) => (pos === "bottom" ? "50%" : "75%")};
`;

const Counter = styled.div`
  font-size: 20px;
  font-weight: bold;
`;

const Unit = styled.div`
  font-size: 12px;
  font-weight: bold;
  padding-bottom: 3px;
`;
