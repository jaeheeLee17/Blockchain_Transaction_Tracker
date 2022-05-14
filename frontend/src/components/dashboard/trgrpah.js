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
  const [tr, setTr] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:5000/eth/network/getTransactionsPerBlock", {
        params: {
          blockNum: 14697772,
          endpoint: "mainnet",
        },
      })
      .then((res) => {
        const data = res.data.data;
        console.log(res.data);
        setTr(data);
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
        <div style={{ width: "100%" }}>
          <LineChart
            width={600}
            height={300}
            // data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis dataKey={tr.blockNum} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="pv"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </div>
      </Box>
    </Card>
  );
};
