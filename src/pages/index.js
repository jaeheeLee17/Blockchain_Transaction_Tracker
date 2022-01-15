import Head from "next/head";
import { Box, Container, Grid } from "@mui/material";
import { Budget } from "../components/dashboard/ether_price";
import { LatestOrders } from "../components/dashboard/latest-orders";
// import { LatestProducts } from '../components/dashboard/latest-products';
import { Sales } from "../components/dashboard/node_connect";
import { TasksProgress } from "../components/dashboard/tasks-progress";
import { TotalCustomers } from "../components/dashboard/transactions";
import { TotalProfit } from "../components/dashboard/total-profit";
import { TrafficByDevice } from "../components/dashboard/traffic-by-device";
import { DashboardLayout } from "../components/dashboard-layout";
import { Status } from "../components/dashboard/status";
import { Node_info } from "../components/dashboard/node_info";
import { Node_ex } from "../components/dashboard/node_ex.js";
import styled from "styled-components";

const Dashboard = () => (
  <>
    <Head>
      <title>Dashboard</title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth={false}>
        <Grid container spacing={3}>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <Budget />
          </Grid>
          <Grid item xl={3} lg={3} sm={6} xs={12}>
            <TotalCustomers />
          </Grid>
          <Grid item xl={3} lg={3} sm={6} xs={12}>
            <TasksProgress />
          </Grid>
          <Grid item xl={3} lg={3} sm={6} xs={12}>
            <TotalProfit sx={{ height: "100%" }} />
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <Status />
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <Node_info />
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <Node_ex />
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <Node_ex />
          </Grid>
          <Grid item lg={8} md={12} xl={9} xs={12}>
            <Sales />
          </Grid>
          <Grid item lg={4} md={6} xl={3} xs={12}>
            <TrafficByDevice sx={{ height: "100%" }} />
          </Grid>
          {/* <Grid item lg={4} md={6} xl={3} xs={12}> */}
          {/* <LatestProducts sx={{ height: '100%' }} /> */}
          {/* </Grid> */}
          <Grid item lg={12} md={12} xl={9} xs={12}>
            <LatestOrders />
          </Grid>
        </Grid>
      </Container>
    </Box>
  </>
);

Dashboard.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Dashboard;
