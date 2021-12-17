ALTER TABLE competency
    ADD COLUMN required_competency boolean DEFAULT TRUE
    , ADD COLUMN required_justfification_passing boolean DEFAULT TRUE
    , ADD COLUMN required_justfification_failing boolean DEFAULT TRUE;

ALTER TABLE competency_selectors
    ADD COLUMN placeholder_text VARCHAR DEFAULT NULL;