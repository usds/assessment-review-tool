import React from "react";

import { COMPETENCY_TYPES } from "../../../../constants";
import RadioGroup from "../../../commonComponents/RadioGroup";
import Textarea from "../../../commonComponents/Textarea";
import Button from "../../../commonComponents/Button";
import {
  updateCompetencyDecision,
  updateCompetencyEvaluationNote,
  cancelCompetencyReview,
  selectIsFormComplete,
} from "../../assessmentSlice";

import { useDispatch, useSelector } from "react-redux";

const DoesNotMeetJustification = ({
  id,
  formattedName,
  failingSelectors,
  competencyType,
  competency_selector_id,
  evaluation_note,
}) => {
  const isSubmitVisible = true;
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
  const updateCompetencyEvaluationNoteHandler = (e) => {
    const { value: note } = e.target;
    dispatch(updateCompetencyEvaluationNote({ id, note }));
  };
  const isFormCompleted = useSelector(selectIsFormComplete);

  const submitButton = isSubmitVisible ? (
    <React.Fragment>
      <Button type="submit" label="Finish Review" disabled={!isFormCompleted} />
      <button
        style={{
          background: "none!important",
          border: "none",
          padding: "0!important",
          fontFamily: "arial, sans-serif",
          color: "#069",
          textDecoration: "underline",
          cursor: "pointer",
        }}
        onClick={(e) => {
          e.preventDefault();
          dispatch(cancelCompetencyReview({ id }));
        }}
      >
        Cancel
      </button>
      <h5 className="smeqa-rr-scoring-reason__reminder">
        It is not necessary to review all competencies.
      </h5>
    </React.Fragment>
  ) : null;

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

  const reviewLabel = "Evaluation Note";
  // competencyType === COMPETENCY_TYPES.DEFAULT
  //   ? "Evaluation Note"
  //   : "Evaluation Note";

  return (
    <React.Fragment>
      <fieldset className="usa-fieldset smeqa-rr-scoring-reason">
        {radioSelect}
        <Textarea
          value={evaluation_note}
          label={reviewLabel}
          name={`${id}-does-not-meet-custom-justification`}
          onChange={updateCompetencyEvaluationNoteHandler}
          maxLength={1000}
        />
        {submitButton}
      </fieldset>
    </React.Fragment>
  );
};

export default DoesNotMeetJustification;
