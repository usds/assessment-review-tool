import React from "react";
import { Link } from "react-router-dom";

import Button from "../../../commonComponents/Button";
// import { PermissionContext } from "../PermissionContext";
import PropTypes from "prop-types";
import { hiringActionPropTypes } from "../../../propTypes";

class HiringActionOverview extends React.Component {
  static propTypes = {
    ...hiringActionPropTypes,
    handleExportResults: PropTypes.func,
    reviewJustificationsLink: PropTypes.string,
    assessmentsLink: PropTypes.string,
    hrStatsLink: PropTypes.string,
    remainingInQueue: PropTypes.number,
  };

  render() {
    const {
      assessment_name,
      position_name,
      department_name,
      component_name,
      locations,
      position_details,
      reviewJustificationsLink,
      hrStatsLink,
      remainingInQueue,
      assessmentsLink,
    } = this.props;

    const reviewJustificationsButton = reviewJustificationsLink ? (
      <Link
        to={reviewJustificationsLink}
        className="smeqa-rr-home-hiring-action__button-container"
      >
        <Button
          onClick={() => {}}
          type="submit"
          label="Continue Review"
          addClass="smeqa-rr-home-hiring-action__button"
        />
      </Link>
    ) : null;

    const assessmentLinkText =
      remainingInQueue > 0 ? "Continue Reviews" : "Reviews Complete 🎉";
    const continueResumeReviewButton =
      remainingInQueue === null ? null : (
        <Link
          to={assessmentsLink}
          className="smeqa-rr-home-hiring-action__button-container"
          style={!remainingInQueue ? { pointerEvents: "none" } : {}}
          onClick={(e) => {
            if (!remainingInQueue) {
              e.preventDefault();
            }
          }}
        >
          <Button
            onClick={() => {}}
            type="submit"
            disabled={!remainingInQueue}
            label={assessmentLinkText}
            addClass="smeqa-rr-home-hiring-action__button"
          />
        </Link>
      );

    const exportResultsButton = null;
    // userType === 1 ? (
    //   <Button
    //     onClick={() => handleExportResults(id)}
    //     outline
    //     label="Export hiring action to TAS"
    //     addClass="smeqa-rr-home-hiring-action__button"
    //   />
    // ) : null;
    const hrStatsLinkRef = hrStatsLink ? (
      <Link to={hrStatsLink}>
        <p className="smeqa-rr-home-hiring-action__metrics">View Metrics</p>
      </Link>
    ) : null;

    return (
      <div className="grid-row smeqa-rr-home-hiring-action__container">
        <div className="smeqa-rr-home-hiring-action">
          <div className="smeqa-rr-home-hiring-action__body">
            <div className="smeqa-rr-home-hiring-action__col">
              <h3 className="smeqa-rr-home-hiring-action__title">
                {position_name} - {assessment_name}
              </h3>
              <h4 className="smeqa-rr-home-hiring-action__agency">
                {department_name}
              </h4>
              <h5 className="smeqa-rr-home-hiring-action__component">
                {component_name}
              </h5>
              <h5 className="smeqa-rr-home-hiring-action__locations">
                {locations}
              </h5>
              <h5>{position_details}</h5>
            </div>
            <div className="smeqa-rr-home-hiring-action__col right">
              {continueResumeReviewButton}
              {reviewJustificationsButton}
              {exportResultsButton}
              {hrStatsLinkRef}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default HiringActionOverview;
