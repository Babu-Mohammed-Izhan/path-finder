import DeckGL from "deck.gl";
import { Map as MapGL } from "react-map-gl/maplibre";
import { INITIAL_VIEW_STATE, MAP_STYLE } from "../constants";
import "maplibre-gl/dist/maplibre-gl.css";

const Map = () => {
  return (
    <div>
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={{ doubleClickZoom: false, keyboard: false }}
        onClick={() => console.log("Clicked")}
      >
        <MapGL reuseMaps mapStyle={MAP_STYLE} doubleClickZoom={false} />
      </DeckGL>
    </div>
  );
};

export default Map;
