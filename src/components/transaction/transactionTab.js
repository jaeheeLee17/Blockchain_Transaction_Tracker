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

class TransactionTab extends Component {
  render() {
    const Tab = () => {
      const [current, setCurrent] = useState(1);
      return (
        <div>
          <button onClick={() => setCurrent(1)}>1절</button>
          <button onClick={() => setCurrent(2)}>2절</button>
          <Content current={current}></Content>
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
          <p>
            동해물과 백두산이 마르고 닳도록 <br />
            하느님이 보우하사 우리나라 만세
          </p>
        );
      } else if (props.current === 2) {
        return (
          <p>
            남산 위에 저 소나무 철갑을 두른 듯 <br />
            바람 서리 불변함은 우리 기상일세
          </p>
        );
      }
    };
    return (
      <Nav>
        <Nav.Item>
          <Nav.Link
            onClick={() => {
              setTab(1);
            }}
          >
            <Card>
              <CardHeader title="Overview" />
            </Card>
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            onClick={() => {
              setTab(2);
            }}
          >
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
