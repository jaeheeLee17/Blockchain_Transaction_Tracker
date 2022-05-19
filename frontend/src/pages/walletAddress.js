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
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import axios from "axios";
import { DashboardLayout } from "../components/dashboard-layout";
import { Search as SearchIcon } from "../icons/search";
import ReactTooltip from "react-tooltip";
import Web3 from "web3";
import Link from "next/link";
import Router from "next/router";

export const WalletAddress = (props) => {
  const [walletAddress, setWalletAddress] = useState("");
  const [network, setNetwork] = React.useState("mainnet");
  const onChangeAddress = (e) => setWalletAddress(e.target.value);
  const onKeyPress = (e) => {
    if (e.key === "Enter") {
      if (web3.utils.isAddress(walletAddress)) {
        setDatas({ links: [], nodes: [], status: false });
        checkData();
      } else {
        alert("invaild address");
        setWalletAddress("");
        return;
      }
    }
  };
  const web3 = new Web3(Web3.givenProvider || "ws://localhost:8546");
  const onClickButton = () => {
    if (web3.utils.isAddress(walletAddress)) {
      setDatas({ links: [], nodes: [], status: false });
      checkData();
    } else {
      alert("invaild address");
      setWalletAddress("");
      return;
    }
  };
  const handleChange = (event) => {
    setNetwork(event.target.value);
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
          display: "flex",
          justifyContent: "flex-end",
          p: 2,
        }}
      >
        <Button
          color="primary"
          endIcon={<ArrowRightIcon fontSize="small" />}
          size="small"
          // onClick={onChangePage}
        >
          More Details
        </Button>
      </Box>
    </Card>
  );
};

WalletAddress.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default WalletAddress;
