import Head from "next/head";
import { Box, Container } from "@mui/material";
import { CustomerListResults } from "../components/node-list/node-list-results";
import { CustomerListToolbar } from "../components/node-list/node-list-toolbar";
import { DashboardLayout } from "../components/dashboard-layout";
import { customers } from "../__mocks__/customers";

const Transaction_ratio = () => (
  <>
    <Head>
      <title>Node List</title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth={false}>
        <CustomerListToolbar />
        <Box sx={{ mt: 3 }}>
          <CustomerListResults customers={customers} />
        </Box>
      </Container>
    </Box>
  </>
);
Transaction_ratio.getLayout = (page) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default Transaction_ratio;
