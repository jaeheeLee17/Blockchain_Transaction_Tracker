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
import TransactionTab from "./transactionTab";

export const Overview = (props) => (
  <form {...props}>
    <Card>
      {/* 메뉴 탭 생성 overview, Logs, Status, ... */}
      <TransactionTab />
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
            <p>Transaction Hash: </p>
            <br />
            <p>Status: </p>
            <br />
            <p>Block: </p>
            <br />
            <p>Timestamp: </p>
            <br />
            <Divider />
            <br />
            <p>From: </p>
            <br />
            <p>Interacted With (To): </p>
            <br />
            <Divider />
            <br />
            <p>Tokens Transferred: </p>
            <br />
            <Divider />
            <br />
            <p>Value: </p>
            <br />
            <p>Transaction Fee: </p>
            <br />
            <p>Gas Price: </p>
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
