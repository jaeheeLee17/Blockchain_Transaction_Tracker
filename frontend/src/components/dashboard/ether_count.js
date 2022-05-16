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

export const Ether_count = (props) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_ROOT;
  const [tr, setTr] = useState([]);

  useEffect(async () => {
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
                  ETHER COUNT
                  <br />
                </Typography>
                <br />
                <br />
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
        </Card>
      </Box>
    </>
  );
};
