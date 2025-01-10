export type PlotType = {
  coordinates: [number, number]; // Tuple representing longitude and latitude
  color: number[]; // Color for the fill
  lineColor: number[]; // Color for the border
};

export type ColorsType = {
  startNodeFill: number[];
  startNodeBorder: number[];
  endNodeFill: number[];
  endNodeBorder: number[];
  path: number[];
  route: number[];
};
