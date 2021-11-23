import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { COMPETENCY_TYPES } from "../../constants";

import {
  getSmeProgress,
  recuseFromReview,
  requestNextApplication,
  flagForHr,
  submitApplicationReview,
  requestApplicationDisplay,
} from "./assessmentRequests";

export const NEW_APPLICATION = "NEW_APPLICATION";
export const RECUSE_APPLICATION = "RECUSE_APPLICATION";
export const FLAG_APPLICATION = "FLAG_APPLICATION";
export const SUBMIT_APPLICATION = "SUBMIT_APPLICATION";

export const SET_HIRING_ACITONS = "SET_HIRING_ACITONS";

export const UPDATE_COMPETENCY_DECISION = "UPDATE_COMPETENCY_DECISION";
export const UPDATE_COMPETENCY_REASON = "UPDATE_COMPETENCY_REASON";
export const UPDATE_COMPETENCY_JUSTIFICATION =
  "UPDATE_COMPETENCY_JUSTIFICATION";
/**
 * };

export const NO_EVIDENCE = "noEvidence";
export const DOES_NOT_MEET_REQUIRED_LEVEL = "doesNotMeetRequiredLevel";

export const DOES_NOT_MEET_REASONS_TEXT = {
  [NO_EVIDENCE]: "No evidence of this competency",
  [DOES_NOT_MEET_REQUIRED_LEVEL]: "Doesn't meet the required proficiency level",
};

 */
export const RESET_COMPETENCY = "RESET_COMPETENCY";

export const fetchNextAssessment = createAsyncThunk(
  "assessment/fetchNextAssessment",
  async (assessmentHurdleId) => {
    const applicantId = await requestNextApplication(assessmentHurdleId);
    if (!applicantId) {
      return null;
    }
    const assessment = await requestApplicationDisplay(
      assessmentHurdleId,
      applicantId
    );

    const smeProgressPromise = getSmeProgress(assessmentHurdleId);

    const {
      applicant,
      // applicationEvaluations,
      applicantNotes,
      // specialties,
      competencies,
      competencyJustifications,
      competencyEvaluations,
      specialtyCompetencyMap,
      feedback,
      feedbackTimestamp,
      isTieBreaker,
    } = assessment;

    const { name: applicantName, additional_note: applicantNote } = applicant;

    let applicantEvaluationNote = "";

    // if (applicationEvaluations && applicationEvaluations.length) {
    //   applicationEvaluations.forEach((ae) => {
    //     const { evaluation_note } = ae;

    //     applicantEvaluationNote = evaluation_note || "";
    //   });
    // }
    const compJustificationDict = competencyJustifications.reduce(
      (memo, cj) => {
        const { competency_id } = cj;
        if (memo[competency_id]) {
          memo[competency_id].push(cj);
        } else {
          memo[competency_id] = [cj];
        }
        return memo;
      },
      {}
    );

    const competencySelectors = {};
    const competenciesById = competencies.reduce((memo, competency) => {
      competency.selectors.forEach((s) => {
        competencySelectors[s.id] = s.point_value;
      });
      const competencyId = competency["id"];
      const competencyEvaluation = competencyEvaluations[competencyId];
      let evaluation_note = "";
      let competency_selector_id = null;

      if (competencyEvaluation) {
        evaluation_note = competencyEvaluation.evaluation_note;
        competency_selector_id = competencyEvaluation.competency_selector_id;
      }
      memo[competencyId] = {
        name: competency["name"],
        id: competencyId,
        competencyType: competency["display_type"],
        screenOut: competency["screen_out"],
        definition: competency["definition"],
        requiredProficiencyDefinition:
          competency["required_proficiency_definition"],
        selectors: competency["selectors"],
        evaluation: { evaluation_note, competency_selector_id },
        sortOrder: competency["sort_order"],
        justifications: compJustificationDict[competencyId] || [],
      };

      return memo;
    }, {});

    const smeProgress = await smeProgressPromise;
    let applicantFeedback = [];
    if (applicantNote) {
      applicantFeedback.push(applicantNote);
    }
    let hasApplicantFeedback = false;
    if (feedback) {
      applicantFeedback.push(feedback);
      hasApplicantFeedback = true;
    }

    return {
      applicantId,
      applicantName,
      applicantEvaluationNote,
      competenciesById,
      assessmentHurdleId,
      smeProgress,
      feedbackTimestamp,
      applicantFeedback: applicantFeedback.join("\n\n"),
      specialtyCompetencyMap,
      competencySelectors,
      hasApplicantFeedback,
      applicantNotes,
      isTieBreaker,
    };
  }
);
export const putRecusalFromReview = createAsyncThunk(
  "assessment/putRecusalFromReview",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const { assessmentHurdleId } = state.assessment.meta;
    const { applicantId } = state.assessment;
    await recuseFromReview(assessmentHurdleId, applicantId);
    window.scrollTo(0, 0);
    return true;
  }
);
export const putFlaggedReview = createAsyncThunk(
  "assessment/putFlaggedReview",
  async (flagReason, thunkAPI) => {
    const state = thunkAPI.getState();
    const { assessmentHurdleId } = state.assessment.meta;
    const { applicantId } = state.assessment;
    if (flagReason.length <= 5) {
      throw new Error("Must submit flag with reason.");
    }
    await flagForHr(assessmentHurdleId, applicantId, flagReason);
    window.scrollTo(0, 0);
    return true;
  }
);
export const postReviewSubmission = createAsyncThunk(
  "assessment/postReviewSubmission",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();

    const { assessmentHurdleId } = state.assessment.meta;
    const { isTieBreaker } = state.assessment;
    const { applicantId, competenciesById, applicantEvaluationNote } =
      state.assessment;
    const reviews = Object.values(competenciesById)
      .map((c) => {
        const { id, evaluation } = c;
        const { evaluation_note, competency_selector_id } = evaluation;
        if (!evaluation.competency_selector_id) {
          return null;
        }
        return {
          competencyId: id,
          selectorId: competency_selector_id,
          note: evaluation_note,
        };
      })
      .filter((r) => r);

    await submitApplicationReview(
      assessmentHurdleId,
      applicantId,
      reviews,
      applicantEvaluationNote,
      isTieBreaker
    );
    window.scrollTo(0, 0);

    return true;
  }
);

