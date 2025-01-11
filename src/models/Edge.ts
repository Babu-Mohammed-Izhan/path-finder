import Node from "./Node";

export default class Edge {
  node1: Node;
  node2: Node;
  visited: boolean;

  constructor(node1: Node, node2: Node) {
    this.node1 = node1;
    this.node2 = node2;
    this.visited = false;
  }

  getOtherNode(node: Node): Node {
    // Get the other node of the edge when calling from one of the nodes
    return node === this.node1 ? this.node2 : this.node1;
  }

  getWeight(): number {
    // Weight is the distance between the 2 nodes
    return Math.hypot(
      this.node1.latitude - this.node2.latitude,
      this.node1.longitude - this.node2.longitude
    );
  }
}
