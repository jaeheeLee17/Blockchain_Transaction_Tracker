import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography,
  Grid,
} from "@mui/material";
import LaptopMacIcon from "@mui/icons-material/LaptopMac";
import PhoneIcon from "@mui/icons-material/Phone";
import TabletIcon from "@mui/icons-material/Tablet";
import { useState, useEffect } from "react";
import axios from "axios";

export const Gas = (props) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_ROOT;
  const [gas, setGas] = useState([]);
  useEffect(() => {
    axios
      .get(apiUrl + "/eth/network/gasPriceStats", {})
      .then((res) => {
        const data = res.data.data;
        setGas(data);
      })
      .catch((error) => {
        console.dir(error);
      });
  }, []);

  return (
    <Card
      sx={{
        height: 300,
        width: 600,
      }}
      {...props}
    >
      {/* <CardHeader
        sx={{
          height: 10,
        }}
        title="Gas Price"
      /> */}
      <Grid container spacing={3} margin={1}>
        <Grid item>
          <Typography
            color="textSecondary"
            gutterBottom
            variant="overline"
            fontSize={15}
          >
            Gas price
          </Typography>
        </Grid>
      </Grid>
      <Divider />
      <CardContent
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            // p: 1,
            mx: 3,
            textAlign: "center",
          }}
        >
          <Card sx={{ height: "100%" }} {...props}>
            <CardContent>
              <Grid
                container
                spacing={3}
                sx={{ justifyContent: "space-between" }}
              >
                <Grid item>
                  <Typography color="black" gutterBottom variant="h5">
                    Low
                  </Typography>
                  <Typography color="green" variant="subtitle1">
                    {gas.low}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
        <Box
          sx={{
            // p: 1,
            mx: 3,
            textAlign: "center",
          }}
        >
          <Card sx={{ height: "100%" }} {...props}>
            <CardContent>
              <Grid
                container
                spacing={3}
                sx={{ justifyContent: "space-between" }}
              >
                <Grid item>
                  <Typography color="black" gutterBottom variant="h5">
                    Average
                  </Typography>
                  <Typography color="skyblue" variant="subtitle1">
                    {gas.average}
                  </Typography>
                </Grid>
              </Grid>
              <Box
                sx={{
                  pt: 2,
                  display: "flex",
                  alignItems: "center",
                }}
              ></Box>
            </CardContent>
          </Card>
        </Box>
        <Box
          sx={{
            mx: 3,
            textAlign: "center",
          }}
        >
          <Card sx={{ height: "100%" }} {...props}>
            <CardContent>
              <Grid
                container
                spacing={3}
                sx={{ justifyContent: "space-between" }}
              >
                <Grid item>
                  <Typography color="black" gutterBottom variant="h5">
                    High
                  </Typography>
                  <Typography color="red" variant="subtitle1">
                    {gas.high}
                  </Typography>
                </Grid>
              </Grid>
              <Box
                sx={{
                  pt: 2,
                  display: "flex",
                  alignItems: "center",
                }}
              ></Box>
            </CardContent>
          </Card>
        </Box>
      </CardContent>
    </Card>
  );
};
