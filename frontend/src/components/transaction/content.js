import React, { Component } from "react";

class Content extends Component {
  render() {
    if (this.props.page === "overview") {
      return <Overview></Overview>;
    } else if (this.props.page === "overview") {
      return <Overview onChangeDetail={this.props.onChangeDetail}></Overview>;
    }
  }
}

export default Content;
