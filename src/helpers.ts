import Node from "./models/Node";

const getNearestNodeToPath = (lat: number, long: number): Node => {
  const result = new Node(1, lat, long);

  return result;
};

export { getNearestNodeToPath };
