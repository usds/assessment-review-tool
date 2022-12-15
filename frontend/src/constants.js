export const BASE_URL = "/api";
export const USER_ROLES = {
  ADMIN: 0,
  HR: 1,
  SME: 2,
};

// value of keys used in the review object
export const COMPETENCY_REVIEW_KEYS = {
  DECISION: "decision",
  DOES_NOT_MEET_REASON: "doesNotMeetReason",
  DOES_NOT_MEET_CUSTOM_JUSTIFICATION: "doesNotMeetCustomJustification",
};

// values of radio button
export const COMPETENCY_REVIEW_STATUS = {
  EXCEEDS: "exceeds",
  MEETS: "meets",
  DOES_NOT_MEET: "does_not_meet",
};

export const ASSESSMENT_TYPES = {
  RR_DEFAULT: 1,
  WRITTEN_ASSESSMENT: 2,
  ASYNC_INTERVIEW: 3,
  INTERVIEW: 4,
};

// values of jobRoleTyoes
export const SPECIALTY_TYPES = {
  INACTIVE: 0,
  CORE: 1,
  PARENTHETICAL: 2,
};
export const COMPETENCY_TYPES = {
  INACTIVE: 0,
  DEFAULT: 1,
  EXPERIENCE: 2,
  REQUIRE_JUSTIFICATION: 3,
  UNGRADED_COMMENTARY: 4,
};

export const NO_EVIDENCE = "noEvidence";
export const DOES_NOT_MEET_REQUIRED_LEVEL = "doesNotMeetRequiredLevel";

export const DOES_NOT_MEET_REASONS_TEXT = {
  [NO_EVIDENCE]: "No evidence of this competency",
  [DOES_NOT_MEET_REQUIRED_LEVEL]: "Doesn't meet the required proficiency level",
};
