import React from "react";
import PropTypes from "prop-types";

class ProgressBar extends React.Component {
  static propTypes = {
    total: PropTypes.shape({
      quantity: PropTypes.number, // ie: 212
      label: PropTypes.string, // ie: total applicants
    }),
    positive: PropTypes.shape({
      quantity: PropTypes.number, // ie: 100
      label: PropTypes.string, // ie: reviews approved
    }),
    negative: PropTypes.shape({
      quantity: PropTypes.number, // ie: 30
      label: PropTypes.string, // ie: reviews rejected
    }),
    pending: PropTypes.shape({
      quantity: PropTypes.number, // ie: 14
      label: PropTypes.string, // ie: reviews pending
    }),
    comment: PropTypes.string,
  };
  render() {
    const positivePercentage = this.props.positive
      ? `${(this.props.positive.quantity / this.props.total.quantity) * 100}%`
      : 0;
    const negativePercentage = this.props.negative
      ? `${(this.props.negative.quantity / this.props.total.quantity) * 100}%`
      : 0;
    const pendingPercentage = this.props.pending
      ? `${(this.props.pending.quantity / this.props.total.quantity) * 100}%`
      : 0;

    const totalLabel = this.props.total ? (
      <span style={{ float: "right" }}>{`${this.props.total.label}`}</span>
    ) : null;

    const positiveLabel = this.props.positive ? (
      <span> {`${this.props.positive.label}`} </span>
    ) : null;

    const negativeLabel = this.props.negative ? (
      <span> {`${this.props.negative.label}`} </span>
    ) : null;

    const pendingLabel = this.props.pending ? (
      <span> {`${this.props.pending.label}`} </span>
    ) : null;

    const baseProgressStyle = {
      display: "block",
      position: "relative",
      float: "left",
      height: "100%",
    };
    const additionalComment = this.props.comment ? (
      <div>
        <span>{this.props.comment}</span>
      </div>
    ) : null;
    return (
      <div className="smeqa-rr-progress-bar">
        <div
          style={{
            position: "relative",
            height: "20px",
            width: "100%",
            margin: "4px 0",
            backgroundColor: "#e6e6e6",
          }}
        >
          <span
            style={{
              ...baseProgressStyle,
              backgroundColor: "#00a91c",
              width: positivePercentage,
            }}
          ></span>
          <span
            style={{
              ...baseProgressStyle,
              backgroundColor: "#b51d09",
              width: negativePercentage,
            }}
          ></span>
          <span
            style={{
              ...baseProgressStyle,
              backgroundColor: "gray",
              width: pendingPercentage,
            }}
          ></span>
        </div>
        {totalLabel}
        {positiveLabel}
        {negativeLabel}
        {pendingLabel}
        {additionalComment}
      </div>
    );
  }
}

export default ProgressBar;
