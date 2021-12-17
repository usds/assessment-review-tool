ALTER TABLE assessment_hurdle_meta
    DROP COLUMN staffing_pass_nor
    , DROP COLUMN staffing_fail_nor;
ALTER TABLE specialty
    DROP COLUMN points_required
    , ADD COLUMN does_not_meet_points INT DEFAULT 0
    , ADD COLUMN does_not_meet_nor varchar DEFAULT 'FAIL'
    , ADD COLUMN meets_points INT DEFAULT 1
    , ADD COLUMN meets_nor varchar DEFAULT 'MEETS'
    , ADD COLUMN exceeds_points INT DEFAULT 1
    , ADD COLUMN exceeds_nor VARCHAR DEFAULT 'MEETS';

ALTER TABLE application_assignments
    ALTER active SET DEFAULT TRUE
;