import React from "react";
import classnames from "classnames";

import Accordion from "../../../commonComponents/Accordion";
import RadioGroup from "../../../commonComponents/RadioGroup";

const PassFailCompetency = ({
  name,
  definition,
  requiredProficiencyDefinition,
  children,
  updateCompetencyDecisionHandler,
  isDisabled,
  doesNotMeetClassToggle,
  selectors,
  competency_selector_id,
}) => {
  const definitionAccordion = definition ? (
    <Accordion title="Competency Definition" isDrawer={true}>
      <div dangerouslySetInnerHTML={{ __html: definition }}></div>
    </Accordion>
  ) : null;
  let classNames = classnames({
    "grid-row": true,
    "grid-gap-2": true,
    "smeqa-rr-comp": true,
    // "does-not-meet": doesNotMeetClassToggle,
  });
  return (
    <div className={classNames}>
      <div className="tablet:grid-col-8">
        <h3 className="smeqa-rr-comp__name">{name}</h3>
        {definition.length ? (
          <h5 className="smeqa-rr-comp__required-level">
            Minimum proficiency level:
          </h5>
        ) : null}
        <div
          dangerouslySetInnerHTML={{ __html: requiredProficiencyDefinition }}
        ></div>
        {definitionAccordion}
        {children}
      </div>

      <div className="tablet:grid-col-4">
        <h4 className="smeqa-rr-comp__title--prof">Meets required level?</h4>
        <RadioGroup
          buttons={selectors}
          horizontal
          name={name}
          selectedRadio={competency_selector_id}
          legend={"Please make a proficiency determination"}
          disabled={isDisabled}
          onChange={updateCompetencyDecisionHandler}
        />
      </div>
    </div>
  );
};

export default PassFailCompetency;
