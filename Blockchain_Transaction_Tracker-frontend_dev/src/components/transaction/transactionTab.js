import React, { Component, useState } from "react";
import { Nav } from "react-bootstrap";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  Typography,
} from "@mui/material";
import { Overview } from "./overview";
import { Logs } from "./Logs";
import { Status } from "./Status";

class TransactionTab extends Component {
  render() {
    const Tab = () => {
      const [current, setCurrent] = useState(1);
      return (
        <div>
          <Card>
            <Button
              onClick={() => setCurrent(1)}
              color="primary"
              variant="outlined"
            >
              Overview
            </Button>
            <Button
              onClick={() => setCurrent(2)}
              color="primary"
              variant="outlined"
            >
              Logs
            </Button>
            <Button
              onClick={() => setCurrent(3)}
              color="primary"
              variant="outlined"
            >
              Status
            </Button>
            <Content current={current}></Content>
          </Card>
        </div>
      );
    };
    const Content = (props) => {
      return (
        <div>
          {/* <h1>{props.current}절입니다.</h1> */}
          <Verse current={props.current}></Verse>
        </div>
      );
    };

    const Verse = (props) => {
      if (props.current === 1) {
        return <Overview />;
      } else if (props.current === 2) {
        return <Logs />;
      } else if (props.current === 3) {
        return <Status />;
      }
    };
    return (
      <div>
        <Tab />
      </div>
    );
  }
}

export default TransactionTab;
