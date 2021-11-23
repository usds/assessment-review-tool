import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "../../styles/App.css";
import { userPropTypes } from "../propTypes";
import Button from "./Button";

class Header extends React.Component {
  static propTypes = {
    user: userPropTypes,
  };

  render() {
    let logout = null;
    let userSection = null;

    if (this.props.user) {
      logout = (
        <Button
          onClick={async () => {
            await fetch(`/logout`);
            window.location.href = "/";
          }}
          label="Logout"
          addClass="usa-button"
        />
      );

      userSection = (
        <span className="smeqa-rr-nav__user">
          <FontAwesomeIcon icon="user" /> {this.props.user.email}
        </span>
      );
    }

    return (
      <header className="usa-header usa-header--basic smeqa-rr-nav">
        <div className="usa-nav-container smeqa-rr-nav__body">
          <div className="usa-nav-bar smeqa-rr-nav__bar">
            <a href="/" className="smeqa-rr-nav__home-link">
              <h1 className="smeqa-rr-nav__title app-title">
                Resume Review Tool
              </h1>
            </a>
          </div>
          {userSection}
          {logout}
        </div>
      </header>
    );
  }
}

export default Header;
