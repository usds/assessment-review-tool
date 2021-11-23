import PropTypes from "prop-types";

export const competencyPropType = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string,
  definition: PropTypes.string,
  requiredProficiencyDefinition: PropTypes.string,
  type: PropTypes.number,
});

export const competenciesPropTypes = PropTypes.arrayOf(competencyPropType);

export const applicationPropTypes = PropTypes.shape({
  applicantName: PropTypes.string,
  hrEmail: PropTypes.string,
  usasAppNum: PropTypes.string,
});

export const reviewPropTypes = PropTypes.shape({
  competency: PropTypes.shape({
    value: PropTypes.string,
    rejectionReason: PropTypes.string,
  }),
});

// todo: figure out how to spread props
export const userPropTypes = PropTypes.shape({
  user: PropTypes.shape({
    email: PropTypes.string,
  }),
});

export const hiringActionPropTypes = {
  id: PropTypes.string,
  departmentName: PropTypes.string,
  componentName: PropTypes.string,
  positionName: PropTypes.string,
  minLevel: PropTypes.string,
  maxLevel: PropTypes.string,
  locations: PropTypes.string,
  startDateTime: PropTypes.string,
  endDateTime: PropTypes.string,
  userType: PropTypes.number,
};

export const hiringActionsPropTypes = PropTypes.arrayOf(
  PropTypes.shape(hiringActionPropTypes)
);

export const progressBarPropTypes = PropTypes.shape({
  totalApplicants: PropTypes.number,
  reviewsCompleted: PropTypes.number,
});
