CREATE TABLE IF NOT EXISTS SMEQA_DB_VERSION(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid()
    , migration_number INT 
);
CREATE TABLE IF NOT EXISTS app_user (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid()
    , email VARCHAR NOT NULL UNIQUE
    , name VARCHAR
    , created_at TIMESTAMP DEFAULT NOW()
    , updated_at TIMESTAMP DEFAULT NOW()
    , constraint unique_email UNIQUE(email)
);


CREATE TABLE IF NOT EXISTS assessment_hurdle (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid()
    , department_name VARCHAR not null -- optional: ie: "Department of Interior", "Government Wide"
    , component_name VARCHAR -- optional: ie: "National Park Service"
    , position_name VARCHAR NOT NULL -- ie: "IT Specialist"
    , assessment_name VARCHAR NOT NULL -- ie: "Structured Interview #1"
    , position_details VARCHAR -- ie: "GS 12/GS 12-15"
    , locations VARCHAR -- ie: "Washington, DC; Chicago, IL, Remote"
    , start_datetime TIMESTAMP NOT NULL
    , end_datetime TIMESTAMP NOT NULL
    , hurdle_display_type INT NOT NULL -- written assessment, resume review, etc
    , evaluations_required INT NOT NULL default 2 -- number of evaluations required for concensus per competency (e.g. 2)
    , require_review_for_all_passing BOOLEAN default FALSE
    , hr_name VARCHAR -- could be distinct for te HR users of the tool
    , hr_email VARCHAR -- could be distinct from the HR users of the tool, and might not be in same agency
    , created_at TIMESTAMP DEFAULT NOW()
    , updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assessment_hurdle_meta (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid()
    , staffing_vacancy_id VARCHAR NOT NULL UNIQUE -- unique across all hurdles of a hiring action
    , staffing_assessment_id VARCHAR NOT NULL -- unique per hurdle (ie: all RR are the same). Note: only assuming this tool handles one assessment
    , staffing_pass_nor VARCHAR
    , staffing_fail_nor VARCHAR
    , assessment_hurdle_id UUID references assessment_hurdle (id) ON DELETE CASCADE
    , created_at TIMESTAMP DEFAULT NOW()
    , updated_at TIMESTAMP DEFAULT NOW()
    , CONSTRAINT unique_hurdle UNIQUE (staffing_vacancy_id,staffing_assessment_id)
    , constraint unique_meta_hurdle UNIQUE(assessment_hurdle_id)
);

CREATE TABLE IF NOT EXISTS assessment_hurdle_user (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid()
    , app_user_id UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE -- the uuid of the user
    , role INT NOT NULL -- { admin: 0, hr: 1, sme: 2, all: 10}
    , assessment_hurdle_id UUID NOT NULL REFERENCES assessment_hurdle(id) ON DELETE CASCADE -- the uuid of the hiringAction
    , created_at TIMESTAMP DEFAULT NOW()
    , updated_at TIMESTAMP DEFAULT NOW()
    , CONSTRAINT user_in_assessment_hurdle UNIQUE (assessment_hurdle_id, app_user_id, role)
);


CREATE TABLE IF NOT EXISTS specialty (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid()
    , name VARCHAR NOT NULL
    , local_id VARCHAR NOT NULL -- used for mapping competencies to specialty
    , assessment_hurdle_id UUID REFERENCES assessment_hurdle(id) ON DELETE CASCADE
    , points_required INT DEFAULT 1 -- Default for pass/fail interviews
    , created_at TIMESTAMP DEFAULT NOW()
    , updated_at TIMESTAMP DEFAULT NOW()
    , CONSTRAINT unique_specialty UNIQUE (name, assessment_hurdle_id) -- prevent accidental duplicate names
    , CONSTRAINT unique_specialty_mapping UNIQUE (local_id, assessment_hurdle_id) -- prevent accidental duplicates specialties

);

CREATE TABLE IF NOT EXISTS competency (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid()
    , name VARCHAR NOT NULL
    , local_id VARCHAR NOT NULL
    , assessment_hurdle_id UUID REFERENCES assessment_hurdle(id) ON DELETE CASCADE 
    , definition VARCHAR NOT NULL
    , required_proficiency_definition VARCHAR
    , display_type INT DEFAULT 0 -- 0 default; 1 - experience; 2 -  Meets/exceeds
    , screen_out boolean
    , sort_order int default 0
    , created_at TIMESTAMP DEFAULT NOW()
    , updated_at TIMESTAMP DEFAULT NOW()
    , CONSTRAINT unique_name UNIQUE(name, assessment_hurdle_id)
    , CONSTRAINT unique_local_id UNIQUE(assessment_hurdle_id, local_id)
);

CREATE TABLE IF NOT EXISTS specialty_competencies (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid()
	, specialty_id UUID REFERENCES specialty(id) ON DELETE CASCADE
	, competency_id UUID references competency(id) ON DELETE CASCADE
	, created_at TIMESTAMP DEFAULT NOW()
    , updated_at TIMESTAMP DEFAULT NOW()
    , constraint unique_combo UNIQUE(specialty_id, competency_id)
);


CREATE TABLE IF NOT EXISTS applicant (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid()
    , name VARCHAR
    , flag_type INT DEFAULT 0 -- 1: SME; 2: HR; 3: SYSTEM ERROR
    , flag_message VARCHAR DEFAULT NULL
    , assessment_hurdle_id UUID REFERENCES assessment_hurdle(id) ON DELETE CASCADE
    , additional_note VARCHAR NULL
    , created_at TIMESTAMP DEFAULT NOW()
    , updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS applicant_meta(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid()
    , staffing_first_name VARCHAR NOT NULL
    , staffing_middle_name VARCHAR
    , staffing_last_name VARCHAR NOT NULL
    , staffing_application_number VARCHAR -- USE THIS FOR IDENTIFICATION unique per applicant in a hiring action
    , staffing_application_id VARCHAR NOT NULL -- unique per applicant in a hiring action; similiar to `staffing_application_number`
    , applicant_id UUID references applicant (id) ON DELETE CASCADE
    , created_at TIMESTAMP DEFAULT NOW()
    , updated_at TIMESTAMP DEFAULT NOW()
    , CONSTRAINT unique_applicant_id_meta UNIQUE(applicant_id)
);


CREATE TABLE IF NOT EXISTS application (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid()
    , applicant_id UUID REFERENCES applicant(id) ON DELETE CASCADE
    , specialty_id UUID REFERENCES specialty(id) ON DELETE CASCADE-- each application corresponds to a single specialty.
    , created_at TIMESTAMP DEFAULT NOW()
    , updated_at TIMESTAMP DEFAULT NOW()
    , CONSTRAINT unique_pair UNIQUE(applicant_id, specialty_id)
);

-- there is one application per rating combination
-- a single applicant can have multiple applications
CREATE TABLE IF NOT EXISTS application_meta (
   id UUID PRIMARY KEY DEFAULT gen_random_uuid()
    , application_id UUID REFERENCES application(id) ON DELETE CASCADE
    , staffing_application_rating_id VARCHAR NOT NULL -- random id that is unique for each GS-level/role combo the applicant is applying for. ie: 6266. Different applicants applying to the same gs level/role have differnet ids.
    , staffing_assessment_id VARCHAR NOT NULL -- unique per hurdle (ie: all RR have the same value). ie: '3205'
    , staffing_rating_combination VARCHAR NOT NULL -- a single rating combination. ie: `2210-12(Generalist)` -- identifies the specialty
    , created_at TIMESTAMP DEFAULT NOW()
    , updated_at TIMESTAMP DEFAULT NOW()
	, CONSTRAINT unique_application_meta UNIQUE(application_id)
);


CREATE TABLE IF NOT EXISTS applicant_recusals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid()
    , applicant_id UUID REFERENCeS applicant(id) ON DELETE CASCADE
    , recused_evaluator_id UUID REFERENCES app_user(id) ON DELETE CASCADE
    , created_at TIMESTAMP DEFAULT NOW()
    , updated_at TIMESTAMP DEFAULT NOW()
    , CONSTRAINT unique_combo_user UNIQUE(applicant_id, recused_evaluator_id)
);


CREATE TABLE IF NOT EXISTS application_evaluation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid()
    , evaluation_note VARCHAR DEFAULT NULL
    , evaluator UUID references app_user(id) ON DELETE CASCADE
    , approved BOOLEAN DEFAULT NULL 
    , approved_type INT DEFAULT 1
    , approver_id UUID REFERENCES app_user(id) ON DELETE SET NULL
    , feedback_timestamp TIMESTAMP DEFAULT NULL
    , application_id UUID REFERENCES application(id) ON DELETE CASCADE
    , created_at TIMESTAMP DEFAULT NOW()
    , updated_at TIMESTAMP DEFAULT NOW()
    , CONSTRAINT unique_application_evaluation UNIQUE(application_id, evaluator)
);



