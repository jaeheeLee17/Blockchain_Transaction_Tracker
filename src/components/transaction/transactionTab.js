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

class TransactionTab extends Component {
  render() {
    const Tab = () => {
      const [current, setCurrent] = useState(1);
      return (
        <div>
          <Card>
            <button onClick={() => setCurrent(1)}>
              <CardHeader title="Overview" />
            </button>
            <button onClick={() => setCurrent(2)}>
              <CardHeader title="Status" />
            </button>
            <Content current={current}></Content>
          </Card>
        </div>
      );
    };
    const Content = (props) => {
      return (
        <div>
          <h1>{props.current}절입니다.</h1>
          <Verse current={props.current}></Verse>
        </div>
      );
    };

    const Verse = (props) => {
      if (props.current === 1) {
        return (
          <div>
            <Overview />
          </div>
        );
      } else if (props.current === 2) {
        return <p>테스트 2절</p>;
      }
    };
    return (
      <Nav>
        <Nav.Item>
          <Nav.Link>
            <Card>
              <CardHeader title="Overview" />
            </Card>
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link>
            <Tab />
            <Card>
              <CardHeader title="Status" />
            </Card>
          </Nav.Link>
        </Nav.Item>
      </Nav>
    );
  }
}

export default TransactionTab;
