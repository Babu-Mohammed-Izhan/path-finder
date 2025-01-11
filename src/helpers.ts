import getMapData from "./api/getMapData";
import Graph from "./models/Graph";
import Node from "./models/Node";
import { BoundaryBoxType } from "./types";

const getNearestNodeToPath = async (
  lat: number,
  long: number
): Promise<Node> => {
  const boundaryCircle = createCircleBoundary(lat, long, 0.15);
  const boundaryBox = getBoxFromBoundary(boundaryCircle);
  const mapDataResponse = await getMapData(boundaryBox);
  const mapData = await mapDataResponse.json();

  let result: Node | null = null;

  for (const node of mapData.elements) {
    if (node.type !== "node") continue;
    if (!result) {
      result = new Node(node.id, node.lat, node.lon);
      continue;
    }

    const newLength = Math.sqrt(
      Math.pow(node.lat - lat, 2) + Math.pow(node.lon - long, 2)
    );
    const resultLength = Math.sqrt(
      Math.pow(result.latitude - lat, 2) + Math.pow(result.longitude - long, 2)
    );

    if (newLength < resultLength) {
      result = new Node(node.id, node.lat, node.lon);
    }
  }

  if (result) {
    return result;
  }

  return new Node(0, 0, 0);
};

const createCircleBoundary = (
  lat: number,
  long: number,
  radius: number = 6
) => {
  const points = 64;
  const centerCoordinates = {
    lat,
    long,
  };

  const boundry: number[][] = [];
  const XaxisDistance =
    radius / (111.32 * Math.cos((centerCoordinates.lat * Math.PI) / 180));
  const YaxisDistance = radius / 110.574;

  let theta, x, y;

  for (let i = 0; i < points; i++) {
    theta = (i / points) * (2 * Math.PI);
    x = XaxisDistance * Math.cos(theta);
    y = YaxisDistance * Math.sin(theta);

    boundry.push([centerCoordinates.long + x, centerCoordinates.lat + y]);
  }

  boundry.push(boundry[0]);

  return boundry;
};

const getBoxFromBoundary = (circleBoundary: number[][]) => {
  // Default BoundaryBox with Maximum values
  const boundaryBox = {
    minLat: Number.MAX_VALUE,
    maxLat: -Number.MAX_VALUE,
    minLon: Number.MAX_VALUE,
    maxLon: -Number.MAX_VALUE,
  };

  // Check all circle values,
  // for minLat and minLon, if value is smaller than boundaryBox, use that value, default is smallest possible number
  // for maxLat and maxLon , if value is bigger than boudaryBox, use that value,  default is largest possible number
  for (const coord of circleBoundary) {
    if (coord[0] < boundaryBox.minLon) boundaryBox.minLon = coord[0];
    if (coord[0] > boundaryBox.maxLon) boundaryBox.maxLon = coord[0];
    if (coord[1] < boundaryBox.minLat) boundaryBox.minLat = coord[1];
    if (coord[1] > boundaryBox.maxLat) boundaryBox.maxLat = coord[1];
  }

  const boundaryBoxResult = [
    { latitude: boundaryBox.minLat, longitude: boundaryBox.minLon },
    { latitude: boundaryBox.maxLat, longitude: boundaryBox.maxLon },
  ];

  return boundaryBoxResult;
};

const getGraphDataFromMap = async (
  boundaryBox: BoundaryBoxType[],
  startNodeId: number
) => {
  const mapDataResponse = await getMapData(boundaryBox);
  const data = await mapDataResponse.json();
  const elements = data.elements;

  const graph = new Graph();

  for (const element of elements) {
    if (element.type === "node") {
      const node = graph.addNode(element.id, element.lat, element.lon);

      if (node.id === startNodeId) {
        graph.startNode = node;
      }
    }
    if (element.type === "way") {
      if (!element.nodes || element.nodes.length < 2) continue;

      for (let i = 0; i < element.nodes.length - 1; i++) {
        const node1 = graph.getNode(element.nodes[i]);
        const node2 = graph.getNode(element.nodes[i + 1]);

        if (!node1 || !node2) {
          continue;
        }

        node1.connectTo(node2);
      }
    }
  }

  return graph;
};

export {
  getNearestNodeToPath,
  createCircleBoundary,
  getBoxFromBoundary,
  getGraphDataFromMap,
};
