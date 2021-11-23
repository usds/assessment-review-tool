import React from "react";
import PropTypes from "prop-types";

import Alert from "./Alert";
/**
 * Displays the appropriate alert based on a HTTP status code
 * returned from the back-end.
 *
 * The status code determines the background color and icon displayed
 *
 * Alert types are 'success', 'warning', 'error', 'info'
 *
 * @returns {node} the rendered DOM node
 * @param {status} number HTTP status code that if set determines alert type
 * @param {string} title Text for the headline
 * @param {node} body  Text for the description
 */

const TYPE_INFO         = 'info';
const TYPE_SUCCESS      = 'success';
const TYPE_ERROR        = 'error';
const TYPE_WARNING      = 'warning';

export default class AlertResponse extends React.Component {
  static propTypes = {
    type: PropTypes.oneOf([
      TYPE_INFO,
      TYPE_SUCCESS,
      TYPE_ERROR,
      TYPE_WARNING
    ]),
    title: PropTypes.string.isRequired,
    body: PropTypes.node.isRequired,
    status: PropTypes.number
  };

  getType() {
    let type = TYPE_INFO;

    if (this.props.type !== undefined) {
      type = this.props.type;
    } else {
      // This could be a case switch
      // once we know which codes the backend will return
      // that could be warnings
      if (this.props.status === 200) {
        type = TYPE_SUCCESS;
      } else {
        type = TYPE_ERROR;
      }
    }

    return ( type )
  }

  render() {
    return (
      this.props.status === undefined ? null : <Alert type={this.getType()} title={this.props.title} body={this.props.body} />
    );
  }
}
