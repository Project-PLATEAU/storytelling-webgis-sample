import { styled } from "@linaria/react";
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  LineController,
  BarController,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import ChartDeferred from "chartjs-plugin-deferred";
import { FC, useCallback, useMemo, useRef, useState } from "react";
import { Chart } from "react-chartjs-2";

import { BASE_COLOR, PRIMARY_COLOR } from "./constants";

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  LineController,
  BarController,
  ChartDataLabels,
  ChartDeferred,
);
ChartJS.defaults.font.family = `"Noto Sans", "游ゴシック体", YuGothic, "游ゴシック Medium", "Yu Gothic Medium", "游ゴシック", "Yu Gothic", sans-serif`;
ChartJS.defaults.font.size = 14;
ChartJS.defaults.color = BASE_COLOR;
ChartJS.defaults.borderColor = BASE_COLOR;

type DatasetItem = {
  data: number[];
  legendText?: string;
  axisLabel?: string;
  axisMax?: number;
  tickStepSize?: number;
  dataLabelPrefix?: string;
};

type CompareLabel = {
  text: string;
  left?: string;
  top?: string;
};

type BarAndLineChartProps = {
  options: {
    labels: string[];
    datasets: {
      base: DatasetItem;
      primary: DatasetItem;
    };
    compareLabels?: CompareLabel[];
    isEn?: boolean;
    // Since label in English could be longer and take more space of chart, we support to set height of chart.
    chartHeight?: string;
    legendMaxWidth?: string;
  };
};

const DEFAULT_BAR_AND_LINE_CHART_HEIGHT = "226px";
const DEFAULT_LEGEND_MAX_WIDTH = "200px";

export const BarAndLineChart: FC<BarAndLineChartProps> = ({ options }) => {
  const { labels, datasets, compareLabels, isEn, chartHeight, legendMaxWidth } = options;

  const animationStarted = useRef(false);
  const [floatLabelVisible, setFloatLabelVisible] = useState(false);
  const showFloatLabels = useCallback(() => {
    setTimeout(() => {
      setFloatLabelVisible(true);
    }, 1000);
  }, []);

  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          type: "line" as const,
          borderColor: PRIMARY_COLOR,
          backgroundColor: PRIMARY_COLOR,
          borderWidth: 1,
          data: datasets.primary.data,
          yAxisID: "Line",
          datalabels: {
            color: PRIMARY_COLOR,
            offset: 5,
            align: "top" as const,
            formatter: (value: number) =>
              `${datasets.primary.dataLabelPrefix ?? ""}${value.toLocaleString()}`,
          },
        },
        {
          type: "bar" as const,
          backgroundColor: BASE_COLOR,
          data: datasets.base.data,
          borderWidth: 0,
          yAxisID: "Bar",
          datalabels: {
            color: "#FFF",
            formatter: (value: number) =>
              `${datasets.base.dataLabelPrefix ?? ""}${value.toLocaleString()}`,
          },
        },
      ],
    }),
    [labels, datasets],
  );

  const chartOptions = useMemo(
    () => ({
      events: [],
      responsive: true,
      maintainAspectRatio: false,
      deferred: {
        yOffset: "70%" as const,
        delay: 300,
      },
      animation: {
        duration: 1000,
        onProgress: () => {
          if (animationStarted.current) {
            return;
          }
          animationStarted.current = true;
          showFloatLabels();
        },
      },
      scales: {
        Line: {
          position: "right" as const,
          grid: { display: false },
          beginAtZero: true,
          ticks: {
            padding: 0,
            ...(datasets.primary.tickStepSize
              ? { stepSize: datasets.primary.tickStepSize }
              : undefined),
          },
          ...(datasets.primary.axisMax ? { max: datasets.primary.axisMax } : undefined),
        },
        Bar: {
          position: "left" as const,
          grid: { display: false },
          beginAtZero: true,
          ticks: {
            padding: 0,
            ...(datasets.base.tickStepSize ? { stepSize: datasets.base.tickStepSize } : undefined),
          },
          ...(datasets.base.axisMax ? { max: datasets.base.axisMax } : undefined),
        },
        x: {
          ticks: { font: { size: 12 }, padding: 0, autoSkip: false },
          grid: {
            display: false,
          },
        },
      },
      barPercentage: 0.7,
    }),
    [datasets, showFloatLabels],
  );

  return (
    <Wrapper>
      <AxisLabels>
        <AxisLabel>{datasets.base.axisLabel}</AxisLabel>
        <AxisLabel style={{ textAlign: "right" }}>{datasets.primary.axisLabel}</AxisLabel>
      </AxisLabels>
      <ChartWrapper height={chartHeight}>
        <Chart type="bar" data={data} options={chartOptions} />
        <LegendArea isEn={isEn} maxWidth={legendMaxWidth}>
          <Legend>
            <LegendColor color={BASE_COLOR} />
            <LegendText color={BASE_COLOR}>{datasets.base.legendText}</LegendText>
          </Legend>
          <Legend>
            <LegendColor color={PRIMARY_COLOR} />
            <LegendText color={PRIMARY_COLOR}>{datasets.primary.legendText}</LegendText>
          </Legend>
        </LegendArea>
        {compareLabels?.map((c, i) => (
          <FloatLabel key={i} left={c.left} top={c.top} visible={floatLabelVisible}>
            {c.text}
          </FloatLabel>
        ))}
      </ChartWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
  margin-top: 20px;
`;

const AxisLabels = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const AxisLabel = styled.div`
  font-size: 12px;
  max-width: 40%;
`;

const ChartWrapper = styled.div<{ height?: string }>`
  position: relative;
  height: ${({ height }) => height ?? DEFAULT_BAR_AND_LINE_CHART_HEIGHT};
  margin-top: 17px;
`;

const LegendArea = styled.div<{ isEn?: boolean; maxWidth?: string }>`
  position: absolute;
  max-width: ${({ maxWidth }) => maxWidth ?? DEFAULT_LEGEND_MAX_WIDTH};
  top: 0;
  right: 13%;
  display: flex;
  flex-direction: column;
  gap: ${({ isEn }) => (isEn ? "0px" : "8px")};
`;

const Legend = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
  justify-content: flex-start;
`;

const LegendColor = styled.div<{ color: string }>`
  width: 30px;
  height: 2px;
  flex-shrink: 0;
  background-color: ${({ color }) => color};
`;

const LegendText = styled.div<{ color: string }>`
  color: ${({ color }) => color};
  font-size: 12px;
`;

const FloatLabel = styled.div<{ left?: string; top?: string; visible: boolean }>`
  position: absolute;
  left: ${({ left }) => left ?? "50%"};
  top: ${({ top }) => top ?? "50%"};
  transform: translateY(-100%);
  font-size: 12px;
  color: #fff;
  background-color: ${PRIMARY_COLOR};
  padding: 4px 6px;
  border-radius: 30px;
  max-width: 80px;
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  transition: opacity 0.5s ease-in-out;
`;
