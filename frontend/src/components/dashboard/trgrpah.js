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

// const data = [
//   {
//     name: "Page A",
//     uv: 4000,
//     pv: 2400,
//     amt: 2400,
//   },
//   {
//     name: "Page B",
//     uv: 3000,
//     pv: 1398,
//     amt: 2210,
//   },
//   {
//     name: "Page C",
//     uv: 2000,
//     pv: 9800,
//     amt: 2290,
//   },
//   {
//     name: "Page D",
//     uv: 2780,
//     pv: 3908,
//     amt: 2000,
//   },
//   {
//     name: "Page E",
//     uv: 1890,
//     pv: 4800,
//     amt: 2181,
//   },
//   {
//     name: "Page F",
//     uv: 2390,
//     pv: 3800,
//     amt: 2500,
//   },
//   {
//     name: "Page G",
//     uv: 3490,
//     pv: 4300,
//     amt: 2100,
//   },
// ];
export const Graph = (props) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_ROOT;
  const [tr, setTr] = useState([]);

  useEffect(() => {
    axios
      .get(apiUrl + "/eth/db/getTransactionsPerHour", {
        params: {
          sethour: 7,
        },
      })
      .then((res) => {
        const transaction = res.data.data;
        let t = [];
        transaction.forEach((ts) => {
          const data = {
            starttime: `${ts.starttime.substring(0, 10)}

              ${ts.starttime.substring(11, 19)}`,
            transactions: ts.transactions,
          };
          t.push(data);
        });
        console.log(t);
        setTr(t);
      })
      .catch((error) => {
        console.dir(error);
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
