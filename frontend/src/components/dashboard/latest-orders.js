import { format } from "date-fns";
import { v4 as uuid } from "uuid";
import PerfectScrollbar from "react-perfect-scrollbar";
import ScrollBar from "react-perfect-scrollbar";
import {
  Box,
  Button,
  Card,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
  CardContent,
} from "@mui/material";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { SeverityPill } from "../severity-pill";
import { useFormik } from "formik";

const orders = [
  {
    id: uuid(),
    ref: "0xa56f2d6190c636...", //한 줄 라인 글자 수 제한 만들기
    amount: 30.5,
    customer: {
      method: "Transfer",
    },
    block: 14324234,
    age: "12 days 20 hrs ago",
    from: "0x462ef16694f7ad4cb...",
    flow: "out",
    to: "0xd2a79d5278d0b...",
    value: "0 Ether",
    Txn_Fee: 0.000078522,
    createdAt: 1555016400000,
    status: "pending",
  },
  {
    id: uuid(),
    ref: "0x5e220b0a99e7...",
    amount: 25.1,
    customer: {
      method: "Transfer",
    },
    Block: 14324234,
    flow: "out",
    createdAt: 1555016400000,
    status: "delivered",
  },
  {
    id: uuid(),
    ref: "0xd2a79d5278d0b2b...",
    amount: 10.99,
    customer: {
      method: "Transfer",
    },
    Block: 14324234,
    flow: "in",
    createdAt: 1554930000000,
    status: "refunded",
  },
  {
    id: uuid(),
    ref: "0x462ef16694f7ad4cb8...",
    amount: 96.43,
    customer: {
      method: "Transfer",
    },
    Block: 14324234,
    flow: "out",
    createdAt: 1554757200000,
    status: "pending",
  },
  {
    id: uuid(),
    ref: "0x9e9a9204dd4fc05f15...",
    amount: 32.54,
    customer: {
      method: "Mint",
    },
    Block: 14324234,
    flow: "out",
    createdAt: 1554670800000,
    status: "delivered",
  },
  {
    id: uuid(),
    ref: "0x01116e3330180fc37b...",
    amount: 16.76,
    customer: {
      method: "Transfer",
    },
    flow: "out",
    Block: 14324234,
    createdAt: 1554670800000,
    status: "delivered",
  },
];

export const LatestOrders = (props) => {
  return (
    <Card {...props}>
      <CardHeader title="Latest Transactions" />
      <CardContent>
        <PerfectScrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Txn Hash</TableCell>
                  <TableCell>Method</TableCell>
                  <TableCell>Block</TableCell>
                  <TableCell>Age</TableCell>
                  <TableCell>From</TableCell>
                  <TableCell></TableCell>
                  <TableCell>To</TableCell>
                  <TableCell>Value</TableCell>
                  {/* <TableCell sortDirection="desc">
                    <Tooltip enterDelay={300} title="Sort">
                      <TableSortLabel active direction="desc">
                        Date
                      </TableSortLabel>
                    </Tooltip>
                  </TableCell> */}
                  <TableCell>Txn Fee</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow hover key={order.id}>
                    <TableCell>{order.ref}</TableCell>
                    <TableCell>
                      <Button
                        color="secondary"
                        // disabled={formik.isSubmitting}
                        fullWidth
                        size="small"
                        type="submit"
                        variant="contained"
                      >
                        {order.customer.method}
                      </Button>
                    </TableCell>
                    <TableCell>{order.block}</TableCell>
                    <TableCell>{order.age}</TableCell>
                    {/* <TableCell>
                      {format(order.createdAt, "dd/MM/yyyy")}
                    </TableCell> */}
                    <TableCell>{order.from}</TableCell>
                    <TableCell>
                      <Button
                        color="inherit"
                        // disabled={formik.isSubmitting}
                        fullWidth
                        size="small"
                        type="submit"
                        variant="contained"
                      >
                        {order.flow}
                      </Button>
                    </TableCell>

                    <TableCell>{order.to}</TableCell>
                    <TableCell>{order.value}</TableCell>
                    <TableCell>{order.Txn_Fee}</TableCell>
                    <TableCell>
                      <SeverityPill
                        color={
                          (order.status === "delivered" && "success") ||
                          (order.status === "refunded" && "error") ||
                          "warning"
                        }
                      >
                        {order.status}
                      </SeverityPill>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </PerfectScrollbar>
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
            variant="text"
          >
            View all
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};
