/**
 *
 * @param {*} hiringActionId
 */
export const requestNextApplication = async (hiringActionId) => {
  const url = `/api/assessment-hurdle/${hiringActionId}/next/`;
  const { data: applicant } = await fetch(url).then((r) => {
    if (r.ok) {
      return r.json();
    } else {
      throw new Error("Could not fetch applicant");
    }
  });
  if (!applicant) {
    return null;
  }
  // return assessmentStub.data;
  return applicant.applicant_id;
};
export const requestApplicationDisplay = async (
  assessmentHurdleId,
  applicantId
) => {
  const url = `/api/evaluation/${assessmentHurdleId}/display/${applicantId}`;
  const { data: application } = await fetch(url).then(async (r) => {
    if (r.ok) {
      return r.json();
    } else {
      const { message } = await r.json();
      throw new Error(message);
    }
  });
  // return assessmentStub.data;
  return application;
};

/**
 *
 * @param {*} hiringActionId
 * @param {*} usasAppNum
 * @param {*} reviews
 * @param {*} movesForwardNote
 *
 * Submits a completed SME review for an applicant
 *
 */
export const submitApplicationReview = (
  assessmentHurdleId,
  applicantId,
  competencyEvaluations,
  applicantEvaluationNote,
  isTieBreaker
) => {
  const url = `/api/evaluation/${assessmentHurdleId}/submit/${applicantId}`;
  let body = {
    competencyEvals: competencyEvaluations,
    note: applicantEvaluationNote,
    isTieBreaker,
  };

  return fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  }).then(async (r) => {
    if (!r.ok) {
      const { message } = await r.json();
      throw new Error(message);
    }
    return r;
  });
};

/**
 *
 * @param {*} hiringActionId
 * @param {*} applicantId
 */
export const recuseFromReview = (hiringActionId, applicantId) => {
  const url = `/api/evaluation/${hiringActionId}/recuse/${applicantId}`;
  return fetch(url, {
    method: "PUT",
  });
};

export const flagForHr = (hiringActionId, applicantId, flagMessage) => {
  const url = `/api/evaluation/${hiringActionId}/flag/${applicantId}`;
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ flagMessage }),
  });
};

export const getSmeProgress = async (hiringActionId, evaluatorId) => {
  const {
    totalApplicants,
    totalEvaluated,
    totalEvaluationsNeeded,
    applicantsEvaluatedByUser,
  } = await fetch(
    `/api/metrics/assessment_hurdle/${hiringActionId}/evaluator`
  ).then((r) => r.json());

  return {
    totalApplicants,
    totalEvaluated,
    totalEvaluationsNeeded,
    applicantsEvaluatedByUser,
  };
};
