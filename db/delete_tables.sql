-- delete all tables --
-- TODO: delete hiring_action_hr_user and hiring_action_sme_user once we migrate off them 
DROP TABLE IF EXISTS
  application
  , app_user
  , hiring_action
  , hiring_action_app_user
  , competency
  , competency_review
  , specialty
  , specialty_result
  , pending_application
  , specialty_result_competency_review
  , application_specialty
  , audit_log
  , analytics
  CASCADE;-- delete all tables --