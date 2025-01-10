import Node from "../models/Node";
import { ColorsType, PlotType } from "../types";

const getScatterPlotData = (
  startNode: Node | null,
  endNode: Node | null,
  colors: ColorsType
) => {
  const scatterPlotData: PlotType[] = [
    ...(startNode != null
      ? [
          {
            coordinates: [startNode.longitude, startNode.latitude] as [
              number,
              number
            ],
            color: colors.startNodeFill,
            lineColor: colors.startNodeBorder,
          },
        ]
      : []),
    ...(endNode != null
      ? [
          {
            coordinates: [endNode.longitude, endNode.latitude] as [
              number,
              number
            ],
            color: colors.endNodeFill,
            lineColor: colors.endNodeBorder,
          },
        ]
      : []),
  ];
  return scatterPlotData;
};

export { getScatterPlotData };
