import { styled } from "@linaria/react";
import { Chart, ArcElement } from "chart.js";
import ChartDataLabels, { Context as DataLabelsContext } from "chartjs-plugin-datalabels";
import ChartDeferred from "chartjs-plugin-deferred";
import { FC, useMemo } from "react";
import { Line } from "react-chartjs-2";

import { breakpointMediaQueries } from "../../../constants";

Chart.register(ArcElement, ChartDataLabels, ChartDeferred);

type DatasetItem = {
  data: number[];
  color?: string;
  legendText?: string;
  dataLegendAlign?: "start" | "end";
};

type LineChartProps = {
  options: {
    labels: string[];
    datasets: DatasetItem[];
    chartHeight?: string;
    axisLabel?: string;
    legendMaxWidth?: string;
  };
};

const DEFAULT_DATASET_OPTIONS = {
  datalabels: {
    formatter: function (value: number, context: DataLabelsContext) {
      return context.dataIndex === context.dataset.data.length - 1 ? value : "";
    },
  },
  borderWidth: 1.5,
};
const DEFAULT_LINE_CHART_HEIGHT = "252px";
const DEFAULT_LEGEND_MAX_WIDTH = "70%";

const POINT_STYLES = ["circle", "rect", "rectRot"];

export const LineChart: FC<LineChartProps> = ({ options }) => {
  const { labels, datasets, chartHeight, axisLabel, legendMaxWidth } = options;

  const data = useMemo(
    () => ({
      labels,
      datasets: datasets.map((d, i) => ({
        ...DEFAULT_DATASET_OPTIONS,
        data: d.data,
        backgroundColor: d.color,
        borderColor: d.color,
        pointStyle: POINT_STYLES[i],
        pointRadius: d.data.map((_, di) => (di === d.data.length - 1 ? 8 : 3)),
        datalabels: {
          ...DEFAULT_DATASET_OPTIONS.datalabels,
          color: d.color,
          align: d.dataLegendAlign,
          offset: 10,
          font: {
            size: 14,
          },
        },
      })),
    }),
    [labels, datasets],
  );

  const chartOptions = useMemo(
    () => ({
      clip: false as const,
      events: [],
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            font: {
              size: 12,
            },
            padding: 0,
          },
        },
        y: {
          min: 75,
          max: 100,
          grid: {
            color: "#E6E6FA",
          },
          ticks: {
            font: {
              size: 12,
            },
            padding: 0,
          },
        },
      },
      plugins: {
        deferred: {
          yOffset: "50%" as const,
          delay: 200,
        },
      },
    }),
    [],
  );

  return (
    <Wrapper>
      <ChartHeader>
        <AxisLabel>{axisLabel}</AxisLabel>
        <LegendArea maxWidth={legendMaxWidth}>
          {datasets.map((d, i) => (
            <Legend key={i}>
              <LegendColor color={d.color} />
              <LegendText color={d.color}>{d.legendText}</LegendText>
            </Legend>
          ))}
        </LegendArea>
      </ChartHeader>
      <ChartWrapper height={chartHeight}>
        <Line data={data} options={chartOptions} />
      </ChartWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
`;

const ChartHeader = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
`;

const AxisLabel = styled.div`
  font-size: 12px;
  max-width: 30%;
`;

const LegendArea = styled.div<{ maxWidth?: string }>`
  max-width: ${({ maxWidth }) => maxWidth ?? DEFAULT_LEGEND_MAX_WIDTH};
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  gap: 30px;
  ${breakpointMediaQueries.md} {
    flex-direction: column;
    width: auto;
    gap: 2px;
  }
`;

const Legend = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
  justify-content: flex-start;
`;

const LegendColor = styled.div<{ color?: string }>`
  width: 30px;
  height: 2px;
  flex-shrink: 0;
  background-color: ${({ color }) => color ?? "black"};
`;

const LegendText = styled.div<{ color?: string }>`
  color: ${({ color }) => color ?? "black"};
  font-size: 12px;
`;

const ChartWrapper = styled.div<{ height?: string }>`
  position: relative;
  height: ${({ height }) => height ?? DEFAULT_LINE_CHART_HEIGHT};
  margin-top: 17px;
`;
