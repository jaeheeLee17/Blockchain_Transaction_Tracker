import Head from "next/head";
import { useRouter } from "next/router";
import { DashboardLayout } from "../components/dashboard-layout";
import {
  Box,
  Container,
  Typography,
  Card,
  Divider,
  CardContent,
  Grid,
} from "@mui/material";
import { Overview } from "../components/transaction/overview";
import TransactionTab from "../components/transaction/transactionTab";
import { useEffect, useState } from "react";
import axios from "axios";

const Transactiondetail = (props) => {
  const router = useRouter();
  const data = router.query;

  return (
    <>
      <Head>
        <title>Transaction Detail</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          <Typography sx={{ m: 1 }} variant="h4">
            Transaction Details
          </Typography>
        </Container>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: 4,
          }}
        >
          <Container maxWidth="sx">
            {/* <TransactionTab />\ */}
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
                      <div>
                        <b>Transaction Hash: </b> {data.transactionHash}
                        <br />
                        <br />
                        <b>Block: </b>
                        {data.blockNumber}
                        <br />
                        <br />
                        <b>Date: </b>
                        {data.txDate}
                        <br />
                        <br />
                        <Divider />
                        <br />
                        <b>From: </b>
                        {data.from}
                        <br />
                        <br />
                        <b>Interacted With (To): </b>
                        {data.to}
                        <br />
                        <br />
                        <Divider />
                        <br />
                        <b>Value: </b>
                        {data.value}
                      </div>
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
          </Container>
        </Box>
      </Box>
    </>
  );
};

Transactiondetail.getLayout = (page) => (
  <DashboardLayout>{page}</DashboardLayout>
);
export default Transactiondetail;
