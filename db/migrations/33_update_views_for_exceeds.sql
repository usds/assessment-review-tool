DROP VIEW competency_evaluation_count CASCADE;
-- Single application's competency's status
-- To determine if there are competency level tie breakers needed
CREATE OR REPLACE VIEW competency_evaluation_count AS
SELECT
	c.assessment_hurdle_id
	, c.id competency_id
	, c.screen_out
	, ce.applicant
	, COUNT(*) FILTER (WHERE cs.point_value <= 0) does_not_meet
	, COUNT(*) FILTER (WHERE cs.point_value > 0) meets
    , AVG(cs.point_value) competency_point_value
	, COUNT(DISTINCT evaluator) evaluators
FROM competency_evaluation ce
LEFT JOIN competency c on c.id = ce.competency_id
LEFT JOIN competency_selectors cs on cs.id = ce.competency_selector_id
GROUP BY c.id, ce.applicant, c.assessment_hurdle_id, c.screen_out;

-- Determine if this competency has all the required evaluations
CREATE OR REPLACE VIEW competency_evaluation_count_agg AS
SELECT
	assessment_hurdle_id
	, competency_id
	, screen_out
	, applicant
	, does_not_meet >= ah.evaluations_required does_not_meet
	, meets >= ah.evaluations_required meets
	, (does_not_meet < ah.evaluations_required AND meets < ah.evaluations_required) pending
    , competency_point_value
	, evaluators
	, ah.evaluations_required
	FROM competency_evaluation_count
	LEFT JOIN assessment_hurdle ah on ah.id = competency_evaluation_count.assessment_hurdle_id;

-- TODO: ONLY HANDLES ONE SPECIALTY CURRENTLY
-- If there are "does not meet" competencies that are also "screen outs"
-- then applicant status is "does not meet"
-- If there are any "pending" competencies, then applicant status is "pending"
-- otherwise need the point value... which will be the average of any two SME's
--
-- After that, if there are _any_ pending competencies, then applicant is pending

-- TODO: Migrate from applicant status to specialty status. Will currently break
-- on multiple specialties.
CREATE OR REPLACE VIEW applicant_status AS
SELECT 
	applicant applicant_id
	, ceca.assessment_hurdle_id
	, COUNT(*) FILTER (WHERE does_not_meet IS TRUE AND screen_out IS TRUE) screen_out_does_not_meet
    , COUNT(*) FILTER  (WHERE does_not_meet IS TRUE) does_not_meet
	, COUNT(*) FILTER (WHERE meets IS TRUE) meets
	, COUNT(*) FILTER (WHERE pending IS TRUE) pending
    , SUM(ceca.competency_point_value) specialty_points
	, COUNT(ceca.competency_id) competencies
	, MAX(evaluators) evaluators
	, MAX(evaluations_required) evaluations_required
    , s.does_not_meet_points
    , s.does_not_meet_nor
    , s.meets_points
    , s.meets_nor
    , s.exceeds_points
    , s.exceeds_nor
    , s.id 
	FROM competency_evaluation_count_agg ceca
    LEFT JOIN application a ON a.applicant_id = ceca.applicant
    LEFT JOIN specialty s ON  s.id = a.specialty_id
	GROUP BY applicant_id
        , ceca.applicant
        , ceca.assessment_hurdle_id
        , s.does_not_meet_points
        , s.does_not_meet_nor
        , s.meets_points
        , s.meets_nor
        , s.exceeds_points
        , s.exceeds_nor
        , s.id ;

CREATE OR REPLACE VIEW applicant_status_agg AS
SELECT 
	applicant.id applicant_id
	, applicant.assessment_hurdle_id
	, CASE 
		WHEN SUM(screen_out_does_not_meet) > 0 THEN does_not_meet_nor
		WHEN SUM(pending) > 0 THEN 'pending'
        WHEN BOOL_OR(applicant_status.applicant_id IS NULL) THEN 'pending'
        WHEN SUM(meets) + SUM(does_not_meet) != SUM(competencies) THEN 'ERROR'
        WHEN exceeds_points > meets_points AND specialty_points >= exceeds_points THEN exceeds_nor
        WHEN specialty_points > meets_points THEN meets_nor
		ELSE does_not_meet_nor END status
	, MAX(evaluators) evaluators
	, evaluations_required
	FROM applicant
	LEFT JOIN applicant_status on applicant_status.applicant_id = applicant.id
	GROUP BY applicant.id
    , specialty_points
    , evaluations_required
    , does_not_meet_points
    , does_not_meet_nor
    , meets_points
    , meets_nor
    , exceeds_points
    , exceeds_nor;

-- QUEUE override
CREATE OR REPLACE VIEW applicant_queue AS
	SELECT applicant_id
	, assessment_hurdle_id
	, evaluators
	 FROM applicant_status_agg asg
	 WHERE status = 'pending';

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
