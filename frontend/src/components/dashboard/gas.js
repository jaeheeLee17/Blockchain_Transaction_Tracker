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
  const [gas, setGas] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:5000/eth/network/gasPriceStats", {})
      .then((res) => {
        const data = res.data.data;
        setGas(data);
      })
      .catch((error) => {
        console.dir(error);
      });
  }, []);
  return (
    <Card {...props}>
      <CardHeader title="Gas Price" />
      <Divider />
      <CardContent
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            p: 5,
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
                  <Typography color="green" variant="body1">
                    {gas.low}
                  </Typography>
                </Grid>
              </Grid>
              <Box
                sx={{
                  pt: 2,
                  display: "flex",
                  alignItems: "left",
                }}
              ></Box>
            </CardContent>
          </Card>
        </Box>
        <Box
          sx={{
            p: 5,
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
                  <Typography color="skyblue" variant="body1">
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
            p: 5,
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
                  <Typography color="red" variant="body1">
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