export const assessment = createSlice({
  name: "assessment",
  initialState: {
    status: "idle",
    error: "",
    formState: "default",
    defaultFormState: "default",
    applicantId: null,
    applicantEvaluationNote: "",
    meta: {
      assessmentHurdleId: null,
      smeProgress: {},
      applicantName: null,
    },
    applicantFeedback: "",
    competenciesById: {},
    specialtyCompetencyMap: {},
    competencySelectors: {},
  },
  reducers: {
    updateCompetencyDecision: (state, { payload }) => {
      const { id, selectorId } = payload;
      // evaluation_note
      // competency_selector_id
      state.competenciesById[id].evaluation.competency_selector_id = selectorId;
    },

    updateCompetencyEvaluationNote: (state, { payload }) => {
      const { id, note } = payload;
      state.competenciesById[id].evaluation.evaluation_note = note;
    },
    // updateCompetencySavedNote: (state, { payload }) => {
    //   const { id, note } = payload;
    //   state.competenciesById[id].evaluation.savedNote = note;
    // },
    cancelCompetencyReview: (state, { payload }) => {
      const { id } = payload;
      state.competenciesById[id].evaluation.competency_selector_id = null;
      state.competenciesById[id].evaluation.evaluation_note = "";
    },
    updateAssessmentEvaluationNote: (state, { payload }) => {
      const note = payload;
      state.applicantEvaluationNote = note;
    },
    flagApplicant: (state) => {
      state.formState = "flagged";
    },
    cancelFlag: (state) => {
      state.formState = state.defaultFormState;
    },
  },
  extraReducers: {
    //Pending
    [putRecusalFromReview.pending]: (state, action) => {
      state.status = "pending";
      state.error = "";
      state.formState = "default";
    },
    [putFlaggedReview.pending]: (state, action) => {
      state.status = "pending";
      state.error = "";
      state.formState = "default";
    },
    [fetchNextAssessment.pending]: (state, action) => {
      state.status = "pending";
      state.error = "";
      state.formState = "default";
    },
    [postReviewSubmission.pending]: (state, action) => {
      state.status = "pending";
      state.error = "";
      state.formState = "default";
    },
    // rejected
    [putRecusalFromReview.rejected]: (state, action) => {
      state.status = "rejected";
      state.error = action.error.message;
      state.formState = "error";
    },
    [putFlaggedReview.rejected]: (state, action) => {
      if (action.error.message === "Must submit flag with reason.") {
        state.formState = "flagMessageNeeded";
        state.status = "fulfilled";
      } else {
        state.status = "rejected";
        state.error = action.error.message;
        state.formState = "error";
      }
    },
    [fetchNextAssessment.rejected]: (state, action) => {
      state.status = "rejected";
      state.error = action.error.message;
      state.formState = "error";
    },
    [postReviewSubmission.rejected]: (state, action) => {
      state.status = "rejected";
      state.error = action.error.message;
      state.formState = "error";
    },
    // fulfilled
    [putRecusalFromReview.fulfilled]: (state, action) => {
      state.status = "fulfilled";
      state.error = "";
      state.formState = "recused";
    },
    [putFlaggedReview.fulfilled]: (state, action) => {
      state.status = "fulfilled";
      state.error = "";
      state.formState = "flagSuccess";
    },
    [postReviewSubmission.fulfilled]: (state) => {
      state.status = "fulfilled";
      state.error = "";
      state.formState = "success";
    },
    [fetchNextAssessment.fulfilled]: (state, { payload }) => {
      state.status = "fulfilled";
      state.error = "";
      if (!payload) {
        state.applicantId = null;
        return;
      }
      const {
        assessmentHurdleId,
        smeProgress,
        applicantName,
        applicantId,
        competenciesById,
        applicantFeedback,
        specialtyCompetencyMap,
        competencySelectors,
        hasApplicantFeedback,
        applicantNotes,
        isTieBreaker,
      } = payload;

      if (applicantFeedback) {
        if (hasApplicantFeedback) {
          state.defaultFormState = "re-evaluate";
          state.formState = "re-evaluate";
        } else {
          state.defaultFormState = "note";
          state.formState = "note";
        }
      } else {
        state.formState = "default";
      }

      state.meta.assessmentHurdleId = assessmentHurdleId;
      state.meta.smeProgress = smeProgress;
      state.meta.applicantName = applicantName;

      state.competenciesById = competenciesById;
      state.applicantId = applicantId;
      state.specialtyCompetencyMap = specialtyCompetencyMap;
      state.applicantFeedback = applicantFeedback;
      state.isTieBreaker = isTieBreaker;
      state.competencySelectors = competencySelectors;
      state.applicantNotes = applicantNotes;
    },
  },
});
export const {
  updateCompetencyDecision,
  updateCompetencyEvaluationNote,
  updateAssessmentEvaluationNote,
  cancelCompetencyReview,
  flagApplicant,
  cancelFlag,
  // updateCompetencySavedNote,
} = assessment.actions;

