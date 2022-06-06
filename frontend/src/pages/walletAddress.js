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
  Grid,
  PerfectScrollbar,
  Modal,
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
  const [totalEth, setTotalEth] = useState([]);
  const [token, setToken] = useState([]);
  const [totalTk, setTotalTk] = useState([]);
  const [total, setTotal] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [address, setAddress] = useState([]);

  const [tx, setTx] = useState([]);
  const [tokenTx, setTokenTx] = useState([]);
  const [name, setName] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [status, setStatus] = React.useState(false);

  const regHash = /^0x([A-Fa-f0-9]{64})$/;
  const web3 = new Web3(Web3.givenProvider || "ws://localhost:8546");

  const onClickButton = async () => {
    if (web3.utils.isAddress(walletAddress)) {
      handleOpen();
      await findAddr();
      checkData();
    } else {
      alert("invalid address");
      setWalletAddress("");
      return;
    }
  };

  const onKeyPress = async (e) => {
    if (e.key === "Enter") {
      if (web3.utils.isAddress(walletAddress)) {
        handleOpen();
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

  const onChangeEthPage = (e) => {
    Router.push({
      // as: "/transactiondetail",
      pathname: "moreEthTransaction",
      query: {
        data: JSON.stringify(totalEth),
      },
    });
  };
  const onChangeTokenPage = (e) => {
    Router.push({
      pathname: "moreTkTransaction",
      // as: "/transactiondetail",
      query: {
        data: JSON.stringify(totalTk),
      },
    });
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
      const [resultEtherBalance, resultTokenBalance] = await Promise.all([
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
      ]);

      console.log(
        "resultEtherBalance, resultTokenBalance",
        resultEtherBalance,
        resultTokenBalance
      );
      setEth(resultEtherBalance?.data.data);
      console.log(resultTokenBalance.data.data);
      setToken(resultTokenBalance?.data.data.tokens);
      setTotal(true);
      checkData(resultTokenBalance?.data.data.tokens);
    } catch (e) {
      console.dir(e);
    }
  }

  const checkData = async (token) => {
    axios
      .get(apiUrl + "/eth/db/walletTrace", {
        params: {
          endpoint: network,
          walletAddress: walletAddress,
        },
      })
      .then((res) => {
        console.log("checkData");
        console.log(res);
        const result = res.data.data;

        if (!result) postToDB(walletAddress);
        else {
          getTxChainFrom(token);
        }
      })
      .catch((error) => {
        console.dir(error);
      });
  };

  //db에 data 쌓는 부분
  const postToDB = (wallet) => {
    //modal 띄우기
    axios
      .post(apiUrl + "/eth/network/walletTrace", {
        endpoint: network,
        walletAddress: walletAddress,
      })
      .then((res) => {
        getTxChainFrom();
      })
      .catch((error) => {
        console.dir(error);
        setWalletAddress("");
        alert("no such data at " + network + " network");
        return;
      });
  };

  //db에서 있는 데이터 가져옴
  const getTxChainFrom = (token) => {
    console.log("getfrom");
    axios
      .post(apiUrl + "/eth/network/ETHTxlist", {
        endpoint: network,
        walletAddress: walletAddress,
        startBlockNum: "1",
        endBlockNum: "latest",
        page: "1",
        offset: "100",
        sort: "desc",
      })
      .then((res) => {
        console.log(res);
        setTimeout(() => {
          if (res.data.responseStatus == 200) {
            axios
              .get(apiUrl + "/eth/db/ETHTxInfo", {
                params: {
                  walletAddress: walletAddress,
                },
              })
              .then((res) => {
                console.log("ETHTxInfo");
                const resultETHTxInfo = res.data.data;
                if (resultETHTxInfo == undefined) {
                  setTx([]);
                  setTotalEth([]);
                } else {
                  setTx(resultETHTxInfo?.transactions.slice(0, 6));
                  setTotalEth(resultETHTxInfo?.transactions);
                }

                getTkChainFrom(token);
              })
              .catch((error) => {
                console.dir(error);
              });
          }
        }, 2000);
      });

    const getTkChainFrom = (tokens) => {
      console.log("tk");
      console.log(tokens);
      if (tokens == undefined) {
        setTokenTx([]);
        setTotalTk([]);
        console.log("no token");
        setStatus(true);
        handleClose();
        return;
      } else {
        axios
          .post(apiUrl + "/eth/network/tokentxlist", {
            endpoint: network,
            walletAddress: walletAddress,
            contractAddress: "",
            startBlockNum: "1",
            endBlockNum: "latest",
            sort: "desc",
          })
          .then((res) => {
            setTimeout(() => {
              if (res.data.responseStatus == 200) {
                axios
                  .get(apiUrl + "/eth/db/TokenTxInfo", {
                    params: {
                      walletAddress: walletAddress,
                    },
                  })
                  .then((res) => {
                    console.log("TokenTxInfo");
                    const resultTokenTxInfo = res.data.data;
                    if (resultTokenTxInfo == undefined) {
                      setTokenTx([]);
                      setTotalTk([]);
                    } else {
                      setTokenTx(resultTokenTxInfo?.transactions.slice(0, 6));
                      setTotalTk(resultTokenTxInfo?.transactions);
                    }

                    setStatus(true);
                    handleClose();
                  })
                  .catch((error) => {
                    console.dir(error);
                  });
              }
            }, 2000);
          })
          .catch((e) => {
            console.log(e);
          });
      }
    };
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",

    // border: 1,
    // boxShadow: 24,
    p: 4,
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
          Wallet Address Dashboard
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
      <Box>
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              width: "100%",
              p: 3,
            }}
          >
            <Card>
              <Box>
                {/* {total === false ? (
                  ""
                ) : ( */}
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
                      <b>Ether Balance : </b>

                      {eth.balance}
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
                          width: 600,
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
                              {status == true
                                ? token.map((tk) => (
                                    <MenuItem value={tk.name} key={tk.id}>
                                      <Typography>
                                        {tk.name}
                                        <br />
                                      </Typography>
                                      <Typography
                                        color="textSecondary"
                                        gutterBottom
                                        variant="body2"
                                      >
                                        {tk.balance}
                                      </Typography>
                                    </MenuItem>
                                  ))
                                : ""}
                            </Select>
                          </FormControl>
                        </Box>
                      </Box>
                    </Typography>
                  </Box>

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
                          {status == true
                            ? tx.map((t) => (
                                <TableRow key={t.transactionHash}>
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
                                  <TableCell>
                                    {t.date.substring(0, 19)}
                                  </TableCell>
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
                              ))
                            : // )

                              ""}
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
                          onClick={onChangeEthPage}
                        >
                          View more
                        </Button>
                      </Box>
                    </Card>
                    {/* )} */}
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

                            <TableCell>Date</TableCell>
                            <TableCell></TableCell>
                            <TableCell>Contract address</TableCell>
                            <TableCell>Value</TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                        </TableHead>
                        {status == true ? (
                          tokenTx.map((t, n) => (
                            <TableBody>
                              <TableRow key={n}>
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
                            </TableBody>
                          ))
                        ) : (
                          <TableBody></TableBody>
                        )}
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
                          onClick={onChangeTokenPage}
                        >
                          View more
                        </Button>
                      </Box>
                    </Card>
                    {/* )} */}
                  </Box>
                  {/* </Box> */}
                </Container>
                {/* )} */}
              </Box>
            </Card>
          </Box>
        </>
      </Box>
      {
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography
              id="modal-modal-title"
              variant="h4"
              component="h2"
              textAlign={"center"}
            >
              loading...
            </Typography>
            <Typography
              id="modal-modal-description"
              sx={{ mt: 2 }}
              textAlign={"center"}
              variant="h6"
            >
              searching for your walletAddress
            </Typography>
          </Box>
        </Modal>
      }
    </Card>
  );
};

WalletAddress.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default WalletAddress;
