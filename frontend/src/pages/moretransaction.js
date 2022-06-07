import { format } from "date-fns";
import { v4 as uuid } from "uuid";
import PerfectScrollbar from "react-perfect-scrollbar";
import ScrollBar from "react-perfect-scrollbar";
import { useEffect, useState } from "react";
import { DashboardLayout } from "../components/dashboard-layout";
import axios from "axios";
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
  Divider,
} from "@mui/material";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import Link from "next/link";

const Moretransaction = (props) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_ROOT;
  const [transaction, setTransaction] = useState([]);
  const [latest, setLatest] = useState([]);
  useEffect(() => {
    axios
      .get(apiUrl + "/eth/db/latestTransaction", {})
      .then((res) => {
        console.log(res.data.data);
        setTransaction(res.data.data);
      })
      .catch((error) => {
        console.dir(error);
      });
  }, []);
  const onChangePage = (e) => {
    window.location.href = "/moretransaction";
  };

  return (
    <Card {...props}>
      <CardHeader title="Latest Transactions" />
      <Divider />
      <CardContent>
        <PerfectScrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>Txn Hash</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Block</TableCell>
                  <TableCell></TableCell>
                  <TableCell>Value</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transaction.map((tr) => (
                  <TableRow hover key={tr.id}>
                    <TableCell>
                      <Button
                        color="inherit"
                        fullWidth
                        size="small"
                        type="submit"
                        variant="contained"
                      >
                        tx
                      </Button>
                    </TableCell>
                    <TableCell>
                      {
                        // <span
                        //   onClick={() =>
                        //     router.replace({
                        //       pathname: "/transactiondetail",
                        //       query: { hash: tr.transactionHash, to: tr.to },
                        //     })
                        //   }
                        // >
                        <Link
                          as={"/transactiondetail"}
                          href={{
                            pathname: "/transactiondetail",
                            query: {
                              transactionHash: tr.transactionHash,
                              txDate: tr.date,
                              blockNumber: tr.blockNumber,
                              from: tr.from,
                              to: tr.to,
                              value: tr.value,
                            },
                          }}
                        >
                          <a>{tr.transactionHash.substring(0, 20) + "..."}</a>
                        </Link>
                        // </span>
                      }
                    </TableCell>
                    <TableCell>{tr.date.substring(0, 19)}</TableCell>
                    <TableCell>{tr.blockNumber}</TableCell>
                    <TableCell>
                      <b>from </b>
                      {tr.from}
                      <br />
                      <b>to </b>
                      {tr.to}
                    </TableCell>
                    <TableCell>
                      <Button
                        color="secondary"
                        fullWidth
                        size="small"
                        type="submit"
                        variant="contained"
                      >
                        {tr.value}
                      </Button>
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
        ></Box>
      </CardContent>
    </Card>
  );
};
Moretransaction.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default Moretransaction;
