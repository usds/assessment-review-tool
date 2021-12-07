import React, { useState } from "react";
import PropTypes from "prop-types";

import Loading from "../../commonComponents/Loading";

import ValidReview from "../ReviewStatusTypes/ValidReview";
import InvalidReview from "../ReviewStatusTypes/InvalidReview";
import {
  editReview,
  HR_COMPETENCY_REVIEW_STATES,
  HR_EDITING_STATUS,
  FEEDBACK_EDITING_STATUS,
  putApplicantEvaluationReview,
  selectAssessmentReview,
  cancelEdit,
  toggleFeedbackNote,
  saveFeedbackNote,
  resetReview,
} from "../reviewSlice";
import { useSelector } from "react-redux";
import { dispatch } from "../../../store";
import AssessmentReview from "./AssessmentReview";
import ReviewFailure from "./ReviewFailure";

const { HR_APPROVED, WAITING_REVIEW } = HR_COMPETENCY_REVIEW_STATES;

const AssessmentReviewContainer = ({ applicantEvaluationId }) => {
  const assessment = useSelector(selectAssessmentReview(applicantEvaluationId));
  const {
    status,
    assessmentStatus,
    editingStatus,
    feedBackStatus,
    created_at: assessmentDate,
    evaluation_note: evaluationNote,
    applicant: applicantName,
    competency_name: competencyName,
    feedback,
    competencyEvaluations,
    evaluator_email: evaluator,
  } = assessment;
  // const AssessmentStatusIndicator =
  // assessmentStatus & EDITING
  //   ? null
  //   : assessmentStatus & HR_APPROVED
  //   ? ValidReview
  //   : assessmentStatus & HR_DENIED
  //   ? InvalidReview
  //   : null;
  const { evaluationFeedback, applicantFeedbackId } = feedback;

  const [localFeedbackNote, updateFeedbackNote] = useState(
    evaluationFeedback || ""
  );

  const isAssessmentValid = (assessmentStatus & HR_APPROVED) > 0;

  const AssessmentStatusIndicator =
    assessmentStatus & WAITING_REVIEW
      ? null
      : isAssessmentValid
      ? ValidReview
      : InvalidReview;

  const handleEditAssessmentReview =
    editingStatus & HR_EDITING_STATUS.SHOW_EDIT_BUTTON
      ? () => {
          dispatch(editReview(applicantEvaluationId));
        }
      : null;

  // const isNoteVisible =
  //   (assessmentStatus & HR_COMPETENCY_REVIEW_STATES.EDITING) > 1;

  const assessmentRequiresReview = (assessmentStatus & WAITING_REVIEW) > 0;
  const handleValidateAssessment = () => {
    dispatch(
      putApplicantEvaluationReview({ applicantEvaluationId, review: true })
    );
  };
  const handleInvalidateAssessment = () => {
    return dispatch(
      putApplicantEvaluationReview({ applicantEvaluationId, review: false })
    );
  };
  const handleCancelAssessmentReviewEdit =
    editingStatus & HR_EDITING_STATUS.EDITING
      ? () => {
          dispatch(cancelEdit(applicantEvaluationId));
        }
      : null;

  const handleToggleFeedback = () => {
    return dispatch(toggleFeedbackNote(applicantEvaluationId));
  };
  const handleSaveFeedback = () => {
    dispatch(
      saveFeedbackNote({
        applicantEvaluationId,
        feedbackNote: localFeedbackNote,
        applicantFeedbackId,
      })
    );
    dispatch(toggleFeedbackNote(applicantEvaluationId));
  };
  const isFeedbackNoteShowing =
    feedBackStatus & FEEDBACK_EDITING_STATUS.SHOW_FEEDBACK_TEXT;
  const isFeedbackButtonShowing =
    (feedBackStatus & FEEDBACK_EDITING_STATUS.SHOW_FEEDBACK_BUTTON) > 0;
  const handleUpdateLocalFeedbackNote = (e) =>
    updateFeedbackNote(e.target.value);

  if (status === "rejected") {
    const handleReset = () => {
      updateFeedbackNote(evaluationFeedback);
      dispatch(resetReview(applicantEvaluationId));
    };
    return (
      <ReviewFailure
        applicantName={applicantName}
        assessmentDate={assessmentDate}
        handleReset={handleReset}
      />
    );
  }
  return (
    <Loading isLoading={status === "pending"}>
      <AssessmentReview
        evaluator={evaluator}
        isAssessmentValid={isAssessmentValid}
        assessmentRequiresReview={assessmentRequiresReview}
        applicantName={applicantName}
        competencyName={competencyName}
        evaluationNote={evaluationNote}
        assessmentDate={assessmentDate}
        competencyEvaluations={competencyEvaluations}
        isFeedbackNoteShowing={isFeedbackNoteShowing}
        localFeedbackNote={localFeedbackNote}
        AssessmentStatusIndicator={AssessmentStatusIndicator}
        isFeedbackButtonShowing={isFeedbackButtonShowing}
        handleShowFeedback={handleToggleFeedback}
        handleSaveFeedback={handleSaveFeedback}
        handleUpdateLocalFeedbackNote={handleUpdateLocalFeedbackNote}
        handleEditAssessmentReview={handleEditAssessmentReview}
        handleCancelAssessmentReviewEdit={handleCancelAssessmentReviewEdit}
        handleValidateAssessment={handleValidateAssessment}
        handleInvalidateAssessment={handleInvalidateAssessment}
        key={applicantEvaluationId}
      />
    </Loading>
  );
};
AssessmentReviewContainer.propTypes = {
  competencyId: PropTypes.string,
};
export default AssessmentReviewContainer;
