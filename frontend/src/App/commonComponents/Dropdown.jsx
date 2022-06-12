import React from "react";
import PropTypes from "prop-types";
import uniqueId from "react-html-id";

class Dropdown extends React.Component {
  constructor() {
    super();
    uniqueId.enableUniqueIds(this);
  }

  static propTypes = {
    options: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string,
        value: PropTypes.string,
      })
    ),
    label: PropTypes.string,
    name: PropTypes.name,
    selectedValue: PropTypes.value,
    onChange: PropTypes.string,
  };

  render() {
    const options = this.props.options.map((option) => {
      let { value, text } = { ...option };
      return (
        <option value={value} selected={this.props.selectedValue === value}>
          {text}
        </option>
      );
    });
    return (
      <React.Fragment>
        <label className="usa-label" htmlfor={this.nextUniqueId()}>
          {this.props.label}
        </label>
        <select
          className="usa-select"
          name={this.props.name}
          id={this.lastUniqueId()}
          onChange={this.props.onChange}
        >
          <option value>- Select -</option>
          {options}
        </select>
      </React.Fragment>
    );
  }
}

export default Dropdown;
