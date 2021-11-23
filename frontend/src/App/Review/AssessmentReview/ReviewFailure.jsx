import React from "react";

import Button from "../../commonComponents/Button";
import Alert from "../../commonComponents/Alert";

const ReviewFailure = ({ applicantName, assessmentDate, handleReset }) => {
  const FailureButtons = (
    <>
      <div className="display-flex flex-column flex-align-center">
        <Button
          onClick={handleReset}
          label="Reset"
          outline={false}
          addClass="smeqa-rr-hiring-action-justification__button"
        />
      </div>
    </>
  );

  return (
    <div className="smeqa-rr-hiring-action-justification shadow-2 radius-lg">
      <div className="smeqa-rr-hiring-action-justification__body">
        <div className="smeqa-rr-hiring-action-justification__top-row">
          <div className="smeqa-rr-hiring-action-justification__top-row-item">
            <h5 className="smeqa-rr-hiring-action-justification__top-row-title">
              Applicant
            </h5>
            <p className="smeqa-rr-hiring-action-justification__top-row-value">
              {applicantName}
            </p>
          </div>
          <div className="smeqa-rr-hiring-action-justification__top-row-item">
            <h5 className="smeqa-rr-hiring-action-justification__top-row-title">
              Evaluation Date
            </h5>
            <p className="smeqa-rr-hiring-action-justification__top-row-value">
              {assessmentDate}
            </p>
          </div>
        </div>
        <Alert
          type="error"
          title="Error in request"
          body="There was an error, please try again or flag this applicant to remove from the system"
        >
          {FailureButtons}
        </Alert>
      </div>
    </div>
  );
};

export default ReviewFailure;
