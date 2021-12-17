import React, { useEffect } from "react";

// import { ErrorContext } from "../Error/ErrorContext";
import { useDispatch, useSelector } from "react-redux";
import {
  loadHiringActionDetails,
  selectPendingReviews,
  selectReviewStatus,
  selectApprovedReviews,
  selectDeniedReviews,
  selectFlaggedReviews,
  selectCurrentHiringActionId,
} from "./reviewSlice";
import { selectHiringActionDetails } from "../HiringActions/hiringActionSlice";
import { withRouter } from "react-router-dom";
import Review from "./Review";
import AssessmentReview from "./AssessmentReview";
import FlaggedApplicant from "./FlaggedApplicant";

/*
This wraps all HR Review functionality, including:
- reviewing "Does Not Meet" justifications
- reviewing SME progress/results
- reviewing applicant's progress/results
*/
//   saveHrNoteToSme = (competencyReviewId, noteToSme) => {
//     const { hiringActionId } = this.props.match.params;
//     try {
//       saveHrNoteToSme(hiringActionId, competencyReviewId, noteToSme);
//     } catch (err) {
//       this.context.setError(err);
//     }
//   };

//   exportResults = async () => {
//     const { hiringActionId } = this.props.match.params;
//     try {
//       exportResults(hiringActionId);
//     } catch (err) {
//       this.context.setError(err);
//     }
//   };

//   render() {
//     const { hiringActionId } = this.props.match.params;

//     return (
//       <HrReview
//         hiringAction={{
//           departmentName: this.state.departmentName,
//           positionName: this.state.positionName,
//           level: this.state.level,
//           id: hiringActionId,
//           // progress: this.state.progress
//         }}
//         competencyReviews={this.state.didNotMeetCompetencyReviews}
//         handleSubmitHrReview={this.submitHrReview}
//         handleExportResults={this.exportResults}
//         handleSaveHrNoteToSme={this.saveHrNoteToSme}
//       />
//     );
//   }
// }
const ReviewContainer = (props) => {
  const dispatch = useDispatch();
  const { hiringActionId } = props.match.params;
  const reviewStatus = useSelector(selectReviewStatus);
  const currentLoadedHiringAction = useSelector(selectCurrentHiringActionId);
  const hrStatsLink = `/hiring-action/metrics/${hiringActionId}`;
  const downloadUSASLink = `/api/assessment-hurdle/export/${hiringActionId}/resultsusas`;

  const downloadAuditLink = `/api/assessment-hurdle/export/${hiringActionId}/audit`;

  const hiringActionInfo =
    useSelector(selectHiringActionDetails(hiringActionId)) || {};

  //     assessment_name
  // position_name
  // department_name
  // component_name
  // position_details
  const {
    department_name: departmentName,
    position_name: positionName,
    position_details: level,
  } = hiringActionInfo;
  // const competenciesForReview = useSelector(selectCompetenciesForReview);
  useEffect(() => {
    if (
      reviewStatus === "idle" ||
      hiringActionId !== currentLoadedHiringAction
    ) {
      dispatch(loadHiringActionDetails(hiringActionId));
    }
  });

  const flaggedReviews = useSelector(selectFlaggedReviews).map((applicant) => {
    return (
      <FlaggedApplicant
        key={applicant.applicantId}
        applicantId={applicant.applicantId}
      ></FlaggedApplicant>
    );
  });
  const pendingReviews = useSelector(selectPendingReviews).map((review) => {
    return (
      <AssessmentReview
        key={review.id}
        applicantEvaluationId={review.id}
      ></AssessmentReview>
    );
  });
  const validReviews = useSelector(selectApprovedReviews).map((review) => {
    return (
      <AssessmentReview
        key={review.id}
        applicantEvaluationId={review.id}
      ></AssessmentReview>
    );
  });
  const invalidReviews = useSelector(selectDeniedReviews).map((review) => {
    return (
      <AssessmentReview
        key={review.id}
        applicantEvaluationId={review.id}
      ></AssessmentReview>
    );
  });

  return (
    <Review
      departmentName={departmentName}
      positionName={positionName}
      level={level}
      hiringActionId={hiringActionId}
      pendingReviews={pendingReviews}
      validReviews={validReviews}
      invalidReviews={invalidReviews}
      hrStatsLink={hrStatsLink}
      flaggedReviews={flaggedReviews}
      downloadUSASLink={downloadUSASLink}
      downloadAuditLink={downloadAuditLink}
    />
  );
};

export default withRouter(ReviewContainer);
