/* eslint-disable @typescript-eslint/no-unused-vars */
import DeckGL from "@deck.gl/react";
import { Map as MapGL } from "react-map-gl/maplibre";
import { INITIAL_COLORS, INITIAL_VIEW_STATE, MAP_STYLE } from "../constants";
import { useState } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import { FlyToInterpolator, MapViewState } from "deck.gl";
import { ScatterplotLayer } from "@deck.gl/layers";
import Node from "../models/Node";
import { ColorsType, ScatterPlotType } from "../types";
import { getScatterPlotData } from "../hooks/common";

const Map = () => {
  const [viewState, setViewState] = useState<MapViewState>(INITIAL_VIEW_STATE);
  const [startNode, setStartNode] = useState<Node | null>(null);
  const [endNode, setEndNode] = useState<Node | null>(null);
  const [colors, setColors] = useState<ColorsType>(INITIAL_COLORS);

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
    getFillColor: [255, 140, 0],
    getLineColor: [0, 0, 0],
    getLineWidth: 10,
  });

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      style={{ height: "100vh", width: "100vw" }}
    >
      <DeckGL
        initialViewState={viewState}
        controller={{ doubleClickZoom: false, keyboard: false }}
        layers={[scatterPlotLayer]}
        style={{ position: "absolute", width: "100%", height: "100%" }}
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
