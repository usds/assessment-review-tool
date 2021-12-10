import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { withRouter } from "react-router-dom";

import {
  fetchNextAssessment,
  selectAssessmentsStatus,
  selectApplicantId,
  selectAssessmentsError,
} from "./assessmentSlice";

import Assessments from "./Assessment";
// import ResumeReview from "./ResumeReview";
import AssessmentsAlert from "./AssessmentsAlert";
import Loading from "../commonComponents/Loading";
import ResumeReviewWithJustifications from "./ResumeReviewWithJustifications";
import DSCWrittenAssessment from "./DSCWrittenAssessment";
// const RR = <div>ResumeReview</div>;
// const WrittenAssessments = <div>Written</div>;
/**
 * Eventually use to determine which assessment to load
 */
const AssessmentsContainer = (props) => {
  const dispatch = useDispatch();
  const { hiringActionId } = props.match.params;

  const assessmentStatus = useSelector(selectAssessmentsStatus);
  const applicantId = useSelector(selectApplicantId);
  // const error = useSelector(selectAssessmentsError);
  useEffect(() => {
    if (assessmentStatus === "idle") {
      dispatch(fetchNextAssessment(hiringActionId));
    }
  });
  let type = "success";
  let title = "You're done!";
  const body =
    useSelector(selectAssessmentsError) ||
    "You're done! There are no applicants remaining in your queue. Good job!";

  const isLoading =
    assessmentStatus === "pending" || assessmentStatus === "idle";
  if (assessmentStatus === "rejected") {
    type = "error";
    title = "Application Error";
  }
  return (
    <Assessments>
      <Loading isLoading={isLoading}>
        {isLoading ? null : applicantId ? (
          <DSCWrittenAssessment />
        ) : (
          <AssessmentsAlert title={title} type={type} body={body} />
        )}
      </Loading>
    </Assessments>
  );
  // switch (assessment && assessment.type)
};

export default withRouter(AssessmentsContainer);
