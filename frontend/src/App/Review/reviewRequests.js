/**
 *
 * @param {string} hiringActionId
 */
export const requestHrDetails = async (hiringActionId) => {
  const url = `/api/assessment-hurdle/${hiringActionId}/hrdisplay`;
  // const url = `/api/review/${assessmentHurdleId/hrDisplay}
  let { data: hrView } = await fetch(url).then((r) => r.json());
  return hrView;
};

/**
 *
 * @param {string} hurdleId
 * @param {string} applicationEvaluationIds
 * @param {Boolean} reviewStatus
 */
export const sumbitAssessmentReview = async (
  hurdleId,
  applicationEvaluationIds,
  reviewStatus
) => {
  const reviewObject = {
    evaluationId: applicationEvaluationIds,
    review: reviewStatus,
  };
  const url = `/api/evaluation/${hurdleId}/application/review`;
  // const url = `/api/review/${assessmentHurdleId}/evaluation/${evaluationId}/eval`;

  return fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reviewObject),
  }).then((r) => {
    if (!r.ok) {
      throw new Error("Unable to complete request");
    }
    return r;
  });
};

export const submitFeedbackNote = (
  assessmentHurdleId,
  details,
  feedbackNote
) => {
  const { evaluator, applicantId, applicantFeedbackId } = details;

  const url = `/api/evaluation/${assessmentHurdleId}/feedback/${applicantId}`;
  // const url = `/api/review/${assessmentHurdleId}/applicant/${applicantId}/evaluation_feedback`;

  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        feedback: feedbackNote,
        existingId: applicantFeedbackId || undefined,
        evaluatorId: evaluator,
      }),
    })
      .then((r) => {
        const { ok } = r;
        r.json()
          .then((body) => {
            if (!ok) {
              return reject(body.message);
            }
            return resolve(body);
          })
          .catch(reject);
      })
      .catch(reject);
  });
};
export const submitApplicantNote = (
  assessmentHurdleId,
  applicantId,
  feedbackNote
) => {
  const url = `/api/review/${assessmentHurdleId}/applicant/${applicantId}/applicant_feedback`;
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        feedback: feedbackNote,
      }),
    })
      .then((r) => {
        const { ok } = r;
        r.json()
          .then((body) => {
            if (!ok) {
              return reject(body.message);
            }
            return resolve(body);
          })
          .catch(reject);
      })
      .catch(reject);
  });
};

export const requestApplicantRelease = (assessmentHurdleId, applicantId) => {
  const url = `/api/review/${assessmentHurdleId}/applicant/${applicantId}/release`;
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "POST",
    })
      .then((r) => {
        const { ok } = r;
        r.json()
          .then((body) => {
            if (!ok) {
              return reject(body.message);
            }
            return resolve(body);
          })
          .catch(reject);
      })
      .catch(reject);
  });
};
