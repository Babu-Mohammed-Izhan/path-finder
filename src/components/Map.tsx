/* eslint-disable @typescript-eslint/no-unused-vars */
import DeckGL from "@deck.gl/react";
import { Map as MapGL } from "react-map-gl/maplibre";
import { INITIAL_COLORS, INITIAL_VIEW_STATE, MAP_STYLE } from "../constants";
import { useState } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import { FlyToInterpolator, MapViewState, PickingInfo } from "deck.gl";
import { MjolnirEvent } from "mjolnir.js";
import { PolygonLayer, ScatterplotLayer } from "@deck.gl/layers";
import Node from "../models/Node";
import { ColorsType, ScatterPlotType } from "../types";
import { getScatterPlotData } from "../hooks/common";
import { getNearestNodeToPath } from "../helpers";
import { Color } from "maplibre-gl";

const Map = () => {
  const [viewState, setViewState] = useState<MapViewState>(INITIAL_VIEW_STATE);
  const [startNode, setStartNode] = useState<Node | null>(null);
  const [endNode, setEndNode] = useState<Node | null>(null);
  const [colors, setColors] = useState<ColorsType>(INITIAL_COLORS);
  const [selectionRadius, setSelectionRadius] = useState([]);

  function changeLocation(location: MapViewState) {
    setViewState({
      ...viewState,
      longitude: location.longitude,
      latitude: location.latitude,
      zoom: 13,
      transitionDuration: 1,
      transitionInterpolator: new FlyToInterpolator(),
    });
  }

  const mapClick = async (
    info: PickingInfo,
    event: MjolnirEvent,
    radius = null
  ) => {
    // Place Start Node
    if (info.coordinate && startNode == null) {
      const node = getNearestNodeToPath(info.coordinate[1], info.coordinate[0]);
      setStartNode(node);
      setEndNode(null);
    }

    // Place End Node
    if (info.coordinate && startNode != null && endNode == null) {
      const node = getNearestNodeToPath(info.coordinate[1], info.coordinate[0]);
      setEndNode(node);
    }

    // If click map again, reset nodes and place start node
    if (info.coordinate && startNode != null && endNode != null) {
      setStartNode(null);
      setEndNode(null);
      const node = getNearestNodeToPath(info.coordinate[1], info.coordinate[0]);
      setStartNode(node);
    }
  };

  const scatterPlotLayer = new ScatterplotLayer<ScatterPlotType>({
    id: "the-two-points",
    data: getScatterPlotData(startNode, endNode, colors),
    pickable: true,
    opacity: 1,
    stroked: true,
    filled: true,
    radiusScale: 1,
    radiusMinPixels: 7,
    radiusMaxPixels: 20,
    lineWidthMinPixels: 1,
    lineWidthMaxPixels: 1,
    getPosition: (d: ScatterPlotType) => d.coordinates,
    getFillColor: (d: ScatterPlotType) => {
      return [d.color[0], d.color[1], d.color[2], 255]; // Assuming 255 for full opacity
    },
    getLineColor: [0, 0, 0],
    getLineWidth: 10,
  });

  const polygonLayer = new PolygonLayer({
    id: "selection-radius",
    data: selectionRadius,
    pickable: true,
    stroked: true,
    getFillColor: [80, 210, 0, 10],
    getLineColor: [9, 142, 46, 175],
    getLineWidth: 3,
    opacity: 1,
    getPolygon: (d: { contour: number[][] }) => d.contour,
  });

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      style={{ height: "100vh", width: "100vw" }}
    >
      <DeckGL
        initialViewState={viewState}
        controller={{ doubleClickZoom: false, keyboard: false }}
        layers={[polygonLayer, scatterPlotLayer]}
        style={{ position: "absolute", width: "100%", height: "100%" }}
        onClick={mapClick}
      >
        <MapGL
          reuseMaps
          mapStyle={MAP_STYLE}
          style={{ position: "absolute", width: "100%", height: "100%" }}
          initialViewState={viewState}
        />
      </DeckGL>
    </div>
  );
};

export default Map;
