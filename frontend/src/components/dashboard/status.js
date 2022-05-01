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
            Gas
          </Typography>
          <br />

          <Typography color="black" variant="caption"></Typography>
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
