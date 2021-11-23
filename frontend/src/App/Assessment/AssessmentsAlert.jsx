import React from "react";
import Alert from "../commonComponents/Alert";

const AssessmentsAlert = ({ type, title, body }) => {
  return (
    <main
      id="main-content"
      role="main"
      className="usa-layout-docs smeqa-rr__main smeqa-rr-home__main"
    >
      <div className="grid-container">
        <Alert type={type} title={title} body={body}>
          <a href="/">Exit review</a>
        </Alert>
      </div>
    </main>
  );
};

export default AssessmentsAlert;
