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

export { getNearestNodeToPath, createCircleBoundary };
