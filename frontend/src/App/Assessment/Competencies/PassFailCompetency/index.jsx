import React from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  selectCompetencyDetails,
  updateCompetencyDecision,
  isCompetencyEnabled,
  updateCompetencyEvaluationNote,
} from "../../assessmentSlice";
import PassFailCompetency from "./PassFailCompetency";
import DoesNotMeetSelectors from "../DoesNotMeetSelectors";
import { COMPETENCY_TYPES } from "../../../../constants";

const PassFailCompetencyContainer = ({ id }) => {
  const dispatch = useDispatch();
  const competencyDetails = useSelector(selectCompetencyDetails(id));

  const {
    name,
    definition,
    requiredProficiencyDefinition,
    selectors: allSelectors,
    competencyType,
    evaluation,
  } = competencyDetails;
  const { competency_selector_id, evaluation_note } = evaluation;

  let competencyIsFailing = false;

  const failingSelectors = allSelectors
    .filter((s) => s.point_value === 0)
    .sort(({ sort_order: soa }, { sort_order: sob }) => soa - sob)
    .map((s) => {
      if (s.id === competency_selector_id) {
        competencyIsFailing = true;
      }
      return {
        label: s.display_name,
        value: s.id,
        defaultText: s.default_text,
      };
    });
  const movesSelectors = allSelectors
    .filter((s) => s.point_value > 0)
    .sort(({ sort_order: sa }, { sort_order: sb }) => sa - sb)
    .map((s) => {
      return {
        label: s.display_name,
        value: s.id,
      };
    });
  if (
    competency_selector_id === "failing" ||
    failingSelectors.find((s) => s.id === competency_selector_id)
  ) {
    competencyIsFailing = true;
  }
  const isDisabled = !useSelector(isCompetencyEnabled(id));
  const updateCompetencyDecisionHandler = (e) => {
    const selectorId = e.target.value;
    dispatch(updateCompetencyDecision({ id, selectorId: selectorId }));
    dispatch(updateCompetencyEvaluationNote({ id, note: "" }));
  };

  const justification = competencyIsFailing ? (
    <DoesNotMeetSelectors
      competencyType={competencyType}
      id={id}
      competencyName={name}
      failingSelectors={failingSelectors}
      competency_selector_id={competency_selector_id}
      evaluation_note={evaluation_note}
    />
  ) : null;

  let failureSelector = { value: "failing", label: "No" };
  let localFailureId = competencyIsFailing ? "failing" : competency_selector_id;
  if (competencyType !== COMPETENCY_TYPES.DEFAULT) {
    if (failingSelectors.length !== 1) {
      throw new Error("Must have only one for non-default competencies");
    }
    failureSelector = failingSelectors[0];
    localFailureId = competency_selector_id;
  }
  const selectors = [...movesSelectors, failureSelector];

  return (
    <PassFailCompetency
      name={name}
      definition={definition}
      requiredProficiencyDefinition={requiredProficiencyDefinition}
      competency_selector_id={localFailureId}
      selectors={selectors}
      updateCompetencyDecisionHandler={updateCompetencyDecisionHandler}
      isDisabled={isDisabled}
      doesNotMeetClassToggle={competencyIsFailing && !isDisabled}
    >
      {justification && <div className="does-not-meet"> {justification}</div>}
    </PassFailCompetency>
  );
};
export default PassFailCompetencyContainer;
