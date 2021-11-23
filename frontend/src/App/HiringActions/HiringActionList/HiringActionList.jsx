import React from "react";
import { hiringActionsPropTypes } from "../../propTypes";

import "../../../styles/App.css";

class HiringActionList extends React.Component {
  static propTypes = {
    hiringActions: hiringActionsPropTypes,
  };

  render() {
    const { hiringActions } = this.props;

    return <div className="grid-container">{hiringActions}</div>;
  }
}

export default HiringActionList;
