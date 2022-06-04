import Head from "next/head";
import Router, { useRouter } from "next/router";
import { DashboardLayout } from "../components/dashboard-layout";
import {
  Box,
  Container,
  Typography,
  Card,
  Divider,
  CardContent,
  Grid, Button,
} from "@mui/material";

import React, { useEffect, useState } from "react";
import axios from "axios";

import ArrowRightIcon from "@mui/icons-material/ArrowRight";

const TransactionNodeDetail = (props) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_ROOT;
  const router = useRouter();
  const {data: hash, net: network} = router.query;
  const [detail,setDetail]=useState([{
    blockHash: "",
    blockNumber: "",
    date:"",
    from:"",
    gasPrice_ether:"",
    to:"",
    transactionHash:"",
    transactionIndex:"",
    value_ether: "",
  }])

  useEffect(async () => {
    if (hash && network) {
      try {
        const res = await axios
            .get(apiUrl+"/eth/network/getTransactionInfo", {
              params: {
                addr: hash,
                endpoint: network
              },
            })
        const transactionInfo = res.data.data;
        const result = Object.keys(transactionInfo).map((key) => transactionInfo[key]);
        setDetail({
          blockHash: result[0],
          blockNumber: result[1],
          transactionHash:result[2],
          transactionIndex:result[3],
          from: result[4],
          to:result[5],
          value_ether: result[6],
          gasPrice_ether: result[7],
          date:result[8],
        });
      } catch (e) {
        console.dir(e);
      }
    }
  },[hash, network])

  function onChangePage() {
    if (network === 'mainnet') {
      window.open(`https://etherscan.io/tx/` + hash);
    } else {
      window.open(`https://${network}.etherscan.io/tx/` + hash);
    }
  }

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
                          <b>Transaction hash : </b>
                          {detail.transactionHash}
                          <br />
                          <b>blockHash : </b>
                          {detail.blockHash}
                          <br />
                          <b>blockNumber: </b>
                          {detail.blockNumber}
                          <br /><br />
                          <Divider />
                          <br />
                          <b>from: </b>
                          {detail.from}
                          <br />
                          <b>to: </b>
                          {detail.to}
                          <br /><br />
                          <Divider />
                          <br />
                          <b>gasPrice: </b>
                          {detail.gasPrice_ether} gwei
                          <br /><br />
                          <Divider />
                          <br />
                          <b>Value: </b>
                          {detail.value_ether} ether
                          <br />
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
          <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                p: 2,
              }}
          >
            <Button
                color="primary"
                endIcon={<ArrowRightIcon fontSize="small" />}
                size="small"
                onClick={onChangePage}
            >
              More Details
            </Button>
          </Box>
        </Box>
      </>
  );
};

TransactionNodeDetail.getLayout = (page) => (
    <DashboardLayout>{page}</DashboardLayout>
);
export default TransactionNodeDetail;