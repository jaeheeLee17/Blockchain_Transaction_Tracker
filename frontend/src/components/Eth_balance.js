import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormHelperText,
  Link,
  TextField,
  Typography,
  Card,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
// import MoneyIcon from "@mui/icons-material/Money";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import MoneyIcon from "@mui/icons-material/Money";
import axios from "axios";
import Register from "src/pages/register";

export const Eth_balance = (props) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_ROOT;
  const [eth, setEth] = useState([]);
  const [address, setAddress] = useState([]);
  const [network, setNetwork] = React.useState("mainnet");
  const handleChange = (event) => {
    setNetwork(event.target.value);
  };

  useEffect(async () => {
    await axios
      .get(apiUrl + "/eth/network/etherBalance", {
        params: {
          endpoint: network,
          walletAddress: address,
        },
      })
      .then((res) => {
        console.log(res.data);
        const data = res.data.data;
        setEth(data);
      })
      .catch((error) => {
        console.dir(error);
      });
  }, []);

  return (
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
            <Container>
              {/* <form onSubmit={formik.handleSubmit}> */}
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
                  </Box>
                </Typography>
              </Box>
              {/* </form> */}
            </Container>
          </Box>
        </Card>
      </Box>
    </>
  );
};
