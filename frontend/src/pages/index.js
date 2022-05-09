import Head from "next/head";
import { Box, Container, Grid } from "@mui/material";
import { Budget, Ether_price } from "../components/dashboard/ether_price";
import { LatestTransaction } from "../components/dashboard/latest-transaction";
import { Transactions } from "../components/dashboard/transactions";
import { DashboardLayout } from "../components/dashboard-layout";
import { Gas } from "src/components/dashboard/gas";
import { Graph } from "src/components/dashboard/graph";

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
            <Ether_price />
          </Grid>
          <Grid item xl={3} lg={3} sm={6} xs={12}>
            <Transactions />
          </Grid>
          {/* <Grid item xl={3} lg={3} sm={6} xs={12}>
            <TasksProgress />
          </Grid>
          <Grid item xl={3} lg={3} sm={6} xs={12}>
            <TotalProfit sx={{ height: "100%" }} />
          </Grid> */}
          {/* <Grid item lg={3} sm={6} xl={3} xs={12}>
            <Status />
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <Node_info />
          </Grid> */}
          <Grid item lg={12} md={12} xl={12} xs={12}>
            <LatestTransaction />
          </Grid>
          <Grid item lg={12} md={12} xl={12} xs={12}>
            <Gas sx={{ height: "100%" }} />
          </Grid>

          {/* <Grid item lg={12} md={12} xl={12} xs={12}>
            <Transaction_ratio_graph sx={{ height: "100%" }} />
          </Grid> */}

          {/* <Grid item lg={12} md={12} xl={9} xs={12}>
            <LatestOrders />
          </Grid> */}
        </Grid>
      </Container>
    </Box>
  </>
);

Dashboard.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Dashboard;
