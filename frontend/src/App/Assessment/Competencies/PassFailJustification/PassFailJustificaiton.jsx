import React from "react";
import classnames from "classnames";

import Accordion from "../../../commonComponents/Accordion";
import RadioGroup from "../../../commonComponents/RadioGroup";
import Alert from "../../../commonComponents/Alert";

const PassFailJustification = ({
  name,
  definition,
  requiredProficiencyDefinition,
  children,
  updateCompetencyDecisionHandler,
  isDisabled,
  // doesNotMeetClassToggle,
  selectors,
  competency_selector_id,
  justifications,
}) => {
  const definitionAccordion =
    definition && definition.length ? (
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

  const horizontal = selectors.length < 3 ? true : false;
  return (
    <div className={classNames}>
      <div className="tablet:grid-col-8">
        <h3 className="smeqa-rr-comp__name">{name}</h3>

        <div
          dangerouslySetInnerHTML={{ __html: requiredProficiencyDefinition }}
        ></div>
        {justifications &&
          justifications.map((j, i) => (
            <Alert
              key={i}
              type="info"
              title={`Review ${i + 1}`}
              body={j.justification}
            ></Alert>
          ))}
        {definitionAccordion}

        {children}
      </div>

      <div className="tablet:grid-col-4">
        <h4 className="smeqa-rr-comp__title--prof">
          Resume reflects this experience?
        </h4>
        <RadioGroup
          buttons={selectors}
          horizontal={horizontal}
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

export default PassFailJustification;
