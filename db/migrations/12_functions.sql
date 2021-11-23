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
		FROM application_evaluation_with_competencies
		WHERE application_evaluation_id = app_eval_id;
	END
$$ LANGUAGE plpgsql;