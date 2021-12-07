import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  sumbitAssessmentReview,
  submitFeedbackNote,
  requestHrDetails,
  submitApplicantNote,
  requestApplicantRelease,
} from "./reviewRequests";

export const HR_COMPETENCY_REVIEW_STATES = {
  HR_APPROVED: 1,
  HR_DENIED: 2,
  WAITING_REVIEW: 4,
  FLAGGED: 8,
  RELEASED: 16,
};
export const HR_EDITING_STATUS = {
  NONE: 0,
  SHOW_EDIT_BUTTON: 1,
  EDITING: 2,
};
export const FEEDBACK_EDITING_STATUS = {
  NONE: 0,
  SHOW_FEEDBACK_BUTTON: 1,
  SHOW_FEEDBACK_TEXT: 2,
};
export const ASSESSMENT_GROUPS = {
  PENDING: 1,
  INVALID: 2,
  VALID: 4,
  FLAGGED: 8,
};
export const loadHiringActionDetails = createAsyncThunk(
  "review/fetchapplicantEvaluations",
  async (assessmentHurdleId) => {
    const hrView = await requestHrDetails(assessmentHurdleId);

    const {
      applicantEvaluations,
      flaggedApplicants: flaggedApplicantsResults,
    } = hrView;

    for (const applicantEvalId in applicantEvaluations) {
      const applicantEval = applicantEvaluations[applicantEvalId];
      let assessmentStatus, editingStatus, feedBackStatus, assessmentGroup;
      const { approved } = applicantEval;
      switch (approved) {
        case true:
          assessmentStatus = HR_COMPETENCY_REVIEW_STATES.HR_APPROVED;
          editingStatus = HR_EDITING_STATUS.SHOW_EDIT_BUTTON;
          feedBackStatus = FEEDBACK_EDITING_STATUS.NONE;
          assessmentGroup = ASSESSMENT_GROUPS.VALID;
          break;
        case false:
          assessmentStatus = HR_COMPETENCY_REVIEW_STATES.HR_DENIED;
          editingStatus = HR_EDITING_STATUS.SHOW_EDIT_BUTTON;
          feedBackStatus = FEEDBACK_EDITING_STATUS.SHOW_FEEDBACK_BUTTON;
          assessmentGroup = ASSESSMENT_GROUPS.INVALID;

          break;
        default:
          assessmentStatus = HR_COMPETENCY_REVIEW_STATES.WAITING_REVIEW;
          editingStatus = HR_EDITING_STATUS.NONE;
          feedBackStatus = FEEDBACK_EDITING_STATUS.NONE;
          assessmentGroup = ASSESSMENT_GROUPS.PENDING;
          break;
      }

      applicantEval.assessmentStatus = assessmentStatus;
      applicantEval.editingStatus = editingStatus;
      applicantEval.feedBackStatus = feedBackStatus;
      applicantEval.assessmentGroup = assessmentGroup;
      applicantEval.status = "default";
      applicantEval.id = applicantEval.applicantEvaluationKey;
      applicantEval.applicant = applicantEval.applicantName;
    }

    const flaggedApplicants = flaggedApplicantsResults.reduce(
      (memo, applicant) => {
        const flaggedApplicant = {
          assessmentStatus: HR_COMPETENCY_REVIEW_STATES.FLAGGED,
          editingStatus: HR_EDITING_STATUS.NONE,
          feedBackStatus: FEEDBACK_EDITING_STATUS.NONE,
          assessmentGroup: ASSESSMENT_GROUPS.FLAGGED,
          status: "default",
          applicantName: applicant.name,
          applicantId: applicant.id,
          applicantNote: applicant.additional_note,
          flagMessage: applicant.flag_message,
          type: applicant.flag_type,
          flagDate: applicant.updated_at,
        };
        memo[applicant.id] = flaggedApplicant;
        return memo;
      },
      {}
    );
    return {
      assessmentHurdleId,
      applicantEvaluations,
      flaggedApplicants,
    };
  }
);
export const putApplicantEvaluationReview = createAsyncThunk(
  "review/putApplicantEvaluationReview",
  async ({ applicantEvaluationId, review }, thunkAPI) => {
    const state = thunkAPI.getState();
    const { hiringActionId } = state.review;
    const applicationEvaluationIds =
      state.review.applicantEvaluations[applicantEvaluationId].applicationIds;
    await sumbitAssessmentReview(
      hiringActionId,
      applicationEvaluationIds,
      review
    );
    return { review, applicantEvaluationId };
  }
);
export const saveFeedbackNote = createAsyncThunk(
  "review/saveFeedbackNote",
  async (
    { applicantEvaluationId, feedbackNote, applicantFeedbackId },
    thunkAPI
  ) => {
    const state = thunkAPI.getState();
    const { hiringActionId } = state.review;
    const { applicationIds, evaluator, applicantId } =
      state.review.applicantEvaluations[applicantEvaluationId];
    const review = false;
    await submitFeedbackNote(
      hiringActionId,
      { applicationIds, evaluator, applicantId, applicantFeedbackId },
      feedbackNote
    );
    await sumbitAssessmentReview(hiringActionId, applicationIds, review);

    return { applicantEvaluationId, feedbackNote, review };
  }
);

