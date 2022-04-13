import React from "react";

import "../../scss/Login.scss";
import "../../scss/AppLayout.scss";
import Button from "../commonComponents/Button";

const LoginButton = (
  <Button
    label="Sign in"
    addClass="usa-button"
    onClick={() => {
      window.location.href = "/login/auth";
      return null;
    }}
  />
);

const DevButtons = process.env.REACT_APP_ENV === "production" || (
  <p className="qa-links">
    <br />
    <Button
      onClick={async () => {
        await fetch(`/login/token`, {
          method: "POST",
          headers: {
            Authorization: "Bearer reviewer",
          },
        });
        window.location.href = "/";
      }}
      label="Demo Login As Reviewer"
      addClass="usa-button"
    />
    <br />
    <br />
    <Button
      onClick={async () => {
        await fetch(`/login/token`, {
          method: "POST",
          headers: {
            Authorization: "Bearer evaluator_one",
          },
        });
        window.location.href = "/";
      }}
      label="Demo Login As SME One"
      addClass="usa-button"
    />
    <br />
    <br />
    <Button
      onClick={async () => {
        await fetch(`/login/token`, {
          method: "POST",
          headers: {
            Authorization: "Bearer evaluator_two",
          },
        });
        window.location.href = "/";
      }}
      label="Demo Login As SME Two"
      addClass="usa-button"
    />
    <br />
    <br />
    <Button
      onClick={async () => {
        await fetch(`/login/token`, {
          method: "POST",
          headers: {
            Authorization: "Bearer evaluator_three",
          },
        });
        window.location.href = "/";
      }}
      label="Demo Login As SME Three"
      addClass="usa-button"
    />
    <br />
    <br />
    <Button
      onClick={async () => {
        await fetch(`/login/token`, {
          method: "POST",
          headers: {
            Authorization: "Bearer evaluator_four",
          },
        });
        window.location.href = "/";
      }}
      label="Demo Login As SME Four"
      addClass="usa-button"
    />
  </p>
);

class LoginPage extends React.Component {
  render() {
    return (
      <main>
        <div className="grid-container">
          <section className="smeqa-login-section">
            <div className="grid-row smeqa-login-row">
              <div className="grid-col-7 smeqa-login-content">
                <h1 className="smeqa-login">Collaborate on Resume Reviews</h1>
                <p className="smeqa-login-intro">
                  Subject Matter Experts and Human Resource Specialists can work
                  together on resume review for hiring actions. SMEs can use
                  this tool to review resumes against the qualifications
                  required for the specified position. HR can review written
                  justification statements. If you have any trouble using this
                  website, please contact{" "}
                  <a href="mailto:william.l.slack@omb.eop.gov">Will Slack</a>.
                </p>
                <div className="grid-col-3 smeqa-login-button">
                  {LoginButton}
                </div>
                {/* <p>If you have multiple emails associated with your <a target="_blank" href="https://secure.login.gov/">Login.gov</a> account,
                  you may need to log out and log in using your ".gov" email address.
                </p> */}
                {DevButtons}
              </div>
              <div className="grid-col-4">
                <div className="circle">
                  <img
                    className="smeqa-login-img"
                    src="/img/login-inspect.png"
                    alt="Paper and magnifying glass icon"
                  ></img>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  }
}

export default LoginPage;
