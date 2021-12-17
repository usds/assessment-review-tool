-- There was an issue with the view joining too many recused applicants
CREATE OR REPLACE VIEW evaluator_recusals AS
SELECT 
    recused_evaluator_id recuser
    ,COUNT(DISTINCT(applicant_id)) recused
	,assessment_hurdle_id
    FROM applicant_recusals
	LEFT JOIN applicant a ON a.id = applicant_id
    GROUP BY recused_evaluator_id, assessment_hurdle_id;

CREATE OR REPLACE VIEW evaluator_metrics AS
SELECT
	evaluator
	, aa.assessment_hurdle_id
	, au.name
	, COUNT(*) FILTER (WHERE approved IS null) pending_review
	, COUNT(*) FILTER (WHERE approved IS false) pending_amendment
	, COUNT(*) FILTER (WHERE approved IS true) completed
	, COALESCE(MAX(recused), 0) recusals
FROM app_user au
LEFT JOIN application_evaluation ae ON ae.evaluator = au.id
LEFT JOIN application a on a.id = ae.application_id
LEFT JOIN applicant aa ON aa.id = a.applicant_id
LEFT JOIN evaluator_recusals er ON er.recuser = au.id
GROUP BY evaluator, au.name,aa.assessment_hurdle_id;