export const saveApplicantNote = createAsyncThunk(
  "review/saveApplicantNote",
  async ({ applicantId, feedbackNote }, thunkAPI) => {
    const state = thunkAPI.getState();
    const { hiringActionId } = state.review;
    await submitApplicantNote(hiringActionId, applicantId, feedbackNote);
    return { applicantId, feedbackNote };
  }
);
export const releaseApplicant = createAsyncThunk(
  "review/releaseApplicant",
  async ({ applicantId }, thunkAPI) => {
    const state = thunkAPI.getState();
    const { hiringActionId } = state.review;
    await requestApplicantRelease(hiringActionId, applicantId);
    return { applicantId };
  }
);
// export const putCompetencyReview()
export const review = createSlice({
  name: "review",
  initialState: {
    status: "idle",
    error: "",
    applicantEvaluations: {},
    hiringActionId: null,
    flaggedApplicants: {},
  },
  reducers: {
    editReview: (state, { payload }) => {
      state.applicantEvaluations[payload].editingStatus =
        HR_EDITING_STATUS.EDITING;
    },
    cancelEdit: (state, { payload }) => {
      state.applicantEvaluations[payload].editingStatus =
        HR_EDITING_STATUS.SHOW_EDIT_BUTTON;
    },
    toggleFeedbackNote: (state, { payload }) => {
      if (payload in state.applicantEvaluations) {
        state.applicantEvaluations[payload].feedBackStatus ^=
          FEEDBACK_EDITING_STATUS.SHOW_FEEDBACK_TEXT;
        state.applicantEvaluations[payload].feedBackStatus ^=
          FEEDBACK_EDITING_STATUS.SHOW_FEEDBACK_BUTTON;
        return;
      }
      if (payload in state.flaggedApplicants) {
        state.flaggedApplicants[payload].feedBackStatus ^=
          FEEDBACK_EDITING_STATUS.SHOW_FEEDBACK_TEXT;
        state.flaggedApplicants[payload].feedBackStatus ^=
          FEEDBACK_EDITING_STATUS.SHOW_FEEDBACK_BUTTON;
        return;
      }
      throw new Error("Missing valid ID");
    },
    resetReview: (state, { payload }) => {
      if (payload in state.applicantEvaluations) {
        state.applicantEvaluations[payload].status = "default";
        return;
      }
      if (payload in state.flaggedApplicants) {
        state.flaggedApplicants[payload].status = "default";
        return;
      }
      throw new Error("ID invalid for reset");
    },
  },
  extraReducers: {
    /** PENDING */
    [loadHiringActionDetails.pending]: (state, action) => {
      state.status = "pending";
      state.error = "";
    },
    [putApplicantEvaluationReview.pending]: (state, action) => {
      const { applicantEvaluationId } = action.meta.arg;
      state.applicantEvaluations[applicantEvaluationId].status = "pending";
      state.applicantEvaluations[applicantEvaluationId].error = "";
    },
    [saveFeedbackNote.pending]: (state, action) => {
      const { applicantEvaluationId } = action.meta.arg;
      state.applicantEvaluations[applicantEvaluationId].status = "pending";
      state.applicantEvaluations[applicantEvaluationId].error = "";
    },
    [saveApplicantNote.pending]: (state, action) => {
      const { applicantId } = action.meta.arg;
      state.flaggedApplicants[applicantId].status = "pending";
      state.flaggedApplicants[applicantId].error = "";
    },
    [releaseApplicant.pending]: (state, action) => {
      const { applicantId } = action.meta.arg;
      state.flaggedApplicants[applicantId].status = "pending";
      state.flaggedApplicants[applicantId].error = "";
    },
    /** REJECTED */
    [loadHiringActionDetails.rejected]: (state, action) => {
      state.status = "rejected";
      state.error = action.error.message;
    },
    [putApplicantEvaluationReview.rejected]: (state, action) => {
      const { applicantEvaluationId } = action.meta.arg;
      state.applicantEvaluations[applicantEvaluationId].status = "rejected";
      state.applicantEvaluations[applicantEvaluationId].error =
        action.error.message;
    },
    [saveFeedbackNote.rejected]: (state, action) => {
      const { applicantEvaluationId } = action.meta.arg;
      state.applicantEvaluations[applicantEvaluationId].status = "rejected";
      state.applicantEvaluations[applicantEvaluationId].error =
        action.error.message;
    },
    [saveApplicantNote.rejected]: (state, action) => {
      const { applicantId } = action.meta.arg;
      state.flaggedApplicants[applicantId].status = "rejected";
      state.flaggedApplicants[applicantId].error = "";
    },
    [releaseApplicant.rejected]: (state, action) => {
      const { applicantId } = action.meta.arg;
      state.flaggedApplicants[applicantId].status = "rejected";
      state.flaggedApplicants[applicantId].error = "";
    },
    // fulfilled
    [loadHiringActionDetails.fulfilled]: (state, { payload }) => {
      state.status = "fulfilled";
      state.error = "";
      const { assessmentHurdleId, applicantEvaluations, flaggedApplicants } =
        payload;
      state.applicantEvaluations = applicantEvaluations;
      state.flaggedApplicants = flaggedApplicants;
      state.hiringActionId = assessmentHurdleId;
    },
    [putApplicantEvaluationReview.fulfilled]: (state, { payload }) => {
      const { applicantEvaluationId, review } = payload;

      let assessmentStatus, editingStatus, feedBackStatus;
      switch (review) {
        case true:
          assessmentStatus = HR_COMPETENCY_REVIEW_STATES.HR_APPROVED;
          editingStatus = HR_EDITING_STATUS.SHOW_EDIT_BUTTON;
          feedBackStatus = FEEDBACK_EDITING_STATUS.NONE;
          break;
        case false:
          assessmentStatus = HR_COMPETENCY_REVIEW_STATES.HR_DENIED;
          editingStatus = HR_EDITING_STATUS.SHOW_EDIT_BUTTON;
          feedBackStatus = FEEDBACK_EDITING_STATUS.SHOW_FEEDBACK_BUTTON;
          break;
        default:
          break;
      }

      state.applicantEvaluations[applicantEvaluationId].status = "fulfilled";
      state.applicantEvaluations[applicantEvaluationId].error = "";
      state.applicantEvaluations[applicantEvaluationId].editingStatus =
        editingStatus;
      state.applicantEvaluations[applicantEvaluationId].assessmentStatus =
        assessmentStatus;
      state.applicantEvaluations[applicantEvaluationId].feedBackStatus =
        feedBackStatus;
    },
    [saveFeedbackNote.fulfilled]: (state, { payload }) => {
      const { applicantEvaluationId, feedbackNote } = payload;

      state.applicantEvaluations[applicantEvaluationId].status = "fulfilled";
      state.applicantEvaluations[applicantEvaluationId].error = "";

      state.applicantEvaluations[
        applicantEvaluationId
      ].feedback.evaluationFeedback = feedbackNote;
      state.applicantEvaluations[applicantEvaluationId].feedBackStatus =
        FEEDBACK_EDITING_STATUS.SHOW_FEEDBACK_BUTTON;
      state.applicantEvaluations[applicantEvaluationId].assessmentStatus =
        HR_COMPETENCY_REVIEW_STATES.HR_DENIED;
      state.applicantEvaluations[applicantEvaluationId].editingStatus =
        HR_EDITING_STATUS.NONE;
    },
    [saveApplicantNote.fulfilled]: (state, { payload }) => {
      const { applicantId, feedbackNote } = payload;
      state.flaggedApplicants[applicantId].status = "fulfilled";
      state.flaggedApplicants[applicantId].error = "";
      state.flaggedApplicants[applicantId].applicantNote = feedbackNote;
      state.flaggedApplicants[applicantId].feedBackStatus =
        FEEDBACK_EDITING_STATUS.SHOW_FEEDBACK_BUTTON;
    },
    [releaseApplicant.fulfilled]: (state, { payload }) => {
      const { applicantId } = payload;
      state.flaggedApplicants[applicantId].status = "fulfilled";
      state.flaggedApplicants[applicantId].error = "";
      state.flaggedApplicants[applicantId].assessmentStatus =
        HR_COMPETENCY_REVIEW_STATES.RELEASED;
    },
  },
});
export const { editReview, cancelEdit, toggleFeedbackNote, resetReview } =
  review.actions;

