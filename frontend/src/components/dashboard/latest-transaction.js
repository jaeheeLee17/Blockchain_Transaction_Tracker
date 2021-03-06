import { format } from "date-fns";
import { v4 as uuid } from "uuid";
import PerfectScrollbar from "react-perfect-scrollbar";
import ScrollBar from "react-perfect-scrollbar";
import { useEffect, useState } from "react";
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
  Switch,
} from "@mui/material";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { json, pointer } from "d3";
import Transactiondetail from "src/pages/transactiondetail";
import Router from "react-router-dom";
import { useRouter } from "next/router";
import Link from "next/link";

export const LatestTransaction = (props) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_ROOT;
  const [transaction, setTransaction] = useState([]);
  const [latest, setLatest] = useState([]);
  useEffect(() => {
    axios
      .get(apiUrl + "/eth/db/latestTransaction", {})
      .then((res) => {
        const data = res.data.data;
        setTransaction(data);
        setLatest(data.slice(0, 6));
      })
      .catch((error) => {
        console.dir(error);
      });
  }, []);
  const onChangePage = (e) => {
    window.location.href = "/moretransaction";
  };

  // const onClickPage = (e) => {
  //   window.location.href = "/moretransaction";
  // };

  const router = useRouter();

  return (
    <Card {...props}>
      <CardHeader title="Latest Transactions" />
      <Divider />
      <CardContent>
        <PerfectScrollbar>
          <Box sx={{ minWidth: 800, maxHeight: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>Txn Hash</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Block</TableCell>
                  <TableCell>from-to</TableCell>
                  <TableCell>Value</TableCell>
                  <TableCell></TableCell>
                  {/* <TableCell sortDirection="desc">
                    <Tooltip enterDelay={300} title="Sort">
                      <TableSortLabel active direction="desc">
                        Date
                      </TableSortLabel>
                    </Tooltip>
                  </TableCell> */}
                  {/* <TableCell>To</TableCell>
                  <TableCell>Status</TableCell> */}
                </TableRow>
              </TableHead>
              {latest.map((tr) => (
                <TableBody key={tr._id}>
                  <TableRow>
                    <TableCell>
                      <Button
                        color="inherit"
                        // disabled={formik.isSubmitting}
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
                    {/* <TableCell>
                      {new Date().format(tr.createdAt, "dd/MM/yyyy")}
                    </TableCell> */}
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
                        // disabled={formik.isSubmitting}
                        fullWidth
                        size="small"
                        type="submit"
                        variant="contained"
                      >
                        {tr.value}
                      </Button>
                    </TableCell>

                    {/* <TableCell>{tr.to}</TableCell>
                    <TableCell>{tr.value}</TableCell>
                    <TableCell>{tr.Txn_Fee}</TableCell> */}
                    {/* <TableCell>
                      <SeverityPill
                        color={
                          (tr.status === "delivered" && "success") ||
                          (tr.status === "refunded" && "error") ||
                          "warning"
                        }
                      >
                        {tr.status}
                      </SeverityPill>
                    </TableCell> */}
                  </TableRow>
                </TableBody>
              ))}
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
            onClick={onChangePage}
          >
            View more
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};
