import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography,
  Grid,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  ResponsiveContainer,
} from "recharts";
import { autoType } from "d3";

export const Graph = (props) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_ROOT;
  const [tr, setTr] = useState([]);

  useEffect(() => {
    const network = "mainnet";
    axios
      .post(apiUrl + "/eth/network/postblockinfo", {
        endpoint: network,
        blockn: "10000",
      })
      .then((res) => {
        console.log(res);
        if (res.data.responseStatus == 200) {
          axios
            .get(apiUrl + "/eth/db/getTransactionsPerHour", {
              params: {
                sethour: 7,
              },
            })
            .then((res) => {
              const transaction = res.data.data;
              let t = [];
              transaction.forEach((ts, num) => {
                const da = ts.starttime.substring(0, 10);
                const te = ts.starttime.substring(11, 16);
                const data = {
                  starttime: ` ${ts.starttime.substring(0, 10)} 
            
            ${ts.starttime.substring(11, 16)}
            `,
                  transactions: ts.transactions,
                  endtime: ts.endtime,
                };
                t.push(data);
              });
              setTr(t.reverse());
            })
            .catch((error) => {
              console.dir(error);
            });
        }
      });
  }, []);

  return (
    <Card>
      <CardHeader title="Transaction Graph" />
      <Divider />
      <Box
        sx={{
          p: 5,
          textAlign: "center",
          width: "100%",
        }}
      >
        <LineChart
          width={1500}
          height={300}
          margin={{
            top: 5,
            right: 20,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={"starttime"} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="transactions"
            stroke="#8884d8"
            activeDot={{ r: 7 }}
            data={tr}
          />
        </LineChart>
      </Box>
    </Card>
  );
};
