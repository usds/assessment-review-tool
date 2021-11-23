-- Note:
-- This file became a bit of a wasteland due to some changing reqs, specifically that we had to match failures on specific competencies... Tread carefully and read through all the comments.

-- Single applicant's feedback status
CREATE OR REPLACE VIEW applicant_application_evaluation_notes AS
SELECT 
	ae.evaluator
	, ae.evaluation_note
	, a.applicant_id
FROM application_evaluation ae
LEFT JOIN application a ON a.id = ae.application_id
GROUP BY ae.evaluator, ae.evaluation_note, a.applicant_id;


-- Single application's competency's status
-- NOTE: Screen out is true for all competencies.
CREATE OR REPLACE VIEW competency_evaluation_count AS
SELECT
	c.assessment_hurdle_id
	, c.id competency_id
	, c.screen_out
	, ce.applicant
	, COUNT(*) FILTER (WHERE cs.point_value <= 0) does_not_meet
	, COUNT(*) FILTER (WHERE cs.point_value > 0) meets
	, COUNT(DISTINCT evaluator) evaluators
FROM competency_evaluation ce
LEFT JOIN competency c on c.id = ce.competency_id
LEFT JOIN competency_selectors cs on cs.id = ce.competency_selector_id
GROUP BY c.id, ce.applicant, c.assessment_hurdle_id, c.screen_out;

CREATE OR REPLACE VIEW competency_evaluation_count_agg AS
SELECT
	assessment_hurdle_id
	, competency_id
	, screen_out
	, applicant
	, does_not_meet >= ah.evaluations_required does_not_meet
	, meets >= ah.evaluations_required meets
	, (does_not_meet < ah.evaluations_required AND meets < ah.evaluations_required) pending
	, evaluators
	, evaluations_required
	FROM competency_evaluation_count
	LEFT JOIN assessment_hurdle ah on ah.id = competency_evaluation_count.assessment_hurdle_id;

-- If there are _any_ decided "does not meet" competencies, then applicant status is "does not meet"
-- After that, if there are _any_ pending competencies, then applicant is pending
-- Otherwise we need to ensure that 

CREATE OR REPLACE VIEW applicant_status AS
SELECT 
	applicant applicant_id
	, assessment_hurdle_id
	, COUNT(*) FILTER (WHERE does_not_meet IS TRUE) does_not_meet
	, COUNT(*) FILTER (WHERE meets IS TRUE) meets
	, COUNT(*) FILTER (WHERE pending IS TRUE) pending
	, COUNT(ceca.competency_id) competencies
	, MAX(evaluators) evaluators
	, MAX(evaluations_required) evaluations_required
	FROM competency_evaluation_count_agg ceca
	GROUP BY applicant_id, assessment_hurdle_id;

CREATE OR REPLACE VIEW applicant_status_agg AS
SELECT 
	applicant.id applicant_id
	, applicant.assessment_hurdle_id
	, CASE 
		WHEN SUM(does_not_meet) > 0 THEN 'does_not_meet'
		WHEN SUM(pending) > 0 THEN 'pending'
		WHEN SUM(meets) = SUM(competencies) THEN 'meets'
		WHEN BOOL_OR(applicant_status.applicant_id IS NULL) THEN 'pending'
		ELSE 'error' END status
	, MAX(evaluators) evaluators
	, evaluations_required
	FROM applicant
	LEFT JOIN applicant_status on applicant_status.applicant_id = applicant.id
	GROUP BY applicant.id, evaluations_required;

-- QUEUE override
CREATE OR REPLACE VIEW applicant_queue AS
	SELECT applicant_id
	, assessment_hurdle_id
	, evaluators
	 FROM applicant_status_agg asg
	 WHERE status = 'pending';

