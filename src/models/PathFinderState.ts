import PathfindingAlgorithm from "./algorithms/PahtFindingAlgorithm";

export default class PathFinderState {
  static instance: PathFinderState;
  endNode: Node | null = null;
  graph: null = null;
  finished = false;
  algorithm: PathfindingAlgorithm = new PathfindingAlgorithm();

  constructor() {
    if (!PathFinderState.instance) {
      this.endNode = null;
      this.graph = null;
      this.finished = false;
      this.algorithm = new PathfindingAlgorithm();
      PathFinderState.instance = this;
    }

    return PathFinderState.instance;
  }

  start(algorithm: string) {
    if (algorithm === "dijkstra") {
      this.algorithm = new PathfindingAlgorithm();
    }
    if (algorithm === "astar") {
      this.algorithm = new PathfindingAlgorithm();
    }
  }
}
