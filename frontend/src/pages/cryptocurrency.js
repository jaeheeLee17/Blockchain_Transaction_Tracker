import {Graph} from "react-d3-graph";
import React, {useEffect, useState} from "react";
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
} from "@mui/material";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import axios from "axios";
import {DashboardLayout} from "../components/dashboard-layout";
import {Search as SearchIcon} from "../icons/search";
import Router from "next/router";
import * as copyLinkRef from "immer";

export const Cryptocurrency = (props) => {

    const [walletAddress, setWalletAddress] = useState("");


    const onChangePage = (e) => {
        window.location.href = "/transactiondetail";
    };

    const onChangeAddress = (e) => setWalletAddress(e.target.value);
    const data = {links: [], nodes: [{id: walletAddress}],focusedNodeId: "nodeIdToTriggerZoomAnimation"}

    let [datas, setDatas] = useState({links: [], nodes: [], status: false});
    let nextNodes = [{id: 1, from: walletAddress, address: walletAddress,dept:0,x:100,y:200}];
    let nextLinks = [];

    const onKeyPress = (e) => {
        if (e.key === "Enter") {
            // axios
            //     .post("http://localhost:5000/eth/network/txlistchain", {
            //       params: {
            //         walletAddress: "0x90992dcb0fdaeb990C73Ca1682A7e2A30337d0c8",
            //         startBlockNum: "1",
            //         endBlockNum: "latest",
            //         page: "1",
            //         offset: "100",
            //         sort: "asc"
            //       },
            //     })
            //     .then((res) => {
            //       const list = res.data.data;
            //       console.log(res)
            //       console.log(res.data)
            //     })
            //     .catch((error) => {
            //       console.dir(error);
            //     });

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
                                dept:1
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
                                            dept : 2
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

                        nextNodes.forEach(item => {
                            if (item.dept == 0) item.color = "blue",item.x=1200,item.y=1000;
                            else if (item.dept==1) item.color="pink",item.x=500,item.y=500;
                            else item.color = "red",item.x=400,item.y=400;
                        });

                        setDatas({links: nextLinks, nodes: nextNodes, status: true})
                        console.log(nextNodes)
                        console.log(nextLinks)
                    } else {
                        setDatas({
                            nodes: [{id: 1, from: walletAddress, address: walletAddress}],
                            links: [],
                            status: true
                        })
                        alert("no data");

                    }
                })
                .catch((error) => {
                    console.dir(error);
                });
        }
    };

    const onClickNode = function (nodeId,node) {
        if(node.dept==0) window.open("https://ropsten.etherscan.io/address/"+node.address);
        window.open("https://ropsten.etherscan.io/tx/"+node.tx);
    };

    const onRightClickNode = function(event, nodeId, node) {
        navigator.clipboard.writeText(node.address).then(() => {
            alert("주소를 복사했습니다.");
        });
    }

    const myConfig = {
        automaticRearrangeAfterDropNode: false,
        collapsible: true,
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
        width: 1000,
        d3: {
            alphaTarget: 0.05,
            gravity: -200,
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
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8,
                }}
            ></Box>
            {/* 거래량에 따른 그래프 형태 변화 선택 기능 */}
            <Typography sx={{m: 1}} variant="h4">
                Cryptocurrency Dashboard
            </Typography>
            <Box sx={{mt: 3}}>
                <Card>
                    <CardContent>
                        <Box sx={{maxWidth: 500}}>
                            {/* 검색창 */}
                            <TextField
                                onChange={onChangeAddress}
                                onKeyPress={onKeyPress}
                                fullWidth
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SvgIcon color="action" fontSize="small">
                                                <SearchIcon/>
                                            </SvgIcon>
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
            {
                <Graph
                    id="graph-id" // id is mandatory
                    data={datas.status === true ? datas : data}
                    config={myConfig}
                    onClickNode={onClickNode}
                    onRightClickNode={onRightClickNode}
                />
            }
            <Divider/>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    p: 2,
                }}
            >
                <Button
                    color="primary"
                    endIcon={<ArrowRightIcon fontSize="small"/>}
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