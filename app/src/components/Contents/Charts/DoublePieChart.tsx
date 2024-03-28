import { styled } from "@linaria/react";
import { FC } from "react";

import { ArrowRight } from "../../icons/ArrowRight";

import { PieChart, PieChartProps } from ".";

type DoublePieChartProps = {
  pie1: PieChartProps;
  pie2: PieChartProps;
};

export const DoublePieChart: FC<DoublePieChartProps> = ({ pie1, pie2 }) => {
  return (
    <Wrapper>
      <PieWrapper>
        <PieChart {...pie1} />
      </PieWrapper>
      <ArrowRight />
      <PieWrapper>
        <PieChart {...pie2} />
      </PieWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const PieWrapper = styled.div`
  width: 45%;
`;