export default assessment.reducer;

/**
 * SELECTORS
 */

// Simple details
export const selectApplicantId = (state) => state.assessment.applicantId;

// TODO
export const selectSMEProgress = (state) => state.assessment.meta.smeProgress;
export const selectTieBreaker = (state) => state.assessment.isTieBreaker;
export const selectFormState = (state) => state.assessment.formState;
export const selectApplicantNotes = (state) => state.assessment.applicantNotes;
export const selectApplicantFeedback = (state) =>
  state.assessment.applicantFeedback;
export const selectErrorMessage = (state) => state.assessment.error;
export const selectApplicantName = (state) =>
  state.assessment.meta.applicantName;

export const selectFormattedCompetencyName = (id) => (state) =>
  state.assessment.competenciesById[id].name.toLowerCase().replace(/\s/g, "-");

export const selectAssessmentsStatus = (state) => state.assessment.status;
export const selectAssessmentsError = (state) => state.assessment.error;

export const selectAssessmentEvaluationNote = (state) =>
  state.assessment.evalNote;
/**
 * Competency selectors
 */
export const selectCompetencies = (state) => {
  const competencies = Object.values(state.assessment.competenciesById).sort(
    (a, b) => {
      const { sortOrder: sa, id: ida } = a;
      const { sortOrder: sb, id: idb } = b;
      if (sa && sb) {
        return sa - sb;
      }
      return ida.localeCompare(idb);
    }
  );
  return competencies.reduce(
    (memo, c) => {
      switch (c.competencyType) {
        case COMPETENCY_TYPES.DEFAULT:
          memo[0].push(c);
          break;
        case COMPETENCY_TYPES.EXPERIENCE:
          memo[1].push(c);
          break;
        default:
          throw new Error(`Unexpected Competency Type of ${c.competencyType}`);
      }
      return memo;
    },
    [[], []]
  );
};

