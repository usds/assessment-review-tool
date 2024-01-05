import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  selectCompetencyDetails,
  updateCompetencyDecision,
  isCompetencyEnabled,
  updateCompetencyEvaluationNote,
} from "../../assessmentSlice";
import UngradedCompetency from "./UngradedCompetency";
// import { COMPETENCY_TYPES } from "../../../../constants";
import Textarea from "../../../commonComponents/Textarea";

const UngradedCompetencyContainer = ({ id }) => {
  const dispatch = useDispatch();
  const competencyDetails = useSelector(selectCompetencyDetails(id));
  const {
    name,
    definition,
    requiredProficiencyDefinition,
    selectors: allSelectors,
    // competencyType,
    evaluation,
    justifications,
  } = competencyDetails;
  const { competency_selector_id, evaluation_note } = evaluation;
  const [placeholder, setPlaceholder] = useState("");

  let competencyIsFailing = false;

  const selectors = [...allSelectors]
    .sort(({ sort_order: soa }, { sort_order: sob }) => soa - sob)
    .map((s) => {
      return {
        label: s.display_name,
        value: s.id,
        defaultText: s.default_text || "",
        placeholderText: s.placeholder_text || "",
      };
    });
  const defaultTexts = selectors.reduce((memo, s) => {
    memo[s.defaultText || ""] = true;
    return memo;
  }, {});
  console.log(selectors.length)

  if (selectors.length === 1 && !competency_selector_id) {
    // const selectorId = selectors[0].value;
    const selector = selectors[0];
    setPlaceholder(selector.placeholderText);
    dispatch(updateCompetencyDecision({ id, selectorId: selector.value }));
    if (
      !evaluation_note ||
      !evaluation_note.length ||
      defaultTexts[evaluation_note]
    ) {
      dispatch(
        updateCompetencyEvaluationNote({ id, note: selector.defaultText || "" })
      );
    }

  }


  const isDisabled = !useSelector(isCompetencyEnabled(id));
  const updateCompetencyDecisionHandler = (e) => {
    const selectorId = e.target.value;

    const selector = selectors.find((s) => s.value === selectorId);
    setPlaceholder(selector.placeholderText);

    dispatch(updateCompetencyDecision({ id, selectorId: selectorId }));
    // If there is no evaluation note:
    // Or if the note is a default note.
    if (
      !evaluation_note ||
      !evaluation_note.length ||
      defaultTexts[evaluation_note]
    ) {
      dispatch(
        updateCompetencyEvaluationNote({ id, note: selector.defaultText || "" })
      );
    }
  };
  const updateCompetencyEvaluationNoteHandler = (e) => {
    const { value: note } = e.target;
    dispatch(updateCompetencyEvaluationNote({ id, note }));
  };
  return (
    <UngradedCompetency
      name={name}
      definition={definition}
      requiredProficiencyDefinition={requiredProficiencyDefinition}
      competency_selector_id={competency_selector_id}
      selectors={selectors}
      updateCompetencyDecisionHandler={updateCompetencyDecisionHandler}
      isDisabled={isDisabled}
      doesNotMeetClassToggle={competencyIsFailing && !isDisabled}
      justifications={justifications}
    >
      <fieldset className="usa-fieldset smeqa-rr-scoring-reason">
        <Textarea
          value={evaluation_note}
          label={"Evaluation Justification"}
          name={`${id}-justification`}
          onChange={updateCompetencyEvaluationNoteHandler}
          maxLength={1000}
          placeholder={placeholder}
        />
      </fieldset>
    </UngradedCompetency>
  );
};
export default UngradedCompetencyContainer;
