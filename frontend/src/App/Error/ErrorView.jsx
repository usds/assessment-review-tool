import React from "react";
import "../../scss/AppLayout.scss";
import PropTypes from "prop-types";

import Banner from "../commonComponents/Banner";
import Header from "../commonComponents/Header";
import Footer from "../commonComponents/Footer";
import Button from "../commonComponents/Button";
import Alert from "../commonComponents/Alert";

class ErrorPage extends React.Component {
  static propTypes = {
    user: PropTypes.any, // TODO: this is not always provided
    error: PropTypes.any, // TODO: whatever, its late
  };

  refreshPage = () => {
    window.location.reload();
  };

  render() {
    const errorResponse = this.props.error.response || null;
    const errorMessage = errorResponse ? errorResponse.data.message : null;
    const errorId = errorResponse ? errorResponse.data.uuid : null;
    const statusCode = errorResponse ? errorResponse.status : null;

    // if the user is logged out, just redirect them to the home page
    if (statusCode === 401) {
      window.location = "/";
      return;
    }

    const primarySupportEmail = "kelvin.t.luu@omb.eop.gov";
    const secondarySupportEmails =
      "neil.s.sharma@omb.eop.gov;william.slack@cms.hhs.gov";
    const subject = "Resume Review - Support Request";
    const messageBody = `Error ID: ${errorId}%0D%0A%0D%0APlease describe the error you encountered:`;
    const mailToLink = `mailto:${primarySupportEmail}?subject=${subject}&cc=${secondarySupportEmails}&body=${messageBody}`;
    return (
      <div id="main-wrapper">
        <Banner />
        <Header user={this.props.user} />
        <main>
          <div className="grid-container">
            <div className="smeqa-error-alert">
              <Alert
                type="error"
                title={`Something went wrong`}
                body={
                  <>
                    <p>
                      We seem to have run into an error. Send us a{" "}
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={mailToLink}
                      >
                        support request
                      </a>
                      .{" "}
                    </p>
                    <p style={{ whiteSpace: "pre-line" }}>
                      {errorMessage || null}
                    </p>
                  </>
                }
              >
                <Button onClick={() => this.refreshPage()} label="Try Again" />
              </Alert>
            </div>
          </div>
        </main>
        <Footer includeReturnToTop={false} />
      </div>
    );
  }
}

export default ErrorPage;
