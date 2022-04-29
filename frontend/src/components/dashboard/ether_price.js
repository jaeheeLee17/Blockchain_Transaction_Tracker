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
import { useEffect, useState } from "react";
import axios from "axios";

export const Ether_price = (props) => {
  const [eth, setEth] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:5000/eth/network/ethPrice", {})
      .then((res) => {
        const data = res.data.data;
        setEth(data);
      })
      .catch((error) => {
        console.dir(error);
      });
  }, []);

  return (
    <>
      <Card sx={{ height: "100%" }} {...props}>
        <CardContent>
          <Grid container spacing={3} sx={{ justifyContent: "space-between" }}>
            <Grid item>
              <Typography color="textSecondary" gutterBottom variant="overline">
                ETHER PRICE
              </Typography>
              <Typography color="textPrimary">
                <h2>USD</h2> <p>{eth.ethPrice_USD}</p>
                <br />
                <h2>BTC</h2> {eth.ethPrice_BTC}
              </Typography>
            </Grid>
            <Grid item>
              {/* <Avatar
            sx={{
              backgroundColor: "error.main",
              height: 56,
              width: 56,
            }}
          >
            <MoneyIcon />
          </Avatar> */}
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
          <Box
            sx={{
              pt: 2,
              display: "flex",
              alignItems: "center",
            }}
          >
            {/* <ArrowDownwardIcon color="error" />
            <Typography
              color="error"
              sx={{
                mr: 1,
              }}
              variant="body2"
            >
              12%
            </Typography> */}
            {/* <Typography color="textSecondary" variant="caption">
          Since last month
        </Typography> */}
          </Box>
        </CardContent>
      </Card>
    </>
  );
};
