import { BoundaryBoxType } from "../types";

const highWayExclude = [
  "footway",
  "street_lamp",
  "steps",
  "pedestrian",
  "track",
  "path",
];

const getMapData = (boundaryBox: BoundaryBoxType[]) => {
  const exclusion = highWayExclude.map((e) => `[highway!="${e}"]`).join("");
  const query = `
    [out:json];(
        way[highway]${exclusion}[footway!="*"]
        (${boundaryBox[0].latitude},${boundaryBox[0].longitude},${boundaryBox[1].latitude},${boundaryBox[1].longitude});
        node(w);
    );
    out skel;`;

  return fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: query,
  });
};

export default getMapData;
