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
  Typography,
} from "@mui/material";
import Link from "next/link";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { useRouter } from "next/router";

const MoreTkTransaction = (props) => {
  const router = useRouter();
  const [tx, setTx] = useState([]);
  const apiUrl = process.env.NEXT_PUBLIC_API_ROOT;

  useEffect(() => {
    const a = router.query.data;
    const d = JSON.parse(a.trim());
    setTx(d);
  }, []);

  return (
    <Card {...props}>
      <CardHeader title="ERC20 Token Transactions" />
      <Divider />
      <Box
        sx={{
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <Card>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Txn Hash</TableCell>
                <TableCell>Token name</TableCell>
                <TableCell>Token symbol</TableCell>
                <TableCell>Token number</TableCell>
                <TableCell>Date</TableCell>
                <TableCell></TableCell>
                <TableCell>Contract address</TableCell>
                <TableCell>Value</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tx.map((t) => (
                <TableRow key={t.id}>
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
                    <Link
                      as={"/transactiondetail"}
                      href={{
                        pathname: "/tokenDetail",
                        query: {
                          transactionHash: t.transactionHash,
                          blockNum: t.blockNum,
                          date: t.date,
                          contractAddress: t.contractAddress,
                          tokenName: t.tokenName,
                          tokenSymbol: t.tokenSymbol,
                          tokenNumber: t.tokenNumber,
                          from: t.from,
                          to: t.to,
                          value: t.value,
                        },
                      }}
                    >
                      <a>{t.transactionHash.substring(0, 20) + "..."}</a>
                    </Link>
                  </TableCell>
                  <TableCell>{t.tokenName}</TableCell>

                  <TableCell>{t.tokenSymbol}</TableCell>
                  <TableCell>{t.tokenNumber}</TableCell>
                  <TableCell>{t.date.substring(0, 19)}</TableCell>
                  <TableCell>
                    <b>from </b>
                    {t.from.substring(0, 20) + "..."}
                    <br />
                    <b>to </b>
                    {t.to.substring(0, 20) + "..."}
                  </TableCell>
                  <TableCell>
                    {t.contractAddress.substring(0, 20) + "..."}
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
                      {t.value}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              p: 2,
            }}
          ></Box>
        </Card>
      </Box>
    </Card>
  );
};
MoreTkTransaction.getLayout = (page) => (
  <DashboardLayout>{page}</DashboardLayout>
);
export default MoreTkTransaction;
