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

const Moretransaction = (props) => {
  const [transaction, setTransaction] = useState([]);
  const [latest, setLatest] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:5000/eth/db/latestTransaction", {})
      .then((res) => {
        console.log(res.data.data);
        setTransaction(res.data.data);
      })
      .catch((error) => {
        console.dir(error);
      });
  }, []);

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
                  <TableCell>Create</TableCell>
                  <TableCell>Update</TableCell>
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
                      {tr.transactionHash.substring(0, 20) + "..."}
                    </TableCell>
                    <TableCell>{tr.createdAt}</TableCell>
                    <TableCell>{tr.updatedAt}</TableCell>
                    <TableCell>{tr.blockNumber}</TableCell>
                    <TableCell>
                      <b>from </b>
                      {+tr.from.substring(0, 20) + "..."}
                      <br />
                      <b>to </b>
                      {tr.to.substring(0, 20) + "..."}
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
