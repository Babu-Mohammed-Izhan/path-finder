import Dijkstra from "./algorithms/Dijkstra";
import PathfindingAlgorithm from "./algorithms/PahtFindingAlgorithm";
import Graph from "./Graph";
import Node from "./Node";

export default class PathFinderState {
  static instance: PathFinderState;
  endNode: Node = new Node(0, 0, 0);
  graph: Graph = new Graph();
  finished = false;
  algorithm: PathfindingAlgorithm = new PathfindingAlgorithm();

  constructor() {
    if (!PathFinderState.instance) {
      this.finished = false;
      this.algorithm = new PathfindingAlgorithm();
      PathFinderState.instance = this;
    }

    return PathFinderState.instance;
  }

  getNode(id: number) {
    return this.graph.getNode(id);
  }

  start(algorithm: string) {
    if (algorithm === "dijkstra") {
      this.algorithm = new Dijkstra();
    }

    this.algorithm.start(this.graph.startNode, this.endNode);
  }

  nextStep() {
    const updatedNodes = this.algorithm.nextStep();
    if (updatedNodes && updatedNodes.length === 0) {
      this.finished = true;
    }

    return updatedNodes;
  }

  reset() {
    this.finished = false;
    if (this.graph) {
      for (const k of this.graph.nodes.keys()) {
        this.graph.nodes.get(k)?.reset();
      }
    }
  }
}
