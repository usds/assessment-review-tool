import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  selectCompetencyDetails,
  updateCompetencyDecision,
  isCompetencyEnabled,
  updateCompetencyEvaluationNote,
} from "../../assessmentSlice";
import PassFailJustification from "./PassFailJustificaiton";
import { COMPETENCY_TYPES } from "../../../../constants";
import Textarea from "../../../commonComponents/Textarea";

const PassFailJustificationContainer = ({ id }) => {
  const dispatch = useDispatch();
  const competencyDetails = useSelector(selectCompetencyDetails(id));
  const {
    name,
    definition,
    requiredProficiencyDefinition,
    selectors: allSelectors,
    competencyType,
    evaluation,
    justifications,
  } = competencyDetails;
  const { competency_selector_id, evaluation_note } = evaluation;
  const [placeholder, setPlaceholder] = useState("");

  let competencyIsFailing = false;

  const selectors = [...allSelectors]
    .sort((sa, sb) => sb.sort_order - sa.sort_order)
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
    <PassFailJustification
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
    </PassFailJustification>
  );
};
export default PassFailJustificationContainer;
