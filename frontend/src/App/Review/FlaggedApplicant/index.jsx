import React, { useState } from "react";
import PropTypes from "prop-types";

import Loading from "../../commonComponents/Loading";

import {
  FEEDBACK_EDITING_STATUS,
  HR_COMPETENCY_REVIEW_STATES,
  toggleFeedbackNote,
  resetReview,
  selectFlaggedReview,
  saveApplicantNote,
  releaseApplicant,
} from "../reviewSlice";
import { useSelector } from "react-redux";
import { dispatch } from "../../../store";
import FlaggedApplicant from "./FlaggedEvaluation";
import ReviewFailure from "./ReviewFailure";
import ReleasedReview from "../ReviewStatusTypes/ReleasedReview";

const FlaggedApplicantContainer = ({ applicantId }) => {
  const assessment = useSelector(selectFlaggedReview(applicantId));
  const {
    assessmentStatus,
    // editingStatus,
    feedBackStatus,
    status,
    applicantName,
    applicantNote,
    flagMessage,
    // type,
    flagDate,
  } = assessment;

  const [localFeedbackNote, updateFeedbackNote] = useState(applicantNote || "");

  const handleEditExplanationButton = () => {
    dispatch(toggleFeedbackNote(applicantId));
  };
  const handleReleaseFromFlag = () => {
    updateFeedbackNote(applicantNote);
    dispatch(releaseApplicant({ applicantId }));
  };
  const handleSaveFeedback = () => {
    dispatch(
      saveApplicantNote({
        applicantId,
        feedbackNote: localFeedbackNote,
      })
    );
    dispatch(toggleFeedbackNote(applicantId));
  };
  const isFeedbackNoteShowing =
    feedBackStatus & FEEDBACK_EDITING_STATUS.SHOW_FEEDBACK_TEXT;

  const isFeedbackButtonShowing =
    (feedBackStatus & FEEDBACK_EDITING_STATUS.SHOW_FEEDBACK_BUTTON) > 0;
  const handleUpdateLocalFeedbackNote = (e) =>
    updateFeedbackNote(e.target.value);

  const released =
    (assessmentStatus & HR_COMPETENCY_REVIEW_STATES.RELEASED) > 0;
  const ApplicantStatusIndicator =
    assessmentStatus & HR_COMPETENCY_REVIEW_STATES.RELEASED
      ? ReleasedReview
      : null;
  if (status === "rejected") {
    const handleReset = () => {
      updateFeedbackNote(applicantNote);
      dispatch(resetReview(applicantId));
    };
    return (
      <ReviewFailure
        applicantName={applicantName}
        assessmentDate={flagDate}
        handleReset={handleReset}
      />
    );
  }
  return (
    <Loading isLoading={status === "pending"}>
      <FlaggedApplicant
        applicantName={applicantName}
        flagDate={flagDate}
        flagMessage={flagMessage}
        handleReleaseFromFlag={handleReleaseFromFlag}
        handleEditExplanationButton={handleEditExplanationButton}
        isFeedbackNoteShowing={isFeedbackNoteShowing}
        localFeedbackNote={localFeedbackNote}
        handleUpdateLocalFeedbackNote={handleUpdateLocalFeedbackNote}
        handleSaveFeedback={handleSaveFeedback}
        isFeedbackButtonShowing={isFeedbackButtonShowing}
        ApplicantStatusIndicator={ApplicantStatusIndicator}
        released={released}
        key={applicantId}
      />
    </Loading>
  );
};
FlaggedApplicantContainer.propTypes = {
  competencyId: PropTypes.string,
};
export default FlaggedApplicantContainer;
