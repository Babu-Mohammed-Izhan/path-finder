import Node from "../Node";

export default class PathfindingAlgorithm {
  finished: boolean;
  startNode: Node = new Node(0, 0, 0);
  endNode: Node = new Node(0, 0, 0);

  constructor() {
    this.finished = false;
  }

  start(startNode: Node, endNode: Node) {
    this.finished = false;
    this.startNode = startNode;
    this.endNode = endNode;
  }

  nextStep() {
    return [];
  }
}