CREATE TABLE IF NOT EXISTS applicant_evaluation_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid()
    , evaluation_feedback VARCHAR -- , application_evaluation_id UUID REFERENCES application_evaluation(id)
    , applicant_id UUID REFERENCES applicant(id) ON DELETE CASCADE
    , evaluator_id UUID REFERENCES app_user(id) ON DELETE CASCADE--- SME
    , feedback_author_id UUID REFERENCES app_user(id) ON DELETE SET NULL-- HR
    , feedback_timestamp TIMESTAMP
    , created_at TIMESTAMP DEFAULT NOW()
    , updated_at TIMESTAMP DEFAULT NOW()
    , CONSTRAINT unique_app_evaluation_feedback UNIQUE (applicant_id, feedback_author_id, evaluator_id) --,application_evaluation_id)
);

CREATE TABLE IF NOT EXISTS competency_selectors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid()
    , sort_order INT default 0
    , display_name VARCHAR-- e.g. [meets],[meets,exceeds], [gs13, g14, gs15, exceeds]
    , point_value int default 0 -- point value 0 show under "Does not meet"
    , default_text VARCHAR -- Only used for point value 0
    , competency_id UUID REFERENCES competency(id) ON DELETE CASCADE
    , created_at TIMESTAMP DEFAULT NOW()
    , updated_at TIMESTAMP DEFAULT NOW()
    , CONSTRAINT unique_competency UNIQUE (display_name, competency_id) -- prevent accidental duplicates specialties
);


