ALTER TABLE application_evaluation_audit_trail
ADD COLUMN assessment_hurdle_id UUID;

DROP VIEW application_evaluation_with_competencies;
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
	, a.assessment_hurdle_id assessment_hurdle_id
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
	, ae.id
    , a.assessment_hurdle_id);

DROP FUNCTION audit_evaluation;
CREATE FUNCTION audit_evaluation(app_eval_id uuid)
RETURNS VOID AS $$
	begin
		INSERT INTO application_evaluation_audit_trail 
		SELECT 
			gen_random_uuid() id
			, name
			, email
			, hr_review_time 
			, approved
			, evaluation_feedback
			, evaluation_feedback_author
			, passing
			, competency_evaluations 
            , assessment_hurdle_id
		FROM application_evaluation_with_competencies
		WHERE application_evaluation_id = app_eval_id;
	END
$$ LANGUAGE plpgsql;