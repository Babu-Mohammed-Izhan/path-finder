import Node from "./models/Node";

const getNearestNodeToPath = (lat: number, long: number): Node => {
  const result = new Node(1, lat, long);

  return result;
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

export { getNearestNodeToPath, createCircleBoundary, getBoxFromBoundary };
