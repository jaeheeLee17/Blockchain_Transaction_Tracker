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
import { Overview } from "../components/transaction/overview";
import TransactionTab from "../components/transaction/transactionTab";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft} from "@mui/icons-material";
import useNavigate from "react-router-dom";

const TransactionNodeDetail = (props) => {

  const router = useRouter();
  const hash = router.query.data;
  const [detail,setDetail]=useState([{
    blockHash:"",
    blockNumber:"",
    from: "",
    gas: "",
    gasPrice: "",
    hash: "",
    input: "",
    nonce: "",
    r: "",
    s: "",
    to: "",
    transactionIndex: "",
    type: "",
    v: "",
    value: ""
  }])

  useEffect(() => {
    axios
        .get("http://localhost:5000/eth/network/getTransactionInfo", {
          params: {
            addr: hash,
            endpoint:"ropsten"
          },
        })
        .then((res) => {
          const transactionInfo = res.data.data.transactionInfo;
          const result = Object.keys(transactionInfo).map((key) => transactionInfo[key]);
          setDetail({
            blockHash: result[0],
            blockNumber: result[1],
            from: result[2],
            gas: result[3],
            gasPrice: result[4],
            hash: result[5],
            input: result[6],
            nonce: result[7],
            r: result[8],
            s: result[9],
            to: result[10],
            transactionIndex: result[11],
            type: result[12],
            v: result[13],
            value: result[14]
          });

        })
        .catch((error) => {
          console.dir(error);
        });
  },[])

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
                        <b>hash : </b>
                        {detail.hash}
                        <br />
                        <b>blockHash : </b>
                        {detail.blockHash}
                        <br />
                        <b>blockNumber: </b>
                        {detail.blockNumber}
                        <br />
                        <b>from: </b>
                        {detail.from}
                        <br />
                        <b>to: </b>
                        {detail.to}
                        <br /><br />
                        <Divider />
                        <br />
                        <b>gas: </b>
                        {detail.gas}
                        <br />
                        <b>gasPrice: </b>
                        {detail.gasPrice}
                        <br /><br />

                        <Divider />
                        <br />
                        <b>Value: </b>
                        {detail.value}
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
        <Button
            color="primary"
            startIcon={<ArrowLeft fontSize="small" />}
            size="small"
            onClick={() => router.back()}
        >
          Back to Graph
        </Button>
      </Box>
    </>
  );
};

TransactionNodeDetail.getLayout = (page) => (
  <DashboardLayout>{page}</DashboardLayout>
);
export default TransactionNodeDetail;
