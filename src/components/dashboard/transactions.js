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

export const Transactions = (props) => (
  <Card sx={{ height: "100%" }} {...props}>
    <CardContent>
      <Grid container spacing={3} sx={{ justifyContent: "space-between" }}>
        <Grid item>
          <Typography color="textSecondary" gutterBottom variant="overline">
            TRANSACTIONS
          </Typography>
          <Typography color="textPrimary" variant="h4">
            {Math.floor(Math.random() * 100000)}M
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
        <ArrowUpwardIcon color="success" />
        <Typography
          variant="body2"
          sx={{
            mr: 1,
          }}
        >
          16%
        </Typography>
        {/* <Typography color="textSecondary" variant="caption">
          Since last month
        </Typography> */}
      </Box>
    </CardContent>
  </Card>
);