export default review.reducer;

/**
 * SELECTORS
 */

// Simple details
export const selectReviewStatus = (state) => {
  return state.review.status;
};
export const selectReviews = (state) => {
  return Object.values(state.review.applicantEvaluations).sort((a, b) =>
    a.applicantName.localeCompare(b)
  );
};
export const selectPendingReviews = (state) => {
  return selectReviews(state)
    .filter((c) => c.assessmentGroup & ASSESSMENT_GROUPS.PENDING)
    .filter((c) => c);
};
export const selectApprovedReviews = (state) => {
  return selectReviews(state)
    .filter((c) => c.assessmentGroup & ASSESSMENT_GROUPS.VALID)
    .filter((c) => c);
};
export const selectDeniedReviews = (state) => {
  return selectReviews(state)
    .filter((c) => c.assessmentGroup & ASSESSMENT_GROUPS.INVALID)
    .filter((c) => c);
};

export const selectFlaggedReviews = (state) => {
  return Object.values(state.review.flaggedApplicants).filter(
    (c) => c && c.assessmentGroup & ASSESSMENT_GROUPS.FLAGGED
  );
};
export const selectFlaggedReview = (id) => (state) => {
  return state.review.flaggedApplicants[id];
};
export const selectAssessmentReview = (id) => (state) => {
  return state.review.applicantEvaluations[id];
};
