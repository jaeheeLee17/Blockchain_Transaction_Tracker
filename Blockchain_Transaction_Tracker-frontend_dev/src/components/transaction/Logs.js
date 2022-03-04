import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  Typography,
} from "@mui/material";

export const Logs = (props) => (
  <form {...props}>
    <Card>
      {/* 메뉴 탭 생성 overview, Logs, Status, ... */}
      {/* <TransactionTab /> */}
      {/* <CardHeader title="Overview" /> */}
      <Divider />
      <CardContent>
        <Grid container spacing={6} wrap="wrap">
          <Grid
            item
            md={12}
            sm={6}
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
            xs={12}
          >
            <b>Address </b>
            <br />
            <p>Name </p>
            <br />
            <p>Topics </p>
          </Grid>

          <Grid
            item
            md={4}
            sm={6}
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
            xs={12}
          ></Grid>
        </Grid>
      </CardContent>
      <Divider />
    </Card>
  </form>
);