CREATE TABLE IF NOT EXISTS competency_evaluation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid()
    , evaluation_note VARCHAR -- this is no longer used, but leaving it for possible future use
    , applicant UUID NOT NULL REFERENCES applicant(id) ON DELETE CASCADE
    , evaluator UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE
    , competency_id UUID NOT NULL REFERENCES competency(id) ON DELETE CASCADE
    , competency_selector_id UUID NOT NULL REFERENCES competency_selectors(id) ON DELETE CASCADE
    , created_at TIMESTAMP DEFAULT NOW()
    , updated_at TIMESTAMP DEFAULT NOW()
    , constraint unique_competency_evaluation UNIQUE(applicant, evaluator, competency_id)
);

-- This is a many-to-many due to overlapping competencies per specialty

CREATE TABLE IF NOT EXISTS application_evaluation_competency (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid()
    , application_evaluation_id UUID REFERENCES application_evaluation(id) ON DELETE CASCADE
    , competency_evaluation_id UUID REFERENCES competency_evaluation(id) ON DELETE CASCADE
    , created_at TIMESTAMP DEFAULT NOW()
    , updated_at TIMESTAMP DEFAULT NOW()
    , constraint unique_combo_eval UNIQUE(application_evaluation_id, competency_evaluation_id)
);


CREATE TABLE IF NOT EXISTS application_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid()
    , evaluator_id UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE
    , applicant_id UUID NOT NULL REFERENCES applicant(id) ON DELETE CASCADE
    , assessment_hurdle_id UUID NOT NULL REFERENCES assessment_hurdle(id) ON DELETE CASCADE 
    , active BOOLEAN
    , expires TIMESTAMP DEFAULT NULL
    , created_at TIMESTAMP DEFAULT NOW()
    , updated_at TIMESTAMP DEFAULT NOW()
    , CONSTRAINT unique_combo_eval_app UNIQUE(evaluator_id,applicant_id, assessment_hurdle_id)
);

