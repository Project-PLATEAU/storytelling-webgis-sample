import { styled } from "@linaria/react";
import { FC } from "react";

import { breakpointMediaQueries } from "../../constants";
import { MarkerData } from "../../utils/types/common";

type InfoboxProps = MarkerData;

export const Infobox: FC<InfoboxProps> = ({ screenPosition, attributes }) => {
  const { x, y } = screenPosition;

  return (
    <StyledInfobox x={x} y={y}>
      <StyledTable>
        <tbody>
          {attributes.map((attribute, i) => (
            <tr key={i}>
              <td>{attribute.name}</td>
              <td>{attribute.value}</td>
            </tr>
          ))}
        </tbody>
      </StyledTable>
    </StyledInfobox>
  );
};

const StyledInfobox = styled.div<{ x: number; y: number }>`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  background-color: #ffffff;
  font-size: 0.9em;
  padding: 10px;
  width: 300px;
  z-index: 9999;
  position: absolute;
  left: ${({ x }) => x - 300 / 2}px;
  top: ${({ y }) => y - 220}px;

  ${breakpointMediaQueries.md} {
    width: 200px;
    font-size: 0.6em;
    padding: 5px;
    left: ${({ x }) => x - 200 / 2}px;
    top: ${({ y }) => y - 160}px;
  }
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 10px;
  border: none;

  td {
    border-bottom: 1px solid transparent;
    vertical-align: top;
  }

  tr:last-child td {
    border-bottom: none;
  }
`;
