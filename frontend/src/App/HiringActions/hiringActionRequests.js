/*
Returns all active/inactive hiring actions, and relevant metadata, associated with the user
*/
export const getHiringActions = async () => {
  const url = `/api/assessment-hurdle/roles`;
  const { data: assessmentHurdles } = await fetch(url).then((r) => r.json());
  const updatedAssessmentHurdles = assessmentHurdles.reduce((memo, ah) => {
    const { AssessmentHurdleUsers, ...assessmentHurdle } = ah;

    return memo.concat(
      AssessmentHurdleUsers.map((u) => {
        return { userType: u.role, ...assessmentHurdle };
      })
    );
  }, []);
  return updatedAssessmentHurdles;
};

/*
  Returns metadata on a given hiring action (ie: positionName, component, location, etc)
*/
export const getHiringActionDetails = async (assessmentHurdleId) => {
  const url = `/api/assessment-hurdle/${assessmentHurdleId}`;
  const { data: hiringActionDetails } = await fetch(url).then((r) => r.json());
  return hiringActionDetails;
};

/**
 * Gets details for
 * @param {*} assessmentHurdleId
 */
export const getHiringActionResults = async (assessmentHurdleId) => {
  const url = `/api/assessment-hurdle/hr/${assessmentHurdleId}/export`;
  const hiringActionResults = await fetch(url).then((r) => r.json());
  return hiringActionResults;
};

export const getHiringActionMetrics = async (assessmentHurdleId) => {
  const url = `/api/assessment-hurdle/hr/${assessmentHurdleId}/metrics`;
  const hiringActionResults = await fetch(url).then((r) => r.json());
  return hiringActionResults;
};

export const getHiringActionProgress = async (assessmentHurdleId) => {
  const url = `/api/assessment-hurdle/hr/${assessmentHurdleId}/progress`;
  const hiringActionProgress = await fetch(url).then((r) => r.json());
  return hiringActionProgress;
};