CREATE TABLE IF NOT EXISTS application_evaluation_audit_trail (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid()
    , name VARCHAR
    , email VARCHAR
    , hr_review_time TIMESTAMP
    , approved boolean
    , evaluation_feedback VARCHAR
    , evaluation_feedback_author VARCHAR
    , passing boolean
    , competency_evaluations VARCHAR
);



CREATE TRIGGER update_with_changes BEFORE UPDATE ON app_user FOR EACH ROW EXECUTE PROCEDURE update_with_changes();
CREATE TRIGGER update_with_changes BEFORE UPDATE ON assessment_hurdle FOR EACH ROW EXECUTE PROCEDURE update_with_changes();
CREATE TRIGGER update_with_changes BEFORE UPDATE ON assessment_hurdle_meta FOR EACH ROW EXECUTE PROCEDURE update_with_changes();
CREATE TRIGGER update_with_changes BEFORE UPDATE ON assessment_hurdle_user FOR EACH ROW EXECUTE PROCEDURE update_with_changes();
CREATE TRIGGER update_with_changes BEFORE UPDATE ON specialty FOR EACH ROW EXECUTE PROCEDURE update_with_changes();
CREATE TRIGGER update_with_changes BEFORE UPDATE ON competency FOR EACH ROW EXECUTE PROCEDURE update_with_changes();
CREATE TRIGGER update_with_changes BEFORE UPDATE ON specialty_competencies FOR EACH ROW EXECUTE PROCEDURE update_with_changes();
CREATE TRIGGER update_with_changes BEFORE UPDATE ON competency_selectors FOR EACH ROW EXECUTE PROCEDURE update_with_changes();
CREATE TRIGGER update_with_changes BEFORE UPDATE ON applicant FOR EACH ROW EXECUTE PROCEDURE update_with_changes();
CREATE TRIGGER update_with_changes BEFORE UPDATE ON applicant_meta FOR EACH ROW EXECUTE PROCEDURE update_with_changes();
CREATE TRIGGER update_with_changes BEFORE UPDATE ON application FOR EACH ROW EXECUTE PROCEDURE update_with_changes();
CREATE TRIGGER update_with_changes BEFORE UPDATE ON application_meta FOR EACH ROW EXECUTE PROCEDURE update_with_changes();
CREATE TRIGGER update_with_changes BEFORE UPDATE ON applicant_recusals FOR EACH ROW EXECUTE PROCEDURE update_with_changes();
CREATE TRIGGER update_with_changes BEFORE UPDATE ON application_evaluation FOR EACH ROW EXECUTE PROCEDURE update_with_changes();
CREATE TRIGGER update_with_changes BEFORE UPDATE ON applicant_evaluation_feedback FOR EACH ROW EXECUTE PROCEDURE update_with_changes();
CREATE TRIGGER update_with_changes BEFORE UPDATE ON competency_evaluation FOR EACH ROW EXECUTE PROCEDURE update_with_changes();
CREATE TRIGGER update_with_changes BEFORE UPDATE ON application_evaluation_competency FOR EACH ROW EXECUTE PROCEDURE update_with_changes();
CREATE TRIGGER update_with_changes BEFORE UPDATE ON application_assignments FOR EACH ROW EXECUTE PROCEDURE update_with_changes();

