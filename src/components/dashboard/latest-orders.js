import { format } from "date-fns";
import { v4 as uuid } from "uuid";
import PerfectScrollbar from "react-perfect-scrollbar";
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

const orders = [
  {
    id: uuid(),
    ref: "0xa56f2d6190c6369180c2e7ebefe3999d592627c46d6ecc282ea24f5a1533e140",
    amount: 30.5,
    customer: {
      name: "Ekaterina Tankova",
    },
    createdAt: 1555016400000,
    status: "pending",
  },
  {
    id: uuid(),
    ref: "0x5e220b0a99e76f2f00d037d0de77fc12b5f1682b3e42d705d1d582e82e4b418d",
    amount: 25.1,
    customer: {
      name: "Cao Yu",
    },
    createdAt: 1555016400000,
    status: "delivered",
  },
  {
    id: uuid(),
    ref: "0xd2a79d5278d0b2bc4c0a0d816726b7e51a9612ff1d434ba34a77b5326edf9a2a",
    amount: 10.99,
    customer: {
      name: "Alexa Richardson",
    },
    createdAt: 1554930000000,
    status: "refunded",
  },
  {
    id: uuid(),
    ref: "0x462ef16694f7ad4cb8e0afc7e971a3a2afda6a05c79b2d160802b9dcbb7ce460",
    amount: 96.43,
    customer: {
      name: "Anje Keizer",
    },
    createdAt: 1554757200000,
    status: "pending",
  },
  {
    id: uuid(),
    ref: "0x9e9a9204dd4fc05f15922179c9406f14335f1fc8ac36673d8dd3daf978b37f1a",
    amount: 32.54,
    customer: {
      name: "Clarke Gillebert",
    },
    createdAt: 1554670800000,
    status: "delivered",
  },
  {
    id: uuid(),
    ref: "0x01116e3330180fc37b91faa61060662ab7878557e290549d5b6ba1d4ec6396f0",
    amount: 16.76,
    customer: {
      name: "Adam Denisov",
    },
    createdAt: 1554670800000,
    status: "delivered",
  },
];

export const LatestOrders = (props) => {
  return (
    <Card {...props}>
      <CardHeader title="Transactions" />
      <CardContent>
        <PerfectScrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table
              style={{
                justifyContent: "center",
                alignItems: "center",
                width: "20px",
                padding: "0 5px",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell>Txn Hash</TableCell>
                  <TableCell>Method</TableCell>
                  <TableCell>Block</TableCell>
                  <TableCell>Age</TableCell>
                  <TableCell>From</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>To</TableCell>
                  <TableCell>Value</TableCell>
                  <TableCell sortDirection="desc">
                    <Tooltip enterDelay={300} title="Sort">
                      <TableSortLabel active direction="desc">
                        Date
                      </TableSortLabel>
                    </Tooltip>
                  </TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow hover key={order.id}>
                    <TableCell>{order.ref}</TableCell>
                    <TableCell>{order.customer.name}</TableCell>
                    <TableCell>{order.customer.name}</TableCell>
                    <TableCell>{order.customer.name}</TableCell>
                    <TableCell>
                      {format(order.createdAt, "dd/MM/yyyy")}
                    </TableCell>
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
