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

export const Cryptocurrency = (props) => {

    const [walletAddress, setWalletAddress] = useState("");

    const onClickLink = function (source, target) {
        window.alert(`Clicked link between ${source} and ${target}`);
    };

    const onChangePage = (e) => {
        window.location.href = "/transactiondetail";
    };

    const onClickNode = function (e) {
        window.location.href = "/transactiondetail";
    };
    const onChangeAddress = (e) => setWalletAddress(e.target.value);
    const data = {links: [], nodes: [{id: walletAddress}]}

    const [datas, setDatas] = useState({links: [], nodes: [], status: false});
    const nextNodes = [{id: 1, from: walletAddress}];
    const nextLinks = [];

    const onKeyPress = (e) => {
        if (e.key === "Enter") {
            axios.post("http://localhost:5000/eth/network/txlist", {
                walletAddress: walletAddress,
                startBlockNum: "1",
                endBlockNum: "latest",
                page: "10",
                offset: "100",
                sort: "asc"
                }).then(function (res) {
                    console.log(res.data)

                //get
                axios
                    .get("http://localhost:5000/eth/db/TxTo", {
                        params: {
                            destination: walletAddress,
                        },
                    })
                    .then((res) => {
                        const list = res.data.data;
                        for (let i = 0; i < list.length; i++) {
                            const n = {
                                id: i + 2,
                                name: "node" + (i + 1),
                                blockNumber: list[i].blockNumber,
                                transactionHash: list[i].transactionHash,
                                transactionIndex: list[i].transactionIndex,
                                from: list[i].from,
                                to: list[i].to,
                                value: list[i].value,
                            };

                            const s = {
                                source: 1,
                                target: i + 2,
                            };

                            nextLinks.push(s);
                            nextNodes.push(n);
                        }
                        setDatas({links: nextLinks, nodes: nextNodes, status: true})
                    })
                    .catch((error) => {
                        console.dir(error);
                    });
                    //get
                }).catch(function (error) {
                    console.log(error)
                })


        }
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
        width: 1000,
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
            labelProperty: "from",
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
                    onClickLink={onClickLink}
                    onClickNode={onClickNode}
                />
            }
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