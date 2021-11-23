import React from "react";

import { COMPETENCY_TYPES } from "../../../../constants";
import RadioGroup from "../../../commonComponents/RadioGroup";
import {
  updateCompetencyDecision,
  updateCompetencyEvaluationNote,
} from "../../assessmentSlice";

import { useDispatch } from "react-redux";

const DoesNotMeetJustification = ({
  id,
  failingSelectors,
  competencyType,
  competency_selector_id,
  evaluation_note,
}) => {
  const dispatch = useDispatch();
  const updateCompetencyDecisionHandler = (e) => {
    const { value: selectorId } = e.target;
    const selector = failingSelectors.find((s) => s.value === selectorId);
    const note =
      evaluation_note && evaluation_note.length
        ? evaluation_note
        : selector.defaultText || "";
    dispatch(updateCompetencyDecision({ id, selectorId }));

    dispatch(updateCompetencyEvaluationNote({ id, note }));
  };

  const radioSelect =
    competencyType === COMPETENCY_TYPES.DEFAULT ? (
      <React.Fragment>
        <legend className="usa-sr-only">
          Failure to meet required level reasons
        </legend>
        <label
          className="usa-label smeqa-rr-scoring-reason__label"
          htmlFor={id}
        ></label>
        <RadioGroup
          buttons={failingSelectors}
          name={`${id}-does-not-meet-reason`}
          selectedRadio={competency_selector_id}
          legend={
            "Select why the applicant did not meet the required proficiency"
          }
          onChange={updateCompetencyDecisionHandler}
        />
      </React.Fragment>
    ) : null;

  return (
    <React.Fragment>
      <fieldset className="usa-fieldset smeqa-rr-scoring-reason">
        {radioSelect}
      </fieldset>
    </React.Fragment>
  );
};

export default DoesNotMeetJustification;
