DROP VIEW applicant_status_metrics;
DROP VIEW applicant_evaluation_status;

CREATE OR REPLACE VIEW applicant_evaluation_status AS
SELECT 
	applicant.id applicant_id
	, name
	, SUM(flag_type) > 0 flagged
	, CASE
		WHEN bool_or(approved IS false) THEN 'pending amendment'
		WHEN bool_or(approved IS null) THEN 'pending review'
		WHEN bool_and(approved IS true) THEN 'complete'
		ELSE 'error' end status
	, COUNT(ar.id) recused
FROM applicant
	LEFT JOIN application ON application.applicant_id = applicant.id
	LEFT JOIN application_evaluation ae ON ae.application_id = application.id
	LEFT JOIN applicant_recusals ar ON ar.applicant_id = applicant.id
	GROUP BY applicant.id, name;


CREATE OR REPLACE VIEW applicant_status_metrics AS
SELECT
	asa.applicant_id
	, aes.name 
	, asa.assessment_hurdle_id
	, evaluators
	, recused
	, flagged
	, asa.status evaluation_status
	, CASE
		WHEN asa.status = 'pending' THEN 'pending evaluations'
		ELSE aes.status end review_status
	, evaluations_required
	FROM applicant_status_agg asa
	LEFT JOIN applicant_evaluation_status aes on aes.applicant_id = asa.applicant_id;
