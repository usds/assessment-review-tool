import React from "react";

import { useSelector } from "react-redux";
import { selectVersion } from "../appSlice";
import "../../styles/App.css";

// static propTypes = {
//   user: userPropTypes,
//   includeReturnToTop: PropTypes.bool,
// };
// static defaultProps = {
//   includeReturnToTop: true,
// };
const Footer = ({ includeReturnToTop = true }) => {
  const returnToTop = includeReturnToTop ? (
    <div className="grid-container usa-footer__return-to-top">
      <a href="#top">Return to top</a>
    </div>
  ) : null;
  const buildVersion = useSelector(selectVersion);
  return (
    <footer className="usa-footer usa-footer--slim">
      {returnToTop}
      <div className="usa-footer__primary-section">
        <div className="usa-footer__primary-container grid-row">
          <div className="tablet:grid-col-8">
            <nav className="usa-footer__nav">
              <ul className="grid-row grid-gap-lg">
                <li className="mobile-lg:grid-col-auto usa-footer__primary-content">
                  <a
                    className="usa-footer__primary-link"
                    rel="noopener noreferrer"
                    target="_blank"
                    href="https://smeqa.usds.gov"
                  >
                    smeqa.usds.gov
                  </a>
                </li>
                <li className="mobile-lg:grid-col-auto usa-footer__primary-content">
                  <a
                    className="usa-footer__primary-link"
                    rel="noopener noreferrer"
                    target="_blank"
                    href="https://usastaffing.gov"
                  >
                    usastaffing.gov
                  </a>
                </li>
              </ul>
            </nav>
          </div>
          <div className="tablet:grid-col-4">
            <div className="usa-footer__nav">
              <ul className="grid-row grid-gap-lg">
                <li className="mobile-lg:grid-col-auto usa-footer__primary-content">
                  <p className="usa-footer__primary-link">{buildVersion}</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="usa-footer__secondary-section">
        <div className="grid-container">
          <div className="usa-footer__logo grid-row grid-gap-2">
            <div className="grid-col-auto">
              <img
                className="usa-footer__logo-img"
                id="smeqa-footer-logo"
                src="/img/usds-logo.png"
                alt="USDS logo"
              />
            </div>
            <div className="grid-col-auto">
              <h3 className="usa-footer__logo-heading smeqa-footer-heading">
                Subject Matter Expert Qualification Assessment
              </h3>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