export const selectCompetencyDetails = (id) => (state) => {
  const {
    name,
    definition,
    requiredProficiencyDefinition,
    competencyType,
    screenOut,
    selectors,
    evaluation,
    justifications,
  } = state.assessment.competenciesById[id];
  return {
    name,
    definition,
    requiredProficiencyDefinition,
    screenOut,
    competencyType,
    selectors,
    evaluation,
    justifications,
  };
};
export const selectCompetencyResult = (id) => (state) => {
  const { competency_selector_id } =
    state.assessment.competenciesById[id] &&
    state.assessment.competenciesById[id].evaluation;

  if (competency_selector_id === "failing") {
    return 0;
  }
  const result = state.assessment.competencySelectors[competency_selector_id];
  return typeof result === "number" ? result : null;
};
export const selectSpecialtyResults = (state) => {
  const { competenciesById, specialtyCompetencyMap } = state.assessment;
  return Object.entries(specialtyCompetencyMap).reduce(
    (memo, [sid, compIds]) => {
      memo[sid] = compIds.reduce((memo, cid) => {
        if (memo === null) {
          return null;
        }
        const result = selectCompetencyResult(cid)(state);
        if (result === 0 && competenciesById[cid].screenOut) {
          return null;
        }
        return memo + result;
      }, 0);
      return memo;
    },
    {}
  );
};
export const isApplicantMovingForward = (state) => {
  return Object.values(selectSpecialtyResults(state)).reduce((memo, result) => {
    return memo + result;
  }, 0)
    ? true
    : false;
};
/**
 * Form state:
 */

// Specialty status
/**
 * decision: true/false/null
 * specialtyComplete: true/false
 *
 * Each specialty has the value of:
 * - decision :
 * - pass
 * - incomplete
 * - needs_justification
 * - fail
 */
export const selectCompetencyStates = (state) => {
  // Enable all competencies for RR
  return Object.values(state.assessment.competenciesById).reduce((memo, c) => {
    memo[c.id] = true;
    return memo;
  }, {});
  // const specialtyResults = selectSpecialtyResults(state);

  // const enabledCompetencies = Object.values(
  //   state.assessment.competenciesById
  // ).reduce((memo, c) => {
  //   memo[c.id] = false;
  //   return memo;
  // }, {});

  // Object.entries(state.assessment.specialtyCompetencyMap).forEach(
  //   ([sid, competencies]) => {
  //     if (specialtyResults[sid] !== null) {
  //       competencies.forEach((compId) => {
  //         enabledCompetencies[compId] = true;
  //       });
  //     }
  //   }
  // );
  // Object.values(state.assessment.competenciesById).forEach(({ id: compId }) => {
  //   const { competency_selector_id } = state.assessment.competenciesById[
  //     compId
  //   ].evaluation;
  //   if (
  //     competency_selector_id === "failing" ||
  //     state.assessment.competencySelectors[competency_selector_id] === 0
  //   ) {
  //     enabledCompetencies[compId] = true;
  //   }
  // });
  // return enabledCompetencies;
};
export const isCompetencyEnabled = (id) => (state) => {
  switch (state.assessment.formState) {
    case "default":
    case "note":
    case "re-evaluate":
      return selectCompetencyStates(state)[id];
    default:
      return false;
  }
};

