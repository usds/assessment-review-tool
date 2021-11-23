-- There was an issue with the view joining too many recused applicants
CREATE OR REPLACE VIEW evaluator_recusals AS
SELECT 
    recused_evaluator_id recuser
    ,COUNT(DISTINCT(applicant_id)) recused
    FROM applicant_recusals
    GROUP BY recused_evaluator_id;
CREATE OR REPLACE VIEW evaluator_metrics AS
SELECT 
	evaluator
	, ahe.assessment_hurdle_id
	, au.name
	, COUNT(*) FILTER (WHERE approved IS null) pending_review
	, COUNT(*) FILTER (WHERE approved IS false) pending_amendment
	, COUNT(*) FILTER (WHERE approved IS true) completed
	, MAX(er.recused) recusals
FROM app_user au
LEFT JOIN application_evaluation ae ON au.id = ae.evaluator
LEFT JOIN assessment_hurdle_user ahe ON ahe.app_user_id = evaluator
LEFT JOIN evaluator_recusals er ON er.recuser = au.id
GROUP BY evaluator, au.name,ahe.assessment_hurdle_id, recuser;