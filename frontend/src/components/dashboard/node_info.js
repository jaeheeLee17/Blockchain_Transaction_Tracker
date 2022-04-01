import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
} from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import MoneyIcon from "@mui/icons-material/Money";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

const datas = [
  {
    status: "Run",
    name: "test",
    address: "13.125.146.191:3485",
    best_block: "0 (0xd582)",
    version: "0.1.0 (c76ef8)",
  },
];

export const Node_info = (props) => {
  return (
    <Card sx={{ height: "100%" }} {...props}>
      <CardContent>
        <Grid container spacing={3} sx={{ justifyContent: "space-between" }}>
          <Grid item>
            <Typography color="black" gutterBottom variant="overline">
              Selected Node Information
            </Typography>
            {/* <br />
            {datas.map((data) => (
              <Typography color="black" variant="caption">
                <p>Status: {data.status}</p>
                <p>Name: {data.name}</p>
                <p>Address: {data.address}</p>
                <p>Best block: {data.best_block}</p>
                <p>Version: {data.version}</p>
              </Typography> */}
            ))
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
};
