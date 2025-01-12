import Node from "../Node";
import PathfindingAlgorithm from "./PahtFindingAlgorithm";

export default class Dijkstra extends PathfindingAlgorithm {
  openList: Node[];

  constructor() {
    super();
    this.openList = [];
  }

  start(startNode: Node, endNode: Node): void {
    super.start(startNode, endNode);
    this.openList.push(startNode);
  }

  nextStep(): Node[] {
    if (this.openList.length === 0) {
      this.finished = true;
      return [];
    }

    const updatedNodes = <Node[]>[];
    const currentNode = this.openList.shift();
    if (!currentNode) return updatedNodes;

    // Mark current node as visited
    currentNode.visited = true;
    // Find edge which has link between current node and the referer node
    const refEdge = currentNode.edges.find(
      (e) => e.getOtherNode(currentNode) === currentNode.referer
    );
    // Mark the referer edge as visited
    if (refEdge) refEdge.visited = true;

    // Iterate through all the neighbors of the current node
    for (const n of currentNode.neighbours) {
      const neighbor = n.node;
      const edge = n.edge;

      // if neighbor node is visited and edge is not visited
      // mark edge as visited
      if (neighbor.visited && !edge.visited) {
        edge.visited = true;
        neighbor.referer = currentNode;
        updatedNodes.push(neighbor);
      }

      if (neighbor.visited) continue;

      const neighborCostFromCurrent =
        currentNode.distanceFromStart + edge.getWeight();

      if (this.openList.includes(neighbor)) {
        if (neighborCostFromCurrent >= neighbor.distanceFromStart) {
          continue;
        }
      } else {
        this.openList.push(neighbor);
      }

      neighbor.distanceFromStart = neighborCostFromCurrent;
      neighbor.parent = currentNode;
      neighbor.referer = currentNode;
    }

    return [...updatedNodes, currentNode];
  }
}
