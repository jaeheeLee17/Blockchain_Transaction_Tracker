import Head from "next/head";
import Router, {useRouter} from "next/router";
import {DashboardLayout} from "../components/dashboard-layout";
import {
    Box,
    Container,
    Typography,
    Card,
    Divider,
    CardContent,
    Grid, Button, FormControl, InputLabel, Select, MenuItem, TextField, InputAdornment, TableRow, TableCell,
} from "@mui/material";

import React, {useEffect, useState} from "react";
import axios from "axios";

import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import {Search as SearchIcon} from "../icons/search";
import {Graph} from "react-d3-graph";
import ReactTooltip from "react-tooltip";
import Web3 from "web3";
import {NavItem} from "../components/nav-item";

const TransactionNodeDetail = (props) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_ROOT;
    const [txhash, setTxHash] = useState("");
    const [network, setNetwork] = React.useState('mainnet');
    const [data,setData]=useState([]);
    const onChangeAddress = (e) => setTxHash(e.target.value);
    const regHash = /^0x([A-Fa-f0-9]{64})$/;
    const onKeyPress = (e) => {
        if (e.key === "Enter") {
            if (regHash.test(txhash)) {
                findTx();
            } else {
                alert("invaild tx");
                setTxHash("");
                return;
            }
        }
    };

    const onClickButton = () => {
        if (regHash.test(txhash)) {
            findTx();
        } else {
            alert("invaild tx");
            setTxHash("");
            return;
        }

    };

    function findTx() {
        axios
            .get(apiUrl+"/eth/network/getTransactionInfo", {
                params: {
                    addr: txhash,
                    endpoint: network
                },
            })
            .then((res) => {
                const transactionInfo = res.data.data;
                transactionInfo.hash = txhash;
                setData([transactionInfo]);

            })
            .catch((error) => {
                console.dir(error);
                alert("no such data at "+network);
                setNetwork("")
                setTxHash("")
                return;
            });
    }


    const handleChange = (event) => {
        setNetwork(event.target.value);
    };

    function onChangePage() {
        if (network === 'mainnet') {
            window.open(`https://etherscan.io/tx/` + txhash);
        } else {
            window.open(`https://${network}.etherscan.io/tx/` + txhash);
        }
    }
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
                    Transaction Dashboard
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
                                    value={txhash}
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
                                    placeholder="Search by Transaction hash"
                                    variant="outlined"
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            </Container>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 4,
                }}
            >
                <Container maxWidth="sx">
                    {/* <TransactionTab />\ */}
                    <form {...props}>
                        <Card>
                            <CardContent>
                                {data.map((detail) => (
                                    <Grid container spacing={6} wrap="wrap">
                                        <Grid
                                            item
                                            md={12}
                                            sm={6}
                                            sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                            }}
                                            xs={12}
                                        >
                                            <div>
                                                <b>Transaction hash : </b>
                                                {detail.hash}
                                                <br />
                                                <b>blockHash : </b>
                                                {detail.blockHash}
                                                <br />
                                                <b>blockNumber: </b>
                                                {detail.blockNumber}
                                                <br /><br />
                                                <Divider />
                                                <br />
                                                <b>from: </b>
                                                {detail.from}
                                                <br />
                                                <b>to: </b>
                                                {detail.to}
                                                <br /><br />
                                                <Divider />
                                                <br />
                                                <b>gasPrice: </b>
                                                {detail.gasPrice_ether}gwei
                                                <br /><br />
                                                <Divider />
                                                <br />
                                                <b>Value: </b>
                                                {detail.value_ether}ether
                                                <br />
                                            </div>
                                        </Grid>

                                        <Grid
                                            item
                                            md={4}
                                            sm={6}
                                            sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                            }}
                                            xs={12}
                                        ></Grid>
                                    </Grid>
                                ))}
                            </CardContent>
                        </Card>
                    </form>
                </Container>
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
            </Box>
        </Card>
    );
};

TransactionNodeDetail.getLayout = (page) => (
    <DashboardLayout>{page}</DashboardLayout>
);
export default TransactionNodeDetail;
