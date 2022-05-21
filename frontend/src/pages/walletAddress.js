import { Graph } from "react-d3-graph";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  TextField,
  InputAdornment,
  Typography,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { DashboardLayout } from "../components/dashboard-layout";
import { Search as SearchIcon } from "../icons/search";
import ReactTooltip from "react-tooltip";
import Web3 from "web3";
import Link from "next/link";
import Router from "next/router";
import axios from "axios";
import { Eth_balance } from "src/components/Eth_balance";
import Token from "@mui/icons-material/Token";

export const WalletAddress = (props) => {
  const [walletAddress, setWalletAddress] = useState("");
  const [network, setNetwork] = React.useState("mainnet");
  const onChangeAddress = (e) => setWalletAddress(e.target.value);

  const onKeyPress = (e) => {
    if (e.key === "Enter") {
      if (web3.utils.isAddress(walletAddress)) {
        findAddr();
      } else {
        alert("invaild address");
        setWalletAddress("");
        return;
      }
    }
  };
  const apiUrl = process.env.NEXT_PUBLIC_API_ROOT;
  const [eth, setEth] = useState([]);
  const [token, setToken] = useState([]);
  const [total, setTotal] = useState(false);
  const [address, setAddress] = useState([]);
  const [name, setName] = React.useState("");
  const regHash = /^0x([A-Fa-f0-9]{64})$/;
  const web3 = new Web3(Web3.givenProvider || "ws://localhost:8546");
  const onClickButton = () => {
    if (web3.utils.isAddress(walletAddress)) {
      findAddr();
    } else {
      alert("invaild address");
      setWalletAddress("");
      return;
    }
  };

  const handleChange = (event) => {
    setNetwork(event.target.value);
  };
  const handleChangeName = (event) => {
    setName(event.target.value);
  };

  const onKeyPressSearch = (e) => {
    if (e.key === "Enter") {
      if (regHash.test(address)) {
        findAddr();
      } else {
        alert("invaild address");
        setAddress("");
        return;
      }
    }
  };

  const onClickBtn = () => {
    if (regHash.test(address)) {
      findAddr();
    } else {
      alert("invaild address");
      setAddress("");
      return;
    }
  };

  function findAddr() {
    axios
      .get(apiUrl + "/eth/network/etherBalance", {
        params: {
          endpoint: network,
          walletAddress: walletAddress,
        },
      })
      .then((res) => {
        const etherBalance = res.data.data;
        setEth(etherBalance);
      })
      .catch((error) => {
        console.dir(error);
      });

    axios
      .get(apiUrl + "/eth/network/tokenBalanceList", {
        params: {
          endpoint: network,
          walletAddress: walletAddress,
        },
      })
      .then((res) => {
        console.log(res.data.data);
        const data = res.data.data.tokens;
        setToken(data);
        setTotal(true);
      })
      .catch((error) => {
        console.dir(error);
      });
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
        <Typography sx={{ m: 0 }} variant="h4">
          Wallet Address Dashboard {network}
        </Typography>
        <Box sx={{ mt: 1 }}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  flexGrow: 1,
                  maxWidth: 1000,
                  display: "inline-flex",
                }}
              >
                <Box>
                  <FormControl sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel id="demo-simple-select-label">
                      Network
                    </InputLabel>
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
                    marginTop: "8px",
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
                  placeholder="Search by Wallet Address"
                  variant="outlined"
                />
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>

      <Divider />
      <Box
        sx={{
          display: "flex-start",
          justifyContent: "flex-end",
          p: 2,
        }}
      >
        <>
          <Box>
            <Card>
              <Box
                sx={{
                  alignItems: "center",
                  display: "flex",
                  flexGrow: 1,
                  minHeight: "100%",
                  justifyContent: "flex-start",
                }}
              >
                {total === false ? (
                  ""
                ) : (
                  <Container>
                    <Box sx={{ my: 3 }}>
                      <Typography color="grey.600" variant="h5" fontSize={30}>
                        Overview
                      </Typography>
                      <br />
                      <Divider />
                    </Box>

                    <Box
                      sx={{
                        alignItems: "center",
                        justifyContent: "flex-start",
                        // display: "flex",
                        ml: -1,
                      }}
                    >
                      <Typography
                        // color="textSecondary"
                        gutterBottom
                        variant="subtitle1"
                        sx={{
                          margin: 5,
                        }}
                      >
                        <b>Ether Balance : </b> {eth.balance}
                      </Typography>
                      {/* <br /> */}
                      <Divider />
                      <Typography
                        // color="textSecondary"
                        gutterBottom
                        variant="subtitle1"
                        sx={{
                          margin: 5,
                        }}
                      >
                        <Box />
                        <Box
                          sx={{
                            alignItems: "center",
                            justifyContent: "flex-start",
                            display: "inline-flex",
                          }}
                        >
                          <b>Token Balance :</b>
                          <Box>
                            <FormControl sx={{ m: 1, minWidth: 300 }}>
                              <InputLabel
                                id="demo-simple-select-label"
                                sx={{
                                  width: 300,
                                }}
                              >
                                Token
                              </InputLabel>
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={name}
                                label="name"
                                onChange={handleChangeName}
                              >
                                {token.map((tk) => (
                                  <MenuItem value={tk.name} key={tk.name}>
                                    <Typography>
                                      {tk.name} ({tk.symbol})
                                      <br />
                                    </Typography>
                                    <Typography
                                      color="textSecondary"
                                      gutterBottom
                                      variant="body2"
                                    >
                                      {tk.balance} {tk.symbol}
                                    </Typography>
                                  </MenuItem>
                                ))}
                                {/* <MenuItem value={"ropsten"}>ropsten</MenuItem>
                              <MenuItem value={"rinkeby"}>rinkeby</MenuItem>

                              <MenuItem value={"kovan"}>kovan</MenuItem> */}
                              </Select>
                            </FormControl>
                          </Box>
                        </Box>
                      </Typography>
                    </Box>
                  </Container>
                )}
              </Box>
            </Card>
          </Box>
        </>
      </Box>
    </Card>
  );
};

WalletAddress.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default WalletAddress;
