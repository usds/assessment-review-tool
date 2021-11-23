import React from "react";

import { USER_ROLES } from "../../../../constants";
import HiringActionOverview from "./HiringActionOverview";

const HiringActionOverviewContainer = (props) => {
  let { userType, id, smeApplicantsRemaining } = props;
  smeApplicantsRemaining = 1;
  const reviewJustificationsLink =
    userType === USER_ROLES.HR ? `/hiring-action/hr/${id}/review` : null;
  const hrStatsLink =
    userType === USER_ROLES.HR ? `/hiring-action/metrics/${id}` : null;

  const assessmentsLink =
    userType === USER_ROLES.SME ? `/assessment/${id}/` : null;
  const remainingInQueue =
    userType === USER_ROLES.SME ? smeApplicantsRemaining : null;

  // const exportResultsButton = null;
  // userType === 1 ? (
  //   <Button
  //     onClick={() => handleExportResults(id)}
  //     outline
  //     label="Export hiring action to TAS"
  //     addClass="smeqa-rr-home-hiring-action__button"
  //   />
  // ) : null;
  return (
    <HiringActionOverview
      assessmentsLink={assessmentsLink}
      reviewJustificationsLink={reviewJustificationsLink}
      hrStatsLink={hrStatsLink}
      remainingInQueue={remainingInQueue}
      {...props}
    />
  );
};

export default HiringActionOverviewContainer;