export const selectIsFormDisabled = (state) => {
  switch (state.assessment.formState) {
    case "default":
    case "note":
    case "re-evaluate":
      return false;
    default:
      return true;
  }
};

export const selectIsFormComplete = (state) => {
  const { competenciesById, specialtyCompetencyMap } = state.assessment;
  return Object.values(specialtyCompetencyMap)
    .map((competencies) => {
      // const isFailing = competencies.reduce((memo, cid) => {
      //   if (memo) return memo;
      //   const result = selectCompetencyResult(cid)(state);
      //   if (
      //     result === 0 &&
      //     competenciesById[cid].evaluation.competency_selector_id !==
      //       "failing" &&
      //     competenciesById[cid].screenOut
      //   ) {
      //     // If this is an experience competency, consider it done
      //     if (+competenciesById[cid].competencyType === 2) {
      //       return true;
      //     }
      //     // Otherwise if there is a note, consider it done
      //     if (competenciesById[cid].evaluation.evaluation_note) {
      //       return true;
      //     }
      //   }
      //   return false;
      // }, false);

      // if (isFailing) {
      //   return true;
      // }
      const allCompetenciesSelected = competencies.reduce((memo, cid) => {
        if (!memo) return false;
        const result = selectCompetencyResult(cid)(state);
        if (
          result === 0 &&
          competenciesById[cid].evaluation.competency_selector_id === "failing"
        ) {
          return false;
        }
        if (
          +competenciesById[cid].competencyType !== 2 &&
          !competenciesById[cid].evaluation.evaluation_note
        ) {
          return false;
        }
        // if (result === 0 && !competenciesById[cid].evaluation.evaluation_note) {
        //   return false;
        // }
        if (!competenciesById[cid].evaluation.competency_selector_id) {
          return false;
        }

        return true;
      }, true);

      if (allCompetenciesSelected) {
        return true;
      }
      return false;
    })
    .reduce(
      (formComplete, specialtyComplete) => formComplete && specialtyComplete,
      true
    );
};

// Form Alert
export const selectFormAlert = (state) => {
  const applicantName = selectApplicantName(state);
  const formState = selectFormState(state);
  const applicantFeedback = selectApplicantFeedback(state);
  const errorMessage = selectErrorMessage(state);
  switch (formState) {
    case "note":
      return {
        title: `Please read this before evaluating the ${applicantName}`,
        alertType: "info",
        body: applicantFeedback,
        action: null,
      };
    case "re-evaluate":
      return {
        title: `Action required`,
        alertType: "warning",
        // TODO: update to remove failing for this applicant
        body: [
          `See note below from HR to amend your justification for failing this applicant.`,
          applicantFeedback,
        ],
        action: null,
      };
    case "success":
      return {
        title: `Your review of ${applicantName} has been saved`,
        alertType: "success",
        body: "If you need to edit your review, please reach out to HR.",
        action: "next",
      };
    case "flagged":
      return {
        title: `You are flagging ${applicantName} for review by HR`,
        alertType: "warning",
        body: "You are flagging this applicant for review, please include what needs to be reviewed below.",
        action: "flag",
      };
    case "flagMessageNeeded":
      return {
        title: `You are flagging ${applicantName} for review by HR`,
        alertType: "error",
        body: "You must include a message of at least 5 letters when attempting to flag an applicant.",
        action: "flag",
      };
    case "flagSuccess":
      return {
        title: `You have flagged ${applicantName} for review by HR`,
        alertType: "success",
        body: "The applicant will be removed from the queue until HR has verified it is valid.",
        action: "next",
      };
    case "recused":
      return {
        title: `You are recused from reviewing ${applicantName}`,
        alertType: "success",
        body: "The applicant will be reassigned to other Subject Matter Experts for review.",
        action: "next",
      };
    case "error":
      return {
        title: `There was an error evaluating ${applicantName}`,
        alertType: "error",
        body:
          typeof errorMessage === "string" && errorMessage.length > 0
            ? errorMessage
            : "Please reach out to USDS with this issue",
        action: "next",
      };

    default:
      return null;
  }
};
