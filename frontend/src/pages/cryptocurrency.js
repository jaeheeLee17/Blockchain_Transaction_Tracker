import { Graph } from "react-d3-graph";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  useTheme,
  TextField,
  InputAdornment,
  SvgIcon,
  Typography,
  Container, FormControl, InputLabel, Select, MenuItem,
} from "@mui/material";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import axios from "axios";
import { DashboardLayout } from "../components/dashboard-layout";
import { Search as SearchIcon } from "../icons/search";
import ReactTooltip from "react-tooltip";
import Web3 from "web3";
import Link from "next/link"
import Router from "next/router";


export const Cryptocurrency = (props) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_ROOT;
  const [walletAddress, setWalletAddress] = useState("");

  const onChangePage = (e) => {
    window.location.href = "/transactionNodeDetail";
  };

  const onChangeAddress = (e) => setWalletAddress(e.target.value);
  const data = {
    links: [],
    nodes: [{ id: walletAddress.toLowerCase() }],
    focusedNodeId: "nodeIdToTriggerZoomAnimation",
  };

  const [datas, setDatas] = useState({ links: [], nodes: [], status: false });
  const nextNodes = [
    {
      id: 1,
      from: walletAddress,
      address: walletAddress,
      dept: 0,
      x: 100,
      y: 200,
    },
  ];
  let nextLinks = [];

  const onKeyPress = (e) => {
    if (e.key === "Enter") {
      if(web3.utils.isAddress(walletAddress)){
        setDatas({ links: [], nodes: [], status: false });
        checkData();
      }else{
        alert("invaild address");
        setWalletAddress("");
        return;
      }
    }
  };

  const web3 = new Web3(Web3.givenProvider || "ws://localhost:8546");
  const onClickButton = () => {
    if(web3.utils.isAddress(walletAddress)){
      setDatas({ links: [], nodes: [], status: false });
      checkData();
    }else{
      alert("invaild address");
      setWalletAddress("");
      return;
    }

  };

  //data db에 있나 확인
  const checkData = () => {
    console.log(network)
    axios
      .get(apiUrl+"/eth/db/ethAccountTrace", {
        params: {
          walletAddress: walletAddress
        },
      })
      .then((res) => {
        console.log("checkData")
        const resNode = res.data.data;
        if (resNode.length == 1) getTxChainFrom(walletAddress); //있으면 db에서 데이터 가져옴
        else postToDB(walletAddress); //없으면 db에 data 저장
      })
      .catch((error) => {
        console.dir(error);
      });

  };

  //db에서 있는 데이터 가져옴
  const getTxChainFrom = (address) => {
    console.log(address)
    axios
      .get(apiUrl+"/eth/db/TxChainFrom", {
        params: {
          source: address
        },
      })
      .then((res) => {
        console.log("getTxChainFrom")
        const txChains = res.data.data;
        if(txChains.length===0 || txChains[0].first_depth.length===0){
          alert("no data");
          return;
        }
        console.log(txChains)
        makeNodes(txChains);
      })
      .catch((error) => {
        console.dir(error);
      });
  };

  //db에 data 쌓는 부분
  const postToDB = (address) => {
    //modal 창 하나 띄우면 더 좋을듯 ..
    //postEthAccountTraceRecord
    //postTxlistChainWithAddress
    axios
      .post(apiUrl+"/eth/network/ethAccountTrace", {
        endpoint: network,
        walletAddress: address,
        startBlockNum: "1",
        endBlockNum: "latest",
      })
      .then((res) => {
        console.log("POSTtOdb")
        axios
          .post(apiUrl+"/eth/network/txlistchain", {
            endpoint: network,
            walletAddress: address,
            startBlockNum: "1",
            endBlockNum: "latest",
            page: "1",
            offset: "100",
            sort: "asc",
          })
          .then((res) => {
            console.log("db 저장 성공 get tx chain from 호출")
            getTxChainFrom(address);
          })
          .catch((error) => {
            console.dir(error);
          });
      })
      .catch((error) => {
        console.dir(error);
      });
  };

  //노드 data 생성 부분
  const makeNodes = (txChains) => {
    console.log("make node")
    if (txChains.length > 0) {
      const first = txChains[0].first_depth;
      let second;
      if (txChains[0].second_depth[0] == null) second = null;
      else second = txChains[0].second_depth;

      for (let i = 0; i < first.length; i++) {
        const n = {
          id: i + 2,
          name: "node" + (i + 2),
          tx: first[i].tx,
          from: first[i].data.from,
          to: first[i].data.to,
          value: first[i].data.value,
          address: (first[i].data.to),
          dept: 1,
        };

        const s = {
          source: 1,
          target: i + 2,
        };
        nextLinks.push(s);
        nextNodes.push(n);
      }

      //second_dept
      console.log(second)
      if (second[0].length != 0) {
        for (let i = 0; i < second.length; i++) {
          for (let j = 0; j < first.length; j++) {
            if (second[i].length!=0 && first[j].data.to == second[i][0].data.from) {
              for (let k = 0; k < second[i].length; k++) {
                const secondNode = {
                  id: nextNodes.length + 1,
                  name: "node" + (nextNodes.length + 1) + "_node" + (j + 2),
                  tx: second[i][k].tx,
                  from: second[i][k].data.from,
                  to: second[i][k].data.to,
                  value: second[i][k].data.value,
                  address: second[i][k].data.to,
                  dept: 2,
                };
                const secondLink = {
                  source: j + 2,
                  target: nextNodes.length + 1,
                };

                nextNodes[j + 1].hasChild = true;
                nextLinks.push(secondLink);
                nextNodes.push(secondNode);
              }
              break;
            }
          }
        }
        console.log("3")
      }

      let d1 = 0,
        d2 = 0,
        d3 = 0;
      nextNodes.forEach((item) => {
        if (item.dept == 1) {
          if (item.hasChild != true) d1++;
          else d2++;
        } else if (item.dept == 2) d3++;
      });
      console.log(d1, d2, d3);

      let x1 = 0,
        y1 = 0,
        x2 = 0,
        y2 = 0,
        x3 = 0,
        y3 = 0,
        cnt1 = 0,
        cnt2 = 0,
        cnt3 = 0;

      for (let i = 0; i < nextNodes.length; i++) {
        let item = nextNodes[i];
        if (item.dept == 0) {
          //root지정
          (item.color = "#00460c"), (item.x = 200), (item.y = 400);
        } else if (item.dept == 1) {
          item.color = "#2a982a";
          (item.x = 1280), (item.y = 400);
          // if (item.hasChild == true) {//dept1에서 자식 있는 노드
          //     if (d2 / 2 == cnt2) x2 = 800, y2 = 520;
          //     if (d2 / 2 <= cnt2) {
          //         (item.color = "#388e3c"), (item.x = 800 - x2), (item.y = 520 - y2) , x2 += 40, y2 += 15;
          //     } else {
          //         (item.color = "#388e3c"), (item.x = 800 + x2), (item.y = 520 + y2) , x2 += 40, y2 += 15;
          //     }
          //     cnt2++;
          // } else {//dept1에서 자식 없는 노드
          //     (item.color = "#388e3c"), (item.x = 800 + x1), (item.y = 520 + y1), x1 += 40, y1 += 15;
          //     cnt1++;
          // }
        } else {
          //dept2
          item.color = "#62c462";
          // if (d3 / 2 == cnt3) x3 = 1000, y3 = 520;
          // if (d3 / 2 <= cnt3) {
          //     (item.color = "#6abf69"), (item.x = 1200 - x3), (item.y = 1000 - y3), x3 += 40, y3 += 15;
          // } else {
          //     (item.color = "#6abf69"), (item.x = 1200 + x3), (item.y = 1000 - +y3), x3 += 40, y3 += 15;
          // }
          // cnt3++;
        }
      }
  console.log("!")
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
  };

    const onClickNode = function (nodeId, node) {
        if (node.dept == 0) {
            return;
        } else {
            Router.push({
                pathname: "/transactionNodeDetail",
                query: {data: node.tx, net: network},
            });
        }
    };

  const onRightClickNode = function (event, nodeId, node) {
    console.log(event);
    navigator.clipboard.writeText(node.address).then(() => {
      alert("주소를 복사했습니다.");
    });
  };

  const [toolContent, setToolContent] = useState([]);
  const onMouseOverNode = function (nodeId, node) {
    const toolId = "toolId" + nodeId;
    const element = [
      {
        toolId: toolId,
        toolNode: {
          id: node.id,
          to: node.to,
          from: node.from,
          address: node.address,
          tx: node.tx,
          value: node.value,
          dept:node.dept
        },
      },
    ];

    const tool = toolContent.filter((tool) => tool.toolId == toolId);
    if (datas.status == false) return;
    if (tool.length == 1) return;
    setToolContent([...toolContent, ...element]);

    let g = document.getElementById(nodeId);
    let c = g.childNodes[0];
    c.setAttribute("data-tip", "");
    c.setAttribute("data-for", toolId);
  };

  const [network, setNetwork] = React.useState('mainnet');
  const handleChange = (event) => {
    setNetwork(event.target.value);
  };
  const myConfig = {
    automaticRearrangeAfterDropNode: false,
    collapsible: true,
    directed: false,
    focusAnimationDuration: 0.75,
    focusZoom: 1,
    freezeAllDragEvents: false,
    height: 1000,
    maxHeight: 1000,
    highlightDegree: 1,
    highlightOpacity: 1,
    linkHighlightBehavior: false,
    maxZoom: 8,
    minZoom: 0.1,
    nodeHighlightBehavior: true,
    panAndZoom: false,
    staticGraph: false,
    staticGraphWithDragAndDrop: false,
    width: 2500,
    maxWidth: 2500,
    d3: {
      alphaTarget: 0.05,
      gravity: -300,
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
      highlightStrokeColor: "blue",
      highlightStrokeWidth: "SAME",
      labelProperty: "address",
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
      highlightColor: "blue",
      highlightFontSize: 8,
      highlightFontWeight: "normal",
      labelProperty: "label",
      mouseCursor: "pointer",
      opacity: 1,
      renderLabel: false,
      semanticStrokeWidth: false,
      strokeWidth: 2,
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
        />
        <Typography sx={{ m: 0 }} variant="h4">
          Address Dashboard
        </Typography>
        <Box sx={{ mt: 1 }}>
          <Card>
            <CardContent>
              <Box sx={{
                flexGrow: 1,
                maxWidth: 1000,
                display:"inline-flex",
              }}>
                <Box>
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                  <InputLabel id="demo-simple-select-label">Network</InputLabel>
                  <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={network}
                      label="Network"
                      onChange={handleChange}
                  >
                    <MenuItem value={"mainnet"}>mainnet</MenuItem>
                    <MenuItem value={"ropsten"}>ropsten</MenuItem>
                    <MenuItem value={"rinkeby"}>rinkeby</MenuItem>
                    <MenuItem value={"goerli"}>goerli</MenuItem>
                    <MenuItem value={"kovan"}>kovan</MenuItem>
                  </Select>
                </FormControl>
                </Box>
                <TextField
                    sx={{
                      width:"500px",
                      marginTop:"8px"
                    }}
                    value={walletAddress}
                  onChange={onChangeAddress}
                  onKeyPress={onKeyPress}
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <SearchIcon
                          onClick={onClickButton}
                          onChange={onChangeAddress}
                          style={{ cursor: "pointer" }}
                        />
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Search by Address"
                  variant="outlined"
                />
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>
      <Box sx={{ maxWidth: 1000, height: 1000 }}>
        {
          <Graph
            id="graph-id" // id is mandatory
            data={datas.status === true ? datas : data}
            config={myConfig}
            onClickNode={onClickNode}
            onRightClickNode={onRightClickNode}
            onMouseOverNode={onMouseOverNode}
          />
        }
        {
          <ReactTooltip id={"root"} clickable={true}>
            <h3>transaction Info</h3>
            <br/>
            <p>source : {walletAddress}</p>
          </ReactTooltip>
        }
        {
          toolContent.map((tool) =>
              (
                  <ReactTooltip id={tool.toolId} clickable={true} key ={tool.toolId}>
                    <h3>transaction Info</h3>
                    <br/>
                    <p>to : {tool.toolNode.to}</p>
                    <p>from : {tool.toolNode.from}</p>
                    <p>tx : {tool.toolNode.tx}</p>
                    <p>value : {tool.toolNode.value}</p>
                  </ReactTooltip>
              )
          )
        }
      </Box>
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

Cryptocurrency.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Cryptocurrency;
