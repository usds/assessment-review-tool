-- Must re-run 11_views.sql and 20_fix_view.sql after this
-- Have to drop views since they depend on the volumns below
DROP VIEW application_evaluation_with_competencies;
DROP VIEW evaluator_metrics;
DROP VIEW applicant_status_metrics;
DROP VIEW applicant_evaluation_status;
DROP VIEW applicant_queue;
DROP VIEW applicant_status_agg;
DROP VIEW applicant_status;
DROP VIEW competency_evaluation_count_agg;
DROP VIEW competency_evaluation_count;
DROP VIEW applicant_application_evaluation_notes;

ALTER TABLE application_evaluation
   ALTER COLUMN evaluation_note TYPE VARCHAR;
ALTER TABLE competency_evaluation
   ALTER COLUMN evaluation_note TYPE VARCHAR;
ALTER TABLE competency
   ALTER COLUMN definition TYPE VARCHAR;
ALTER TABLE competency
   ALTER COLUMN required_proficiency_definition TYPE VARCHAR;
ALTER TABLE applicant
   ALTER COLUMN additional_note TYPE VARCHAR;
ALTER TABLE applicant_evaluation_feedback
   ALTER COLUMN evaluation_feedback TYPE VARCHAR;
ALTER TABLE competency_evaluation
   ALTER COLUMN evaluation_note TYPE VARCHAR;
