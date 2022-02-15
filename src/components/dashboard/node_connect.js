import { Graph } from "react-d3-graph";
import React from "react";
// import node_graph from "./node_graph";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  useTheme,
} from "@mui/material";
// import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

export const Sales = (props) => {
  const data = {
    links: [
      {
        source: 1,
        target: 2,
        label: "link 1 and 2",
      },
      {
        source: 1,
        target: 3,
      },
      {
        source: 1,
        target: 4,
      },
      {
        source: 3,
        target: 4,
        breakPoints: [
          { x: 100, y: 20 },
          { x: 20, y: 100 },
        ],
      },
      {
        source: 4,
        target: 4,
      },
    ],
    nodes: [
      {
        id: 1,
        name: "Node 1",
      },
      {
        id: 2,
        name: "Node 2",
      },
      {
        id: 3,
        name: "Node 3",
      },
      {
        id: 4,
        name: "Node 4",
      },
    ],
  };

  // the graph configuration, just override the ones you need
  // const myConfig = {
  //   automaticRearrangeAfterDropNode: false,
  //   collapsible: false,
  //   height: 400,
  //   highlightDegree: 1,
  //   highlightOpacity: 0.2,
  //   linkHighlightBehavior: true,
  //   maxZoom: 8,
  //   minZoom: 0.1,
  //   nodeHighlightBehavior: true,
  //   panAndZoom: false,
  //   staticGraph: false,
  //   width: 800,
  //   node: {
  //     color: "#4caf50",
  //     fontColor: "black",
  //     fontSize: 12,
  //     fontWeight: "normal",
  //     highlightColor: "red",
  //     highlightFontSize: 12,
  //     highlightFontWeight: "bold",
  //     highlightStrokeColor: "SAME",
  //     highlightStrokeWidth: 1.5,
  //     labelProperty: "name",
  //     mouseCursor: "pointer",
  //     opacity: 1,
  //     renderLabel: true,
  //     size: 450,
  //     strokeColor: "none",
  //     strokeWidth: 1.5,
  //     svg: "",
  //     symbolType: "circle",
  //   },
  //   link: {
  //     color: "#4caf50",
  //     fontColor: "red",
  //     fontSize: 10,
  //     highlightColor: "blue",
  //     highlightFontWeight: "bold",
  //     labelProperty: (link) => `from ${link.source} to ${link.target}`,
  //     opacity: 1,
  //     renderLabel: false,
  //     semanticStrokeWidth: false,
  //     strokeWidth: 4,
  //   },
  //   d3: {
  //     gravity: -400,
  //     linkLength: 300,
  //   },
  // };
  const myConfig = {
    automaticRearrangeAfterDropNode: false,
    collapsible: false,
    directed: false,
    focusAnimationDuration: 0.75,
    focusZoom: 1,
    freezeAllDragEvents: false,
    height: 400,
    highlightDegree: 1,
    highlightOpacity: 1,
    linkHighlightBehavior: false,
    maxZoom: 8,
    minZoom: 0.1,
    nodeHighlightBehavior: false,
    panAndZoom: false,
    staticGraph: false,
    staticGraphWithDragAndDrop: false,
    width: 800,
    d3: {
      alphaTarget: 0.05,
      gravity: -100,
      linkLength: 100,
      linkStrength: 1,
      disableLinkForce: false,
    },
    node: {
      color: "#4caf50",
      fontColor: "black",
      fontSize: 8,
      fontWeight: "normal",
      highlightColor: "SAME",
      highlightFontSize: 8,
      highlightFontWeight: "normal",
      highlightStrokeColor: "SAME",
      highlightStrokeWidth: "SAME",
      labelProperty: "id",
      mouseCursor: "pointer",
      opacity: 1,
      renderLabel: true,
      size: 200,
      strokeColor: "none",
      strokeWidth: 1.5,
      svg: "",
      symbolType: "circle",
    },
    link: {
      color: "#d3d3d3",
      fontColor: "black",
      fontSize: 8,
      fontWeight: "normal",
      highlightColor: "SAME",
      highlightFontSize: 8,
      highlightFontWeight: "normal",
      labelProperty: "label",
      mouseCursor: "pointer",
      opacity: 1,
      renderLabel: false,
      semanticStrokeWidth: false,
      strokeWidth: 1.5,
      markerHeight: 6,
      markerWidth: 6,
      strokeDasharray: 0,
      strokeDashoffset: 0,
      strokeLinecap: "butt",
    },
  };
  const onClickNode = function (nodeId) {
    window.alert(`Clicked node ${nodeId}`);
  };

  const onClickLink = function (source, target) {
    window.alert(`Clicked link between ${source} and ${target}`);
  };

  return (
      <Card {...props}>
        <CardHeader title="Node connection graph" />
        {/* 거래량에 따른 그래프 형태 변화 선택 기능 */}

        <Divider />
        {/*
      <img
        style={{
          alignItems: "center",
          width: "600px",
          height: "500px",
          margin: "20px",
        }}
        src="/static/images/node.png"
      /> */}
        <Graph
            id="graph-id" // id is mandatory
            data={data}
            config={myConfig}
            onClickNode={onClickNode}
            onClickLink={onClickLink}
        />
        <node_graph />
        {/* <CardContent>
        <Box
          sx={{
            height: 400,
            position: "relative",
          }}
        >
          <Bar data={data} options={options} />
        </Box>
      </CardContent> */}
        <Divider />
        <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              p: 2,
            }}
        >
          <Button
              color="primary"
              endIcon={<ArrowRightIcon fontSize="small" />}
              size="small"
          >
            More Details
          </Button>
        </Box>
      </Card>
  );
};