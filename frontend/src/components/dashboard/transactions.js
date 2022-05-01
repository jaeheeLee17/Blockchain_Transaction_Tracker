import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
// import PeopleIcon from "@mui/icons-material/PeopleOutlined";
import MoneyIcon from "@mui/icons-material/Money";
import { useEffect, useState } from "react";
import axios from "axios";

export const Transactions = (props) => {
  const [tr, setTr] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:5000/eth/network/ethCount", {})
      .then((res) => {
        console.log(res.data);
        const data = res.data.data;
        setTr(data);
      })
      .catch((error) => {
        console.dir(error);
      });
  }, []);
  return (
    <Card sx={{ height: "100%" }} {...props}>
      <CardContent>
        <Grid container spacing={3} sx={{ justifyContent: "space-between" }}>
          <Grid item>
            <Typography color="textSecondary" gutterBottom variant="overline">
              ether count
              <br />
              <br />
            </Typography>

            <Typography color="textPrimary" variant="h4">
              {tr.ethCount}
            </Typography>
          </Grid>
          <Grid item>
            {/* <Avatar
            sx={{
              backgroundColor: "success.main",
              height: 56,
              width: 56,
            }}
          >
            <PeopleIcon />
          </Avatar> */}
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
        >
          {/* <ArrowUpwardIcon color="success" />
          <Typography
            variant="body2"
            sx={{
              mr: 1,
            }}
          >
            16%
          </Typography> */}
          {/* <Typography color="textSecondary" variant="caption">
          Since last month
        </Typography> */}
        </Box>
      </CardContent>
    </Card>
  );
};
