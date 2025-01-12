import Edge from "./models/Edge";
import Node from "./models/Node";

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

export type WayPointType = {
  path: [number, number][];
  timestamps: number[];
  color: string;
};

export type NodeNeighborsType = {
  node: Node;
  edge: Edge;
};

export type BoundaryBoxType = {
  latitude: number;
  longitude: number;
};
