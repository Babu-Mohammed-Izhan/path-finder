export default class Node {
  edges: never[];
  id: number;
  latitude: number;
  longitude: number;
  visited: boolean;
  distanceFromStart: number = 0;
  distanceToEnd: number = 0;
  parent: null = null;
  referer: null = null;

  constructor(id: number, latitude: number, longitude: number) {
    this.edges = [];
    this.reset();
    this.id = id;
    this.latitude = latitude;
    this.longitude = longitude;
    this.visited = false;
  }
  reset() {
    this.visited = false;
    this.distanceFromStart = 0;
    this.distanceToEnd = 0;
    this.parent = null;
    this.referer = null;
  }
}
