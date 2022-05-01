
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

export const Gas = (props) => {
  return (
    <Card {...props}>
      <CardHeader title="Gas Price" />
      <Divider />
      <CardContent>
        <Box
          sx={{
            height: 300,
            position: "relative",
          }}
        ></Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            pt: 2,
          }}
        >
          <Box
            sx={{
              p: 1,
              textAlign: "center",
            }}
          >
            <Typography variant="h4">ss</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
