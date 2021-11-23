import React from "react";
import PropTypes from "prop-types";

/**
 * Provides one of four standard alert types.
 * An alert consists of a box with a light background color,
 * an icon, a headline, and a short explanation.
 *
 * The alert type determines the background color and icon displayed
 *
 * Alert types are 'success', 'warning', 'error', 'info'
 *
 * If the type is 'error' and no role is specified, role defaults to 'alert'
 *
 * @returns {node} the rendered DOM node
 * @param {string} type  Sets the alert type if no status is given
 * @param {string} title Text for the headline
 * @param {node} body  Text for the description
 * @param {string} role  ARIA role type
 */

const TYPE_INFO = "info";
const TYPE_SUCCESS = "success";
const TYPE_ERROR = "error";
const TYPE_WARNING = "warning";
const ROLE_ALERT = "alert";
const ROLE_ALERTDIALOG = "alertdialog";
const ROLE_REGION = "region";

export default class Alert extends React.Component {
  static propTypes = {
    type: PropTypes.oneOf([TYPE_INFO, TYPE_SUCCESS, TYPE_ERROR, TYPE_WARNING]),
    title: PropTypes.string.isRequired,
    body: PropTypes.node,
    role: PropTypes.oneOf([ROLE_ALERT, ROLE_ALERTDIALOG]),
  };

  getRole() {
    return this.props.role !== undefined
      ? this.props.role
      : this.props.type === TYPE_ERROR
      ? ROLE_ALERT
      : ROLE_REGION;
  }

  render() {
    const { type, title, children, body } = this.props;
    let bodyContent = null;
    if (typeof body === "string") {
      bodyContent = <p style={{ whiteSpace: "pre-wrap" }}>{body}</p>;
    } else if (Array.isArray(body)) {
      bodyContent = body.map((e, i) => (
        <p style={{ whiteSpace: "pre-wrap" }} key={i}>
          {e}
        </p>
      ));
    } else if (typeof body == "object") {
      bodyContent = body;
    } else {
      bodyContent = "error";
    }
    return (
      <div
        className={`usa-alert usa-alert--${type} smeqa-alert`}
        role={this.getRole()}
      >
        <div className="usa-alert__body">
          <h3 className="usa-alert__heading">{title}</h3>
          <div className="usa-alert__text">{bodyContent}</div>
          <div className="smeqa-alert__footer">{children}</div>
        </div>
      </div>
    );
  }
}
