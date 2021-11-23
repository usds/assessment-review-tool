export const fetchAssessmentHurdleMetrics = async (assessmentHurdleId) => {
  const url = `/api/metrics/assessment_hurdle/${assessmentHurdleId}/getMetrics`;
  const assessmentHurdleMetrics = await fetch(url).then((r) => r.json());

  return assessmentHurdleMetrics;
};
