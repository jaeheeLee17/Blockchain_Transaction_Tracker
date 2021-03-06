import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
// import MoneyIcon from "@mui/icons-material/Money";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import MoneyIcon from "@mui/icons-material/Money";
import { useEffect, useState } from "react";
import axios from "axios";

export const Ether_price = (props) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_ROOT;
  const [eth, setEth] = useState([]);
  const [tr, setTr] = useState([]);

  useEffect(async () => {
    await axios
      .get(apiUrl + "/eth/network/ethPrice", {})
      .then((res) => {
        const data = res.data.data;
        setEth(data);
      })
      .catch((error) => {
        console.dir(error);
      });
    await axios
      .get(apiUrl + "/eth/db/ethCount", {})
      .then((res) => {
        console.log(res.data);
        const data = res.data.data;
        setTr(data);
      })
      .catch((error) => {
        console.dir(error);
      });
  }, []);

  // useEffect(() => {
  //   axios
  //     .get("http://localhost:5000/eth/network/ethCount", {})
  //     .then((res) => {
  //       console.log(res.data);
  //       const data = res.data.data;
  //       setTr(data);
  //     })
  //     .catch((error) => {
  //       console.dir(error);
  //     });
  // }, []);

  return (
    <>
      <Box>
        <Card
          sx={{
            height: 300,
          }}
          {...props}
        >
          <CardContent>
            <Grid
              container
              spacing={3}
              sx={{ justifyContent: "space-between" }}
            >
              <Grid item>
                <Typography
                  color="textSecondary"
                  gutterBottom
                  variant="overline"
                  fontSize={15}
                >
                  ETHER PRICE
                </Typography>
                <br />
                <br />
                <Typography color="textPrimary">
                  <h2>USD</h2> <p>{eth.ethPrice_USD}</p>
                  <br />
                  <h2>BTC</h2> {eth.ethPrice_BTC}
                </Typography>
              </Grid>
              <Grid item>
                <Avatar
                  sx={{
                    backgroundColor: "primary.main",
                    height: 56,
                    width: 56,
                  }}
                >
                  <AttachMoneyIcon />
                </Avatar>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        {/* <Card sx={{ height: "250px", width: "600px", margin: 1 }} {...props}>
          <CardContent>
            <Grid
              container
              spacing={3}
              sx={{ justifyContent: "space-between" }}
            >
              <Grid item>
                <Typography
                  color="textSecondary"
                  gutterBottom
                  variant="overline"
                >
                  ether count
                  <br />
                  <br />
                </Typography>

                <Typography color="textPrimary" variant="h4">
                  {tr.ethCount}
                </Typography>
              </Grid>
              <Grid item>
                <Avatar
                  sx={{
                    backgroundColor: "error.main",
                    height: 56,
                    width: 56,
                  }}
                >
                  <MoneyIcon />
                </Avatar>
              </Grid>
            </Grid>
            <Box
              sx={{
                alignItems: "center",
                display: "flex",
                pt: 2,
              }}
            ></Box>
          </CardContent>
        </Card> */}
      </Box>
    </>
  );
};