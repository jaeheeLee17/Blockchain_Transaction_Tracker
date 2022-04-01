import Router from "next/router";
import { Graph } from "react-d3-graph";
import { useState } from "react";
import React from "react";
import {
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  Typography,
  Container,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
} from "@mui/material";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import axios from "axios";
import { DashboardLayout } from "../components/dashboard-layout";
import { Search as SearchIcon } from "../icons/search";
import { Search } from "@mui/icons-material";

export const Token = (props) => {
  // axios
  //   .get("http://localhost:3000/eth/db/TxFrom", {
  //     params: {
  //       source: "0x5599b4EAdDd319e2F462b27fC8378B0BFaD309CA",
  //     },
  //   })
  //   .then((res) => {
  //     console.log(res.data);
  //   })
  //   .catch((error) => {
  //     console.dir(error);
  //   });

  // const data = {
  //   links: [
  //     {
  //       source: 1,
  //       target: 2,
  //       label: "link 1 and 2",
  //     },
  //     {
  //       source: 1,
  //       target: 3,
  //     },
  //     // {
  //     //   source: 1,
  //     //   target: 5,
  //     // },
  //     // {
  //     //   source: 1,
  //     //   target: 6,
  //     // },
  //     {
  //       source: 1,
  //       target: 7,
  //     },
  //     {
  //       source: 1,
  //       target: 8,
  //     },
  //     {
  //       source: 1,
  //       target: 9,
  //     },
  //     {
  //       source: 1,
  //       target: 10,
  //     },
  //     // {
  //     //   source: 1,
  //     //   target: 4,
  //     // },
  //     {
  //       source: 10,
  //       target: 11,
  //     },
  //     {
  //       source: 9,
  //       target: 12,
  //     },
  //     {
  //       source: 8,
  //       target: 13,
  //     },
  //   ],
  //   nodes: [
  //     {
  //       id: 1,
  //       name: "Node 1",
  //       blockNumber: 11973523,
  //       transactionHash:
  //         "0x66b230bb3710e4dda5d9e2355ecc8863ab9dd3f519809ee72110603714609eee",
  //       transactionIndex: 20,
  //       from: "0xA363c3Cb4f8d30741477bEA1f32A52e9Ed3D2075",
  //       to: "0xE5049e3c04Ec45Cc97ECC53645840379b18FC8A1",
  //       value: 0,
  //     },
  //     {
  //       id: 2,
  //       name: "Node 2",
  //       blockNumber: 11973522,
  //       transactionHash:
  //         "0x49cc6e528c3645aad6fd8dfd80b5d1d6aa1b575bb55b103ffabef45a08741b18",
  //       transactionIndex: 34,
  //       from: "0x52aEB6CD5Bf7AA587Ab4739C3aA7a08E7c754da4",
  //       to: "0x9C3F0FC85EF9144412388e7E952eb505e2c4a10F",
  //       value: 0,
  //     },
  //     {
  //       id: 3,
  //       name: "Node 3",
  //       blockNumber: 11973521,
  //       transactionHash:
  //         "0x4737b10a70eb05eab90753e102a3b95262abcfec0735cdf4ea55f2294f6e5f8a",
  //       transactionIndex: 40,
  //       from: "0x81b7E08F65Bdf5648606c89998A9CC8164397647",
  //       to: "0xc6A54d9142C8625F1d715d3774E0b2914b0a78b1",
  //       value: 1,
  //     },
  //     {
  //       id: 7,
  //       name: "Node 7",
  //       blockNumber: 11973517,
  //       transactionHash:
  //         "0x59c45d535f37b68b06726673bfbace47efc88594304472b679b29d81347aed3c",
  //       transactionIndex: 6,
  //       from: "0x81b7E08F65Bdf5648606c89998A9CC8164397647",
  //       to: "0xc359459C942b70762BdDBcF32F075CF8087E6617",
  //       value: 1,
  //     },
  //     {
  //       id: 8,
  //       name: "Node 8",
  //       blockNumber: 11973516,
  //       transactionHash:
  //         "0x6161ff8c9f7c80463dc06ef6a1b2f739865f4132d2e1b28e84ce127763bd4d64",
  //       transactionIndex: 0,
  //       from: "0xfcd35eF32fe865EE96e36e71eC5F65EfD358038e",
  //       to: "0x07865c6E87B9F70255377e024ace6630C1Eaa37F",
  //       value: 0,
  //     },
  //     {
  //       id: 9,
  //       name: "Node 9",
  //       blockNumber: 11973515,
  //       transactionHash:
  //         "0xed9449edf3b5b6d0532a636aa0efb4f6f6905d2e01b3fdfba41d4478052c3c68",
  //       transactionIndex: 5,
  //       from: "0xfbe91292a7aa3a0bE78A1c530d2F7f3946aFfeF3",
  //       to: "0xF90dc0f9115a9E3031bBF0812E5Fd34f6a276a1d",
  //       value: 0,
  //     },
  //     {
  //       id: 10,
  //       name: "Node 10",
  //       blockNumber: 11973514,
  //       transactionHash:
  //         "0x15d3a2e1f0d055fe0f058a19fcb1b13e0b1623430d58c8778339cfb792177c90",
  //       transactionIndex: 29,
  //       from: "0x52aEB6CD5Bf7AA587Ab4739C3aA7a08E7c754da4",
  //       to: "0x70014768996439F71C041179Ffddce973a83EEf2",
  //       value: 0,
  //     },
  //     {
  //       id: 11,
  //       name: "Node 10",
  //       blockNumber: 11973514,
  //     },
  //     {
  //       id: 12,
  //       name: "Node 10",
  //       blockNumber: 11973514,
  //     },
  //     {
  //       id: 13,
  //       name: "Node 10",
  //       blockNumber: 11973514,
  //     },
  //   ],
  // };
  const [walletAddress, setWalletAddress] = useState("");

  const onClickLink = function (source, target) {
    window.alert(`Clicked link between ${source} and ${target}`);
  };

  const onChangePage = (e) => {
    window.location.href = "/transactiondetail";
  };

  const onClickNode = function (nodeId, node) {
    Router.push({
      pathname: "/transactiondetail",
      query: {
        to: node.to,
        from: node.from,
        value: node.value,
        tx: node.tx,
        address: node.address,
      },
    });
  };

  const onChangeAddress = (e) => setWalletAddress(e.target.value);
  const data = { links: [], nodes: [{ id: walletAddress }] };

  const [datas, setDatas] = useState({ links: [], nodes: [], status: false });
  const nextNodes = [{ id: 1, from: walletAddress, address: walletAddress }];
  const nextLinks = [];

  const makeNodes = () => {
    axios
        .get("http://localhost:5000/eth/db/TxChainFrom", {
          params: {
            source: walletAddress,
          },
        })
        .then((res) => {
          if (res.data.data.length > 0) {
            const first = res.data.data[0].first_depth;
            const second = res.data.data[0].second_depth;
            for (let i = 0; i < first.length; i++) {
              const n = {
                id: i + 2,
                name: "node" + (i + 2),
                tx: first[i].tx,
                from: first[i].data.from,
                to: first[i].data.to,
                value: first[i].data.value,
                address: first[i].data.to,
              };

              const s = {
                source: 1,
                target: i + 2,
              };

              nextLinks.push(s);
              nextNodes.push(n);
            }

            //second_dept
            for (let i = 0; i < second.length; i++) {
              for (let j = 0; j < first.length; j++) {
                if (first[j].data.to == second[i][0].data.from) {
                  for (let k = 0; k < second[i].length; k++) {
                    const secondNode = {
                      id: nextNodes.length + 1,
                      name: "node" + (nextNodes.length + 1) + "_node" + (j + 2),
                      tx: second[i][k].tx,
                      from: second[i][k].data.from,
                      to: second[i][k].data.to,
                      value: second[i][k].data.value,
                      address: second[i][k].data.to,
                    };
                    const secondLink = {
                      source: j + 2,
                      target: nextNodes.length + 1,
                    };

                    nextLinks.push(secondLink);
                    nextNodes.push(secondNode);
                  }
                  break;
                }
              }
            }

            setDatas({ links: nextLinks, nodes: nextNodes, status: true });
            console.log(nextNodes);
            console.log(nextLinks);
          } else {
            setDatas({
              nodes: [{ id: 1, from: walletAddress, address: walletAddress }],
              links: [],
              status: true,
            });
            alert("no data");
          }
        })
        .catch((error) => {
          console.dir(error);
        });
  };


  const onKeyPress = (e) => {
    if (e.key === "Enter") {
      makeNodes();
    }
  };

  const onClickButton = (e) => {
    makeNodes();
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
      size: 1000,
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



  return (
    <Card {...props}>
      <Container maxWidth={false}>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: 8,
            m: -4,
          }}
        ></Box>
        <Typography sx={{ m: 1 }} variant="h4">
          Token Dashboard
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ maxWidth: 500 }}>
                {/* 검색창 */}
                <TextField
                  onChange={onChangeAddress}
                  onKeyPress={onKeyPress}
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                          <SearchIcon
                              onClick={onClickButton}
                              onChange={onChangeAddress}
                              style={{cursor:"pointer"}}
                          />
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Search by Address / Txn Hash / Block / Token / Ens"
                  variant="outlined"
                />
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>
      <Divider />
      <Box sx={{ maxWidth: 500, height: 800 }}>
        <Graph
          id="graph-id" // id is mandatory
          data={data}
          config={myConfig}
          onClickLink={onClickLink}
          onClickNode={onClickNode}
        />
      </Box>
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
