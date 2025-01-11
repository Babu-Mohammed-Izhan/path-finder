import { NodeNeighborsType } from "../types";
import Edge from "./Edge";

export default class Node {
  edges: Edge[];
  id: number;
  latitude: number;
  longitude: number;
  visited: boolean;
  distanceFromStart: number = 0;
  distanceToEnd: number = 0;
  parent: null = null;
  referer: Node | null = null;
  neighbors: NodeNeighborsType[] = [];

  constructor(id: number, latitude: number, longitude: number) {
    this.edges = [];
    this.reset();
    this.id = id;
    this.latitude = latitude;
    this.longitude = longitude;
    this.visited = false;
  }

  get totalDistance(): number {
    return this.distanceFromStart + this.distanceToEnd;
  }

  get neighbours() {
    return this.edges.map((edge) => ({ edge, node: edge.getOtherNode(this) }));
  }

  connectTo(node: Node) {
    // Create new edge with this node and the node passed in props
    const newEdge = new Edge(this, node);
    // Push the new edge to the two nodes
    this.edges.push(newEdge);
    node.edges.push(newEdge);
  }

  reset() {
    // Reset data of Nodes
    this.visited = false;
    this.distanceFromStart = 0;
    this.distanceToEnd = 0;
    this.parent = null;
    this.referer = null;

    for (const neighbor of this.neighbors) {
      neighbor.edge.visited = false;
    }
  }
}
