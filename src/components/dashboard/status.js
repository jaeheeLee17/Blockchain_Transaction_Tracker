import {
  Avatar,
  Box,
  Card,
  CardContent,
  circularProgressClasses,
  Grid,
  Typography,
} from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import MoneyIcon from "@mui/icons-material/Money";
// import Icon from "react-native-vector-icons/Ionicons";

export const Status = (props) => (
  <Card sx={{ height: "100%" }} {...props}>
    <CardContent>
      <Grid container spacing={3} sx={{ justifyContent: "space-between" }}>
        <Grid item>
          <Typography color="black" gutterBottom variant="overline">
            status
          </Typography>
          <br />

          <Typography color="black" variant="caption">
            {/* <ion-icon name="ellipse-outline"></ion-icon> */}
            <p>Run</p>
            <p>Starting</p>
            <p>updating</p>
            <p>Stop</p>
            <p>Error</p>
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
);
