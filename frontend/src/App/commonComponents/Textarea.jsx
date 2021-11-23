import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import uniqueId from "react-html-id";

class Textarea extends React.Component {
  constructor() {
    super();
    uniqueId.enableUniqueIds(this);
  }

  static propTypes = {
    value: PropTypes.string,
    heading: PropTypes.string,
    label: PropTypes.string,
    name: PropTypes.string,
    onChange: PropTypes.func,
    addLabelClass: PropTypes.string,
    placeholder: PropTypes.string,
  };

  render() {
    let classNames = classnames(
      {
        "usa-textarea": true,
      },
      this.props.addClass
    );
    let labelClassNames = classnames(
      {
        "usa-label": true,
      },
      this.props.addLabelClass
    );

    return (
      <React.Fragment>
        <h2 className="smeqa-rr-comps__title">{this.props.heading}</h2>
        <label className={labelClassNames} htmlFor={this.nextUniqueId()}>
          {this.props.label && this.props.label + " - "}
          <span
            style={{ textDecoration: "underline", cursor: "pointer" }}
            onClick={() => {
              this.props.onChange({ target: { value: "" } });
            }}
          >
            Clear
          </span>
        </label>
        <textarea
          className={classNames}
          id={this.lastUniqueId()}
          name={this.props.name}
          onChange={this.props.onChange}
          value={this.props.value}
          maxLength={this.props.maxLength}
          placeholder={this.props.placeholder}
        />
      </React.Fragment>
    );
  }
}

export default Textarea;
