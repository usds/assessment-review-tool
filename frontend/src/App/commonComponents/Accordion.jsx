import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import uniqueId from "react-html-id";

export default class Accordion extends React.Component {
  constructor() {
    super();
    uniqueId.enableUniqueIds(this);
    this.state = {
      isExpanded: false
    };
  }

  static propTypes = {
    title: PropTypes.string.isRequired,
    isDrawer: PropTypes.bool
  };

  onExpand = () => {
    this.setState({
      isExpanded: !this.state.isExpanded
    });
  };

  render() {
    if (this.props.isDrawer) {
      return (
        <div className="usa-accordion smeqa-rr-drawers smeqa-rr-drawers--no-faces">
          <div className="smeqa-rr-drawer smeqa-rr-drawer--no-face">
            <h5 className="usa-accordion__heading smeqa-rr-prof-level__heading">
              <button
                type="button"
                className="usa-accordion__button smeqa-rr-drawer__button smeqa-rr-drawer--no-face__button"
                aria-expanded={this.state.isExpanded}
                aria-controls={this.nextUniqueId()}
                onClick={this.onExpand}
              >
                {this.props.title}
              </button>
            </h5>
            <div
              id={this.lastUniqueId()}
              className="usa-accordion__content usa-prose smeqa-rr-drawer__content"
              hidden={!this.state.isExpanded}
            >
              {this.props.children}
            </div>
          </div>
        </div>
      );
    } else {
      let classNames = classnames(
        {
          "usa-accordion": true,
          "usa-accordion--bordered": false
        },
        this.props.addClass
      );

      return (
        <div className={classNames}>
          <h2 className="usa-accordion__heading">
            <button
              type="button"
              className="usa-accordion__button"
              aria-expanded={this.state.isExpanded}
              aria-controls={this.nextUniqueId()}
              onClick={this.onExpand}
            >
              {this.props.title}
            </button>
          </h2>
          <div
            id={this.lastUniqueId()}
            className="usa-accordion__content usa-prose"
            hidden={!this.state.isExpanded}
          >
            {this.props.children}
          </div>
        </div>
      );
    }
  }
}
