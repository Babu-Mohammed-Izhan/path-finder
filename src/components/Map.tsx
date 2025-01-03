/* eslint-disable @typescript-eslint/no-unused-vars */
import DeckGL from "@deck.gl/react";
import { Map as MapGL } from "react-map-gl/maplibre";
import { INITIAL_VIEW_STATE, MAP_STYLE } from "../constants";
import { useState } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import { FlyToInterpolator, MapViewState } from "deck.gl";

const Map = () => {
  const [viewState, setViewState] = useState<MapViewState>(INITIAL_VIEW_STATE);

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

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      style={{ height: "100vh", width: "100vw" }}
    >
      <DeckGL
        initialViewState={viewState}
        controller={{ doubleClickZoom: false, keyboard: false }}
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
