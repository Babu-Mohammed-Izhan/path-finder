/* eslint-disable @typescript-eslint/no-unused-vars */
import DeckGL from "@deck.gl/react";
import { Map as MapGL } from "react-map-gl/maplibre";
import { INITIAL_COLORS, INITIAL_VIEW_STATE, MAP_STYLE } from "../constants";
import { useEffect, useRef, useState } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  Color,
  FlyToInterpolator,
  MapViewState,
  PickingInfo,
  TripsLayer,
} from "deck.gl";
import { MjolnirEvent } from "mjolnir.js";
import { PolygonLayer, ScatterplotLayer } from "@deck.gl/layers";
import Node from "../models/Node";
import { ColorsType, PlotType, WayPointType } from "../types";
import { getScatterPlotData } from "../hooks/common";
import {
  createCircleBoundary,
  getBoxFromBoundary,
  getGraphDataFromMap,
  getNearestNodeToPath,
} from "../helpers";
import PathFinderState from "../models/PathFinderState";

const Map = () => {
  const [viewState, setViewState] = useState<MapViewState>(INITIAL_VIEW_STATE);
  const [startNode, setStartNode] = useState<Node | null>(null);
  const [endNode, setEndNode] = useState<Node | null>(null);
  const [colors, setColors] = useState<ColorsType>(INITIAL_COLORS);
  const [selectionRadius, setSelectionRadius] = useState<any>([]);
  const [time, setTime] = useState(0);
  const [pathData, setPathData] = useState<WayPointType[]>([]);
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [playbackDirection, setPlaybackDirection] = useState(1);
  const [animationEnded, setAnimationEnded] = useState(false);

  const state = useRef(new PathFinderState());
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();
  const wayPoints = useRef<WayPointType[]>([]);
  const timer = useRef(0);
  const routeNode = useRef<Node>();

  useEffect(() => {
    if (!started) return;
    requestRef.current = requestAnimationFrame(animate);
  }, [started]);

  const mapClick = async (info: PickingInfo, _e: MjolnirEvent) => {
    clearPath();

    const loadingTime = setTimeout(() => {
      setLoading(true);
    }, 300);

    // Place Start Node and Create Circle Boundry
    if (info.coordinate && startNode == null) {
      const loadingHandle = setTimeout(() => {
        setLoading(true);
      }, 300);

      const node = await getNearestNodeToPath(
        info.coordinate[1],
        info.coordinate[0]
      );

      if (!node) {
        console.log(
          "No path was found in the vicinity, please try another location."
        );
        clearTimeout(loadingHandle);
        setLoading(false);
        return;
      }
      setStartNode(node);
      setEndNode(null);
      const circleBoundary = createBoudaryCirle(node);
      const boudaryBox = getBoxFromBoundary(circleBoundary);

      // Create graph using map Data
      const graph = await getGraphDataFromMap(boudaryBox, node.id);
      state.current.graph = graph;
      clearPath();
      clearTimeout(loadingTime);
      setLoading(false);
    }

    // Place End Node
    if (info.coordinate && startNode != null && endNode == null) {
      if (info.layer?.id !== "selection-radius") {
        console.log("Select point inside circle");
        return;
      }

      if (loading) {
        console.log("Please wait for all data to load.", "info");
        return;
      }

      const node = await getNearestNodeToPath(
        info.coordinate[1],
        info.coordinate[0]
      );
      setEndNode(node);

      const realEndNode = state.current.getNode(node.id);

      if (!realEndNode) {
        console.log("An error occurred. Please try again.");
        return;
      }
      state.current.endNode = realEndNode;

      setSelectionRadius([]);
    }

    // If click map with start and end node already present, reset nodes and place start node
    if (info.coordinate && startNode != null && endNode != null) {
      setEndNode(null);
      const node = await getNearestNodeToPath(
        info.coordinate[1],
        info.coordinate[0]
      );
      setStartNode(node);

      const circleBoundary = createBoudaryCirle(node);

      const boudaryBox = getBoxFromBoundary(circleBoundary);

      const graph = await getGraphDataFromMap(boudaryBox, node.id);

      state.current.graph = graph;
      clearPath();
      clearTimeout(loadingTime);
      setLoading(false);
    }
  };

  function createBoudaryCirle(node: Node): number[][] {
    const circleBoundary = createCircleBoundary(
      node.latitude,
      node.longitude,
      2
    );

    setSelectionRadius([{ contour: circleBoundary }]);

    return circleBoundary;
  }

  const animate = (time: DOMHighResTimeStamp) => {
    for (let i = 0; i < 5; i++) {
      animateStep(time);
    }

    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  const animateStep = (newTime: DOMHighResTimeStamp) => {
    const updateNodes = state.current.nextStep();
    for (const node of updateNodes) {
      updateWayPoint(node, node.referer);
    }

    // If endNode is found, show the route from start node to end node
    if (state.current.finished && !animationEnded) {
      if (!routeNode.current) {
        routeNode.current = state.current.endNode;
      }
      const parentRouteNode = routeNode.current.parent;
      if (parentRouteNode) {
        updateWayPoint(parentRouteNode, routeNode.current, "route", 5);
        routeNode.current = parentRouteNode ?? routeNode.current;
        setAnimationEnded(time >= timer.current && parentRouteNode == null);
      }
    }

    if (previousTimeRef.current != null) {
      const deltaTime = newTime - previousTimeRef.current;
      setTime((prevTime) => prevTime + deltaTime * playbackDirection);
    }
  };

  const updateWayPoint = (
    node: Node,
    refererNode: Node | null,
    color: keyof ColorsType = "path",
    timeMultiplier = 1
  ) => {
    if (refererNode === null) return;
    const distance = Math.hypot(
      node.latitude - refererNode.latitude,
      node.longitude - refererNode.longitude
    );

    const timeAdd = distance * 50000 * timeMultiplier;

    wayPoints.current = [
      ...wayPoints.current,
      {
        path: [
          [refererNode.longitude, refererNode.latitude],
          [node.longitude, node.latitude],
        ],
        timestamps: [timer.current, timer.current + timeAdd],
        color,
      },
    ];

    timer.current += timeAdd;
    setPathData(wayPoints.current);
  };

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

  const startPathFinding = async () => {
    setTimeout(() => {
      clearPath();
      state.current.start("dijkstra");
      setStarted(true);
    }, 400);
  };

  const clearPath = () => {
    setStarted(false);
    setPathData([]);
    setTime(0);
  };

  const resetAll = () => {
    clearPath();
    setStartNode(null);
    setEndNode(null);
  };

  const scatterPlotLayer = new ScatterplotLayer<PlotType>({
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
    getPosition: (d: PlotType) => d.coordinates,
    getFillColor: (d: PlotType) => {
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

  const pathFinderLayer = new TripsLayer<WayPointType>({
    id: "path-finder",
    data: pathData,
    getPath: (d) => d.path.map((p) => p),
    getTimestamps: (d) => d.timestamps.map((p) => p),
    opacity: 1,
    widthMinPixels: 3,
    widthMaxPixels: 5,
    fadeTrail: false,
    currentTime: time,
    getColor: (d: WayPointType) => colors[d.color] as Color,
  });

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      style={{ height: "100vh", width: "100vw" }}
    >
      <DeckGL
        initialViewState={viewState}
        controller={{ doubleClickZoom: false, keyboard: false }}
        layers={[pathFinderLayer, polygonLayer, scatterPlotLayer]}
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
      <button
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          zIndex: 1000,
          padding: 10,
          backgroundColor: "white",
          border: "1px solid black",
        }}
        onClick={started ? resetAll : startPathFinding}
      >
        {started ? "Reset" : "Start Path Finding"}
      </button>
    </div>
  );
};

export default Map;