-- REPLACED in 11_views.sql
CREATE OR REPLACE VIEW applicant_evaluation_status AS
SELECT 
	applicant.id applicant_id
	, name
	, SUM(flag_type) > 0 flagged
	, CASE
		WHEN bool_or(approved IS false) THEN 'pending amendment'
		WHEN bool_and(approved IS null) THEN 'pending review'
		WHEN bool_and(approved IS true) THEN 'complete'
		ELSE 'error' end status
	, COUNT(ar.id) recused
FROM applicant
	LEFT JOIN application ON application.applicant_id = applicant.id
	LEFT JOIN application_evaluation ae ON ae.application_id = application.id
	LEFT JOIN applicant_recusals ar ON ar.applicant_id = applicant.id
	GROUP BY applicant.id, name;


-- Applicant status metrics:
-- Name
-- Evaluations
-- Overall status (Incomplete, meets, does not meet)
-- Review status (pending evaluations, pending amendment,  pending review, complete)
-- recused
-- Flagged

-- REPLACED in 11_views.sql
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

-- SME Summary
-- name
-- meets
-- does not meet
-- pending amendment
-- pending review
CREATE OR REPLACE VIEW evaluator_metrics AS
SELECT 
	evaluator
	, ahe.assessment_hurdle_id
	, au.name
	, COUNT(*) FILTER (WHERE approved IS null) pending_review
	, COUNT(*) FILTER (WHERE approved IS false) pending_amendment
	, COUNT(*) FILTER (WHERE approved IS true) completed
	, COUNT(DISTINCT(ar.applicant_id)) recusals
FROM app_user au
LEFT JOIN application_evaluation ae ON au.id = ae.evaluator
LEFT JOIN assessment_hurdle_user ahe ON ahe.app_user_id = evaluator
LEFT JOIN applicant_recusals ar ON ar.recused_evaluator_id = au.id
GROUP BY evaluator, au.name,ahe.assessment_hurdle_id;

CREATE OR REPLACE view reviewer_metrics AS
SELECT 
	au.id reviewer_id
	, au.name
	, au.email email
	, app.assessment_hurdle_id
	, COUNT(*) FILTER (WHERE approved IS false) pending_amendment
	, COUNT(*) FILTER (WHERE approved IS true) adjudicated
FROM application_evaluation ae
LEFT JOIN app_user au ON au.id = approver_id
LEFT JOIN application a ON a.id = ae.application_id
LEFT JOIN applicant app on app.id = a.applicant_id
group BY au.id, au.name, au.email, app.assessment_hurdle_id;


CREATE OR REPLACE VIEW application_evaluation_with_competencies AS
SELECT 
	a.name
	, evaluator.email
	, ae.updated_at hr_review_time
	, ae.approved
	, aef.evaluation_feedback
	, reviewer.email evaluation_feedback_author
	, BOOL_AND(cs.point_value > 0) AS passing
	, STRING_AGG(CONCAT(c.name, ': ', cs.display_name, ' - ', ce.evaluation_note), ' <<<>>> ') competency_evaluations
	, ae.id application_evaluation_id
FROM application_evaluation ae
LEFT JOIN application_evaluation_competency aec on aec.application_evaluation_id = ae.id
LEFT JOIN competency_evaluation ce on ce.id = aec.competency_evaluation_id
LEFT JOIN competency_selectors cs ON cs.id = ce.competency_selector_id
LEFT JOIN competency c ON c.id = ce.competency_id
LEFT JOIN application app ON app.id = ae.application_id
LEFT JOIN applicant a ON a.id = app.applicant_id
LEFT JOIN applicant_evaluation_feedback aef ON a.id = aef.applicant_id AND ae.evaluator = aef.evaluator_id
LEFT JOIN app_user evaluator ON evaluator.id = ae.evaluator
LEFT JOIN app_user reviewer ON reviewer.id = aef.feedback_author_id
GROUP BY (a.name
	, evaluator.email
	, ae.updated_at 
	, ae.approved
	, aef.evaluation_feedback
	, reviewer.email
	, ae.id);
