import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
} from "@mui/material";
// import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
// import MoneyIcon from "@mui/icons-material/Money";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

export const Node_ex = (props) => (
  <Card sx={{ height: "100%" }} {...props}>
    <CardContent>
      <Grid container spacing={3} sx={{ justifyContent: "space-between" }}>
        <Grid item>
          <br />
          <Typography color="black" variant="caption">
            <p>Status: </p>
            <p>Name: </p>
            <p>Address: </p>
            <p>Best block:</p>
            <p>Version: </p>
          </Typography>
        </Grid>
      </Grid>
      <Box
        sx={{
          pt: 2,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography
          color="error"
          sx={{
            mr: 1,
          }}
          variant="body2"
        >
          <Button
            color="primary"
            endIcon={<ArrowRightIcon />}
            size="big"
            variant="text"
          >
            View details
          </Button>
        </Typography>
      </Box>
    </CardContent>
  </Card>
);
