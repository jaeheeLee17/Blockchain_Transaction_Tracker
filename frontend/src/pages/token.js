import Router from 'next/router';
import { Graph } from "react-d3-graph";
import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  useTheme,
} from "@mui/material";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import axios from "axios";
import { DashboardLayout } from "../components/dashboard-layout";


export const Token = (props) => {
  axios
      .get("http://localhost:3000/eth/db/TxFrom", {
        params: {
          source: "0x5599b4EAdDd319e2F462b27fC8378B0BFaD309CA",
        },
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((error) => {
        console.dir(error);
      });

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
      // {
      //   source: 1,
      //   target: 5,
      // },
      // {
      //   source: 1,
      //   target: 6,
      // },
      {
        source: 1,
        target: 7,
      },
      {
        source: 1,
        target: 8,
      },
      {
        source: 1,
        target: 9,
      },
      {
        source: 1,
        target: 10,
      },
      // {
      //   source: 1,
      //   target: 4,
      // },
      {
        source: 10,
        target: 11,
      },
      {
        source: 9,
        target: 12,
      },
      {
        source: 8,
        target: 13,
      },
    ],
    nodes: [
      {
        id: 1,
        name: "Node 1",
        blockNumber: 11973523,
        transactionHash:
            "0x66b230bb3710e4dda5d9e2355ecc8863ab9dd3f519809ee72110603714609eee",
        transactionIndex: 20,
        from: "0xA363c3Cb4f8d30741477bEA1f32A52e9Ed3D2075",
        to: "0xE5049e3c04Ec45Cc97ECC53645840379b18FC8A1",
        value: 0,
      },
      {
        id: 2,
        name: "Node 2",
        blockNumber: 11973522,
        transactionHash:
            "0x49cc6e528c3645aad6fd8dfd80b5d1d6aa1b575bb55b103ffabef45a08741b18",
        transactionIndex: 34,
        from: "0x52aEB6CD5Bf7AA587Ab4739C3aA7a08E7c754da4",
        to: "0x9C3F0FC85EF9144412388e7E952eb505e2c4a10F",
        value: 0,
      },
      {
        id: 3,
        name: "Node 3",
        blockNumber: 11973521,
        transactionHash:
            "0x4737b10a70eb05eab90753e102a3b95262abcfec0735cdf4ea55f2294f6e5f8a",
        transactionIndex: 40,
        from: "0x81b7E08F65Bdf5648606c89998A9CC8164397647",
        to: "0xc6A54d9142C8625F1d715d3774E0b2914b0a78b1",
        value: 1,
      },
      // {
      //   id: 4,
      //   name: "Node 4",
      //   blockNumber: 11973520,
      //   transactionHash:
      //     "0xe94682fc7aed685f7aceb478f2a8336dacc348b696570a95184dfbcfb2130f36",
      //   transactionIndex: 5,
      //   from: "0x194C14f3af454a34b4102BB2Eb452C293f3295EC",
      //   to: "0x26FC224B37952Bd12C792425F242E0B0a55453a6",
      //   value: 0,
      // },
      // {
      //   id: 5,
      //   name: "Node 5",
      //   blockNumber: 11973519,
      //   transactionHash:
      //     "0x3810bbf5b866944ea9ea5a257b7d5147fb80f8ac50765542d7be1aeed6251c02 ",
      //   transactionIndex: 9,
      //   from: "0xD237c76e6902F71DA0A66a8f5583D25cc64ADd6F",
      //   to: "0x7406a59e123a12830A2AFC7d7e8491C66766d8D3",
      //   value: 0,
      // },
      // {
      //   id: 6,
      //   name: "Node 6",
      //   blockNumber: 11973518,
      //   transactionHash:
      //     "0xc18bd4199a13eb7868c61b9a975b16f10177705b4578c0dfddc8dd1f64abcb11",
      //   transactionIndex: 0,
      //   from: "0x81b7E08F65Bdf5648606c89998A9CC8164397647",
      //   to: "0x63cE6776D31ed09713e2BD114D74c286E709EA93",
      //   value: 1,
      // },
      {
        id: 7,
        name: "Node 7",
        blockNumber: 11973517,
        transactionHash:
            "0x59c45d535f37b68b06726673bfbace47efc88594304472b679b29d81347aed3c",
        transactionIndex: 6,
        from: "0x81b7E08F65Bdf5648606c89998A9CC8164397647",
        to: "0xc359459C942b70762BdDBcF32F075CF8087E6617",
        value: 1,
      },
      {
        id: 8,
        name: "Node 8",
        blockNumber: 11973516,
        transactionHash:
            "0x6161ff8c9f7c80463dc06ef6a1b2f739865f4132d2e1b28e84ce127763bd4d64",
        transactionIndex: 0,
        from: "0xfcd35eF32fe865EE96e36e71eC5F65EfD358038e",
        to: "0x07865c6E87B9F70255377e024ace6630C1Eaa37F",
        value: 0,
      },
      {
        id: 9,
        name: "Node 9",
        blockNumber: 11973515,
        transactionHash:
            "0xed9449edf3b5b6d0532a636aa0efb4f6f6905d2e01b3fdfba41d4478052c3c68",
        transactionIndex: 5,
        from: "0xfbe91292a7aa3a0bE78A1c530d2F7f3946aFfeF3",
        to: "0xF90dc0f9115a9E3031bBF0812E5Fd34f6a276a1d",
        value: 0,
      },
      {
        id: 10,
        name: "Node 10",
        blockNumber: 11973514,
        transactionHash:
            "0x15d3a2e1f0d055fe0f058a19fcb1b13e0b1623430d58c8778339cfb792177c90",
        transactionIndex: 29,
        from: "0x52aEB6CD5Bf7AA587Ab4739C3aA7a08E7c754da4",
        to: "0x70014768996439F71C041179Ffddce973a83EEf2",
        value: 0,
      },
      {
        id: 11,
        name: "Node 10",
        blockNumber: 11973514,
      },
      {
        id: 12,
        name: "Node 10",
        blockNumber: 11973514,
      },
      {
        id: 13,
        name: "Node 10",
        blockNumber: 11973514,
      },
    ],
  };

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
    nodeHighlightBehavior: true,
    panAndZoom: false,
    staticGraph: false,
    staticGraphWithDragAndDrop: false,
    width: 1800,
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
      labelProperty: "blockNumber",
      mouseCursor: "pointer",
      opacity: 1,
      renderLabel: true,
      size: 700,
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

  const onClickLink = function (source, target) {
    window.alert(`Clicked link between ${source} and ${target}`);
  };

  const onChangePage = (e) => {
    window.location.href = "/transactiondetail";
  };

  const onClickNode = function (e) {
      Router.push({
          pathname: '/transactiondetail',
          query: { },
      });
  };

  return (
      <Card {...props}>
        <CardHeader title="Node connection graph" />
        {/* 거래량에 따른 그래프 형태 변화 선택 기능 */}
        <Divider />
        <Graph
            id="graph-id" // id is mandatory
            data={data}
            config={myConfig}
            onClickLink={onClickLink}
            onClickNode={onClickNode}
        />
        {/* <node_graph /> */}
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
              onClick={onChangePage}
          >
            More Details
          </Button>
        </Box>
      </Card>
  );
};

Token.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Token;