import Node from "./Node";

export default class Graph {
  startNode: Node = new Node(0, 0, 0);
  nodes: Map<number, Node>;

  constructor() {
    this.nodes = new Map();
  }

  getNode(id: number) {
    return this.nodes.get(id);
  }

  addNode(id: number, lat: number, long: number) {
    const node = new Node(id, lat, long);
    this.nodes.set(node.id, node);
    return node;
  }
}
