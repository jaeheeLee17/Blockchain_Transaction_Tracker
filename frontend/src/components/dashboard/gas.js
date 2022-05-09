import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography,
  useTheme,
} from "@mui/material";
import LaptopMacIcon from "@mui/icons-material/LaptopMac";
import PhoneIcon from "@mui/icons-material/Phone";
import TabletIcon from "@mui/icons-material/Tablet";
import { Low } from "./low";
import { Average } from "./average";
import { High } from "./high";

export const Gas = (props) => {
  return (
    <Card {...props}>
      <CardHeader title="Gas Price" />
      <Divider />
      <CardContent
        sx={{
          display: "flex",
          justifyContent: "left",
        }}
      >
        <Box
          sx={{
            p: 5,
            textAlign: "center",
            color: "success.dark",
          }}
        >
          <Low />
        </Box>
        <Box
          sx={{
            p: 5,
            textAlign: "center",
          }}
        >
          <Average />
        </Box>
        <Box
          sx={{
            p: 5,
            textAlign: "center",
          }}
        >
          <High />
        </Box>
      </CardContent>
    </Card>
  );
};
