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
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  PerfectScrollbar,
} from "@mui/material";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { DashboardLayout } from "../components/dashboard-layout";
import { Search as SearchIcon } from "../icons/search";
import ReactTooltip from "react-tooltip";
import Web3 from "web3";
import Link from "next/link";
import Router from "next/router";
import axios from "axios";
import Token from "@mui/icons-material/Token";

export const WalletAddress = (props) => {
  const [walletAddress, setWalletAddress] = useState("");
  const [network, setNetwork] = React.useState("mainnet");
  const onChangeAddress = (e) => setWalletAddress(e.target.value);

  const apiUrl = process.env.NEXT_PUBLIC_API_ROOT;
  const [eth, setEth] = useState([]);
  const [token, setToken] = useState([]);
  const [total, setTotal] = useState(false);
  const [address, setAddress] = useState([]);
  const [tx, setTx] = useState([]);
  const [tokenTx, setTokenTx] = useState([]);
  const [name, setName] = React.useState("");
  const regHash = /^0x([A-Fa-f0-9]{64})$/;
  const web3 = new Web3(Web3.givenProvider || "ws://localhost:8546");

  const onClickButton = async () => {
    if (web3.utils.isAddress(walletAddress)) {
      findAddr();
    } else {
      alert("invalid address");
      setWalletAddress("");
      return;
    }
  };

  const onKeyPress = async (e) => {
    if (e.key === "Enter") {
      if (web3.utils.isAddress(walletAddress)) {
        await findAddr();
      } else {
        alert("invalid address");
        setWalletAddress("");
        return;
      }
    }
  };

  const handleChange = async (event) => {
    setNetwork(event.target.value);
  };
  const handleChangeName = async (event) => {
    setName(event.target.value);
  };

  const onKeyPressSearch = async (e) => {
    if (e.key === "Enter") {
      if (regHash.test(address)) {
        await findAddr();
      } else {
        alert("invalid address");
        setAddress("");
        return;
      }
    }
  };
  async function findAddr() {
    try {
      const [
        resultEtherBalance,
        resultTokenBalance,
        resultETHTxInfo,
        resultTokenTxInfo,
      ] = await Promise.all([
        axios.get(apiUrl + "/eth/network/etherBalance", {
          params: {
            endpoint: network,
            walletAddress: walletAddress,
          },
        }),
        axios.get(apiUrl + "/eth/network/tokenBalanceList", {
          params: {
            endpoint: network,
            walletAddress: walletAddress,
          },
        }),
        axios.get(apiUrl + "/eth/db/ETHTxInfo", {
          params: {
            walletAddress: walletAddress,
          },
        }),
        axios.get(apiUrl + "/eth/db/TokenTxInfo", {
          params: {
            walletAddress: walletAddress,
          },
        }),
      ]);

      console.log(
        "resultEtherBalance, resultTokenBalance, resultETHTxInfo, resultTokenTxInfo",
        resultEtherBalance,
        resultTokenBalance,
        resultETHTxInfo,
        resultTokenTxInfo
      );
      setEth(resultEtherBalance?.data.data);
      setToken(resultTokenBalance?.data.data.tokens);
      setTotal(true);
      console.log(resultETHTxInfo?.data.data[0]);
      console.log(resultETHTxInfo?.data.data[0].transactions);
      setTx(resultETHTxInfo?.data.data[0].transactions.slice(0, 6));
      setTokenTx(resultTokenTxInfo?.data.data[0].transactions.slice(0, 6));
    } catch (e) {
      console.dir(e);
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
        <Typography sx={{ m: 0 }} variant="h4">
          Wallet Address Dashboard {network}
        </Typography>
        <Box sx={{ mt: 1 }}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  flexGrow: 1,
                  // maxWidth: 1000,
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
      <Box sx={{ width: "100%" }}>
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              p: 3,
              // width: 1300,
            }}
          >
            <Card>
              <Box>
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
                        width: "100%",
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
                    <Divider />
                    {/* <Box
                    sx={{
                      alignItems: "center",
                      justifyContent: "flex-start",
                    }}
                    > */}
                    <Box
                      sx={{
                        alignItems: "center",
                        justifyContent: "flex-start",
                      }}
                    >
                      <Card>
                        <Typography
                          gutterBottom
                          variant="subtitle1"
                          sx={{
                            margin: 5,
                            // width: 1500,
                          }}
                        >
                          <b>ETH Transaction </b>
                        </Typography>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell></TableCell>
                              <TableCell>Txn Hash</TableCell>
                              <TableCell>BlockNum</TableCell>
                              <TableCell>date</TableCell>
                              <TableCell></TableCell>
                              <TableCell>Value</TableCell>
                              <TableCell></TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {tx.map((t) => (
                              <TableRow key={t.id}>
                                <TableCell>
                                  <Button
                                    color="inherit"
                                    // disabled={formik.isSubmitting}
                                    fullWidth
                                    size="small"
                                    type="submit"
                                    variant="contained"
                                  >
                                    tx
                                  </Button>
                                </TableCell>

                                <TableCell>
                                  <Link
                                    as={"/transactiondetail"}
                                    href={{
                                      pathname: "/txDetail",
                                      query: {
                                        transactionHash: t.transactionHash,
                                        date: t.date,
                                        blockNum: t.blockNum,
                                        value: t.value,
                                        from: t.from,
                                        to: t.to,
                                      },
                                    }}
                                  >
                                    <a>
                                      {t.transactionHash.substring(0, 20) +
                                        "..."}
                                    </a>
                                  </Link>
                                </TableCell>
                                <TableCell>{t.blockNum}</TableCell>
                                <TableCell>{t.date.substring(0, 19)}</TableCell>
                                <TableCell>
                                  <b>from </b>
                                  {+t.from.substring(0, 20) + "..."}
                                  <br />
                                  <b>to </b>
                                  {t.to.substring(0, 20) + "..."}
                                </TableCell>
                                <TableCell>
                                  <Button
                                    color="secondary"
                                    // disabled={formik.isSubmitting}
                                    fullWidth
                                    size="small"
                                    type="submit"
                                    variant="contained"
                                  >
                                    {t.value}
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
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
                            variant="text"
                            // onClick={onChangePage}
                          >
                            View more
                          </Button>
                        </Box>
                      </Card>
                    </Box>
                    <Divider />
                    <Box
                      sx={{
                        alignItems: "center",
                        justifyContent: "flex-start",
                        // display: "inline-flex",
                      }}
                    >
                      <Card>
                        <Typography
                          // color="textSecondary"
                          gutterBottom
                          variant="subtitle1"
                          sx={{
                            margin: 5,
                            // width: 1500,
                          }}
                        >
                          <b>ERC20 Token Transaction</b>
                        </Typography>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell></TableCell>
                              <TableCell>Txn Hash</TableCell>
                              <TableCell>Token name</TableCell>
                              {/* <TableCell>Token symbol</TableCell> */}
                              {/* <TableCell>Token number</TableCell> */}
                              <TableCell>Date</TableCell>
                              <TableCell></TableCell>
                              <TableCell>Contract address</TableCell>
                              <TableCell>Value</TableCell>
                              <TableCell></TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {tokenTx.map((t) => (
                              <TableRow key={t.id}>
                                <TableCell>
                                  <Button
                                    color="inherit"
                                    // disabled={formik.isSubmitting}
                                    fullWidth
                                    size="small"
                                    type="submit"
                                    variant="contained"
                                  >
                                    tx
                                  </Button>
                                </TableCell>
                                <TableCell>
                                  <Link
                                    as={"/transactiondetail"}
                                    href={{
                                      pathname: "/tokenDetail",
                                      query: {
                                        transactionHash: t.transactionHash,
                                        blockNum: t.blockNum,
                                        date: t.date,
                                        contractAddress: t.contractAddress,
                                        tokenName: t.tokenName,
                                        tokenSymbol: t.tokenSymbol,
                                        tokenNumber: t.tokenNumber,
                                        from: t.from,
                                        to: t.to,
                                        value: t.value,
                                      },
                                    }}
                                  >
                                    <a>
                                      {t.transactionHash.substring(0, 20) +
                                        "..."}
                                    </a>
                                  </Link>
                                </TableCell>
                                <TableCell>{t.tokenName}</TableCell>
                                {/* <TableCell>{t.tokenSymbol}</TableCell> */}
                                {/* <TableCell>{t.tokenNumber}</TableCell> */}
                                <TableCell>{t.date.substring(0, 19)}</TableCell>
                                <TableCell>
                                  <b>from </b>
                                  {+t.from.substring(0, 20) + "..."}
                                  <br />
                                  <b>to </b>
                                  {t.to.substring(0, 20) + "..."}
                                </TableCell>
                                <TableCell>
                                  {t.contractAddress.substring(0, 20) + "..."}
                                </TableCell>
                                <TableCell>
                                  <Button
                                    color="secondary"
                                    // disabled={formik.isSubmitting}
                                    fullWidth
                                    size="small"
                                    type="submit"
                                    variant="contained"
                                  >
                                    {t.value}
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
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
                            variant="text"
                            // onClick={onChangePage}
                          >
                            View more
                          </Button>
                        </Box>
                      </Card>
                    </Box>
                    {/* </Box> */}
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
