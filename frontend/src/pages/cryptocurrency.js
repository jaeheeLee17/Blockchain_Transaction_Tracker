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
    Container, FormControl, InputLabel, Select, MenuItem, Modal
} from "@mui/material";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import axios from "axios";
import {DashboardLayout} from "../components/dashboard-layout";
import {Search as SearchIcon} from "../icons/search";
import ReactTooltip from "react-tooltip";
import Web3 from "web3";
import Router from "next/router";



const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};


export const Cryptocurrency = (props) => {

    const apiUrl = process.env.NEXT_PUBLIC_API_ROOT;
    const [walletAddress, setWalletAddress] = useState("");
    const [network, setNetwork] = React.useState('mainnet');
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const onChangePage = (e) => {
        window.location.href = "/transactionNodeDetail";
    };

    const onChangeAddress = (e) => setWalletAddress(e.target.value);
    const data = {
        links: [],
        nodes: [{id: walletAddress.toLowerCase()}],
        focusedNodeId: "nodeIdToTriggerZoomAnimation",
    };

    const [datas, setDatas] = useState({links: [], nodes: [], status: false});
    const [third, setThird] = useState({links: [], nodes: []});
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
    const Link = [];
    const Node = [];
    const onKeyPress = (e) => {
        if (e.key === "Enter") {
            if (web3.utils.isAddress(walletAddress)) {
                setDatas({links: [], nodes: [], status: false});
                handleOpen();
                checkData();
            } else {
                alert("invalid address");
                setWalletAddress("");
                return;
            }
        }
    };

    const web3 = new Web3(Web3.givenProvider || "ws://localhost:8546");
    const onClickButton = () => {
        if (web3.utils.isAddress(walletAddress)) {
            setDatas({links: [], nodes: [], status: false});
            handleOpen();
            checkData();
        } else {
            alert("invalid address");
            setWalletAddress("");
            return;
        }

    };

    //data db에 있나 확인
    const checkData = () => {
        console.log(network)
        axios
            .get(apiUrl + "/eth/db/ethAccountTrace", {
                params: {
                    walletAddress: walletAddress
                },
            })
            .then((res) => {
                console.log("checkData")
                const resNode = res.data.data;
                if (resNode) getTxChainFrom(walletAddress); //있으면 db에서 데이터 가져옴
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
            .get(apiUrl + "/eth/db/TxChainFrom", {
                params: {
                    source: address
                },
            })
            .then((res) => {
                console.log("getTxChainFrom")
                const txChains = res.data.data;
                if (!txChains || txChains.first_depth.length === 0) {
                    alert("no data");
                    handleClose();
                    return;
                }
                const net = txChains.network;
                if (net.length !== 0) setNetwork(net);
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
            .post(apiUrl + "/eth/network/txlistchain", {
                endpoint: network,
                walletAddress: address,
                startBlockNum: "1",
                endBlockNum: "latest",
                page: "1",
                offset: "100",
                sort: "asc",
            })
            .then((res) => {
                console.log("tx chain from 호출완료")
                if (res.status === 200) {
                    axios
                        .post(apiUrl + "/eth/network/ethAccountTrace", {
                            endpoint: network,
                            walletAddress: address,
                            startBlockNum: "1",
                            endBlockNum: "latest",
                        })
                        .then((res) => {
                            console.log("POSTtOdb")
                            setTimeout(function () {
                                getTxChainFrom(address);
                            }, 3000);
                        })
                        .catch((error) => {
                            console.dir(error);
                        });
                }
            })
            .catch((error) => {
                console.dir(error);
                setWalletAddress("");
                alert("no such data at " + network + " network");
                return;
            });
    };

    //노드 data 생성 부분
    const makeNodes = (txChains) => {
        console.log("make node")
        if (txChains) {
            const first = txChains.first_depth;
            let second;
            if (txChains.second_depth[0] == null) second = null;
            else second = txChains.second_depth;

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
                        if (second[i].length != 0 && first[j].data.to == second[i].from) {
                            const secondNode = {
                                id: nextNodes.length + 1,
                                name: "node" + (nextNodes.length + 1) + "_node" + (j + 2),
                                tx: second[i].tx,
                                from: second[i].from,
                                to: second[i].to,
                                value: second[i].value,
                                address: second[i].to,
                                dept: 2,
                                count: second[i].count,
                                open: false
                            };
                            if (second[i].count > 1) secondNode.address = secondNode.count;
                            const secondLink = {
                                source: j + 2,
                                target: nextNodes.length + 1,
                            };


                            nextNodes[j + 1].hasChild = true;
                            nextLinks.push(secondLink);
                            nextNodes.push(secondNode);
                        }
                    }

                }
            }

            //third dept
            for (let i = 0; i < nextNodes.length; i++) {
                if (nextNodes[i].count > 1) {
                    for (let k = 0; k < nextNodes[i].count; k++) {
                        const thirdNode = {
                            id: nextNodes.length + Node.length + 1,
                            name: "node" + (nextNodes.length + Node.length + 1) + "_node" + (nextNodes[i].id),
                            tx: nextNodes[i].tx[k],
                            from: nextNodes[i].from,
                            to: nextNodes[i].to,
                            value: nextNodes[i].value,
                            address: nextNodes[i].to,
                            dept: 3,
                            parent: nextNodes[i].id
                        };
                        const thirdLink = {
                            source: nextNodes[i].id,
                            target: nextNodes.length + Node.length + 1,
                        };

                        Link.push(thirdLink)
                        Node.push(thirdNode)
                    }
                }
            }


            for (let i = 0; i < nextNodes.length; i++) {
                let item = nextNodes[i];
                if (item.dept == 0) {
                    (item.color = "#001c06"), (item.x = 200), (item.y = 400);
                    item.size = 2000;
                } else if (item.dept == 1) {
                    item.color = "#075607";
                    (item.x = 1280), (item.y = 400);
                    item.size = 1500;
                } else if (item.dept == 2) {
                    if (item.count > 1) {
                        item.color = "#147914";
                        item.size = 1500;
                    } else {
                        item.color = "#62c462";
                    }
                }
            }
            handleClose();
            console.log(Node)
            setThird({links: Link, nodes: Node})
            setDatas({links: nextLinks, nodes: nextNodes, status: true});
        } else {
            handleClose();
            setDatas({
                nodes: [{id: 1, from: walletAddress, address: walletAddress}],
                links: [],
                status: true,
            });
            alert("no data");
            handleClose();
        }
        const g = document.getElementById("1");
        const c = g.childNodes[0];
        c.setAttribute("data-tip", "");
        c.setAttribute("data-for", "root");
    };


    const onClickNode = function (nodeId, node) {
        if (node.dept == 2 && node.count > 1) {
            if (node.open == false) {
                console.log("open")
                const n = third.nodes.filter(findChild);
                const l = third.links.filter(findLink);
                for (let i = 0; i < n.length; i++) {
                    datas.nodes.push(n[i])
                    datas.links.push(l[i]);
                }
                datas.nodes[node.index].open = true;
                console.log(datas)
                console.log(third)
                setDatas({links: datas.links, nodes: datas.nodes, status: true})
            } else {
                console.log("close")
                datas.nodes = datas.nodes.filter(nodes => nodes.parent != node.id);
                datas.links = datas.links.filter(links => links.source != node.id);
                datas.nodes[node.index].open = false;
                console.log(datas)
                setDatas({links: datas.links, nodes: datas.nodes, status: true})
            }
        } else {
            if (node.dept == 0) {
                return;
            } else {
                Router.push({
                    pathname: "/transactionNodeDetail",
                    query: {data: node.tx, net: network},
                });
            }
        }

        function findChild(element) {
            if (element.parent == node.id)
                return true;
        }

        function findLink(element) {
            if (element.source == node.id)
                return true;
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
        if (node.count > 1) {
            return;
        }
        const toolId = "toolId" + node.name;
        const element = [
            {
                toolId: toolId,
                toolNode: {
                    id: node.id,
                    name: node.name,
                    to: node.to,
                    from: node.from,
                    address: node.address,
                    tx: node.tx,
                    value: node.value,
                    dept: node.dept
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


    const handleChange = (event) => {
        setNetwork(event.target.value);
    };

    const closeModal = () => {
        setModalOpen(false);
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
            color: "#62c462",
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
                <Typography sx={{m: 0}} variant="h4">
                    ETH Dashboard
                </Typography>
                <Box sx={{mt: 1}}>
                    <Card>
                        <CardContent>
                            <Box sx={{
                                flexGrow: 1,
                                maxWidth: 1000,
                                display: "inline-flex",
                            }}>
                                <Box>
                                    <FormControl sx={{m: 1, minWidth: 120}}>
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
                                            <MenuItem value={"kovan"}>kovan</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                                <TextField
                                    sx={{
                                        width: "500px",
                                        marginTop: "8px"
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
                                                    style={{cursor: "pointer"}}
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
            <Box sx={{maxWidth: 1000, height: 1000}}>
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
                            <ReactTooltip id={tool.toolId} clickable={true} key={tool.toolId}>
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
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h4" component="h2" textAlign={"center"}>
                        loading...
                    </Typography>
                    <Typography id="modal-modal-description" sx={{mt: 2}} textAlign={"center"} variant="h6">
                        searching for your walletAddress
                    </Typography>
                </Box>
            </Modal>
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
