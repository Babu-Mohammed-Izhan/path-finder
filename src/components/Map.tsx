/* eslint-disable @typescript-eslint/no-unused-vars */
import DeckGL from "@deck.gl/react";
import { Map as MapGL } from "react-map-gl/maplibre";
import { INITIAL_VIEW_STATE, MAP_STYLE } from "../constants";
import { useState } from "react";
import "maplibre-gl/dist/maplibre-gl.css";

const Map = () => {
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      style={{ height: "100vh", width: "100vw" }}
    >
      <DeckGL
        initialViewState={viewState}
        controller={true} // Enable interaction handling
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
