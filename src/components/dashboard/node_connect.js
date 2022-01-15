import { Bar } from "react-chartjs-2";
import React from "react";
import { ResponsiveNetwork } from "@nivo/network";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  useTheme,
} from "@mui/material";
// import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

export const Sales = (props) => {
  const theme = useTheme();

  const data = {
    datasets: [
      {
        backgroundColor: "#3F51B5",
        barPercentage: 0.5,
        barThickness: 12,
        borderRadius: 4,
        categoryPercentage: 0.5,
        data: [18, 5, 19, 27, 29, 19, 20],
        label: "This year",
        maxBarThickness: 10,
      },
      {
        backgroundColor: "#EEEEEE",
        barPercentage: 0.5,
        barThickness: 12,
        borderRadius: 4,
        categoryPercentage: 0.5,
        data: [11, 20, 12, 29, 30, 25, 13],
        label: "Last year",
        maxBarThickness: 10,
      },
    ],
    labels: ["1 Aug", "2 Aug", "3 Aug", "4 Aug", "5 Aug", "6 Aug", "7 aug"],
  };

  const options = {
    animation: false,
    cornerRadius: 20,
    layout: { padding: 0 },
    legend: { display: false },
    maintainAspectRatio: false,
    responsive: true,
    xAxes: [
      {
        ticks: {
          fontColor: theme.palette.text.secondary,
        },
        gridLines: {
          display: false,
          drawBorder: false,
        },
      },
    ],
    yAxes: [
      {
        ticks: {
          fontColor: theme.palette.text.secondary,
          beginAtZero: true,
          min: 0,
        },
        gridLines: {
          borderDash: [2],
          borderDashOffset: [2],
          color: theme.palette.divider,
          drawBorder: false,
          zeroLineBorderDash: [2],
          zeroLineBorderDashOffset: [2],
          zeroLineColor: theme.palette.divider,
        },
      },
    ],
    tooltips: {
      backgroundColor: theme.palette.background.paper,
      bodyFontColor: theme.palette.text.secondary,
      borderColor: theme.palette.divider,
      borderWidth: 1,
      enabled: true,
      footerFontColor: theme.palette.text.secondary,
      intersect: false,
      mode: "index",
      titleFontColor: theme.palette.text.primary,
    },
  };

  return (
    <Card {...props}>
      <CardHeader title="Node connection graph" />
      {/* 거래량에 따른 그래프 형태 변화 선택 기능 */}
      <button>button</button>
      <button>button</button>
      <button>button</button>
      <Divider />
      {/* const MyResponsiveNetwork = ({data}) => (
      <ResponsiveNetwork
        data={data}
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        linkDistance={function (e) {
          return e.distance;
        }}
        centeringStrength={0.3}
        repulsivity={6}
        nodeSize={function (n) {
          return n.size;
        }}
        activeNodeSize={function (n) {
          return 1.5 * n.size;
        }}
        nodeColor={function (e) {
          return e.color;
        }}
        nodeBorderWidth={1}
        nodeBorderColor={{ from: "color", modifiers: [["darker", 0.8]] }}
        linkThickness={function (n) {
          return 2 + 2 * n.target.data.height;
        }}
        linkBlendMode="multiply"
        motionConfig="wobbly"
      />
      )*/}
      <img
        style={{
          alignItems: "center",
          width: "600px",
          height: "500px",
          margin: "20px",
        }}
        src="/static/images/node.png"
      />
      {/* <CardContent>
        <Box
          sx={{
            height: 400,
            position: "relative",
          }}
        >
          <Bar data={data} options={options} />
        </Box>
      </CardContent> */}
      <Divider />
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
        >
          Overview
        </Button>
      </Box>
    </Card>
  );
};
