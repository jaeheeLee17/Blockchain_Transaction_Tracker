import Head from "next/head";
import { DashboardLayout } from "../components/dashboard-layout";
import { Box, Container, Typography } from "@mui/material";
import { Overview } from "frontend/src/components/transaction/overview";
import TransactionTab from "frontend/src/components/transaction/transactionTab";

const Transactiondetail = () => (
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
          <TransactionTab />
        </Container>
      </Box>
    </Box>
  </>
);

Transactiondetail.getLayout = (page) => (
  <DashboardLayout>{page}</DashboardLayout>
);
export default Transactiondetail;
