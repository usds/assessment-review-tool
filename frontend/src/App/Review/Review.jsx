import React from "react";

import Accordion from "../commonComponents/Accordion";
import Button from "../commonComponents/Button";
import { Link } from "react-router-dom";

const Review = ({
  departmentName,
  positionName,
  level,
  hrStatsLink,
  pendingReviews,
  validReviews,
  invalidReviews,
  flaggedReviews,
  downloadUSASLink,
  downloadAuditLink,
}) => {
  const flaggedDiv = flaggedReviews.length > 0 && (
    <>
      <h2 className="smeqa-rr-hiring-action-justification__title">
        Flagged reviews
      </h2>

      <Accordion
        addClass="smeqa-rr-hiring-action-accordion"
        title={`Flagged reviews (${flaggedReviews.length})`}
      >
        {flaggedReviews}
      </Accordion>

      <hr />
    </>
  );
  // TODO: add other HR review functionality here within tabs
  return (
    <div className="grid-container">
      <div className="grid-row smeqa-rr-hiring-action__container">
        <div className="smeqa-rr-hiring-action">
          <div className="smeqa-rr-hiring-action__body">
            <div className="smeqa-rr-hiring-action__col">
              <h4 className="smeqa-rr-hiring-action__agency">
                {departmentName}
              </h4>
              <h2 className="smeqa-rr-hiring-action__title">{positionName}</h2>
              <p className="smeqa-rr-hiring-action__gs-level">{level}</p>
            </div>
            <div className="smeqa-rr-hiring-action__col right">
              <Link
                to={"/"}
                className="smeqa-rr-home-hiring-action__button-container"
              >
                <Button
                  onClick={() => {}}
                  type="submit"
                  label="Dashboard"
                  addClass="smeqa-rr-home-hiring-action__button"
                />
              </Link>
              {/* TODO: do we show this all the time, or only when the HA is complete? */}
              <Link
                to={hrStatsLink}
                className="smeqa-rr-home-hiring-action__button-container"
              >
                <Button
                  onClick={() => {}}
                  type="submit"
                  label="View Metrics"
                  addClass="smeqa-rr-home-hiring-action__button"
                />
              </Link>
              <a
                href={downloadUSASLink}
                download
                target="_blank"
                rel="noreferrer"
                className="smeqa-rr-home-hiring-action__button-container"
              >
                <Button
                  onClick={() => {}}
                  outline
                  label="Download USAS Export File"
                  addClass="smeqa-rr-home-hiring-action__button"
                />
              </a>
              <a
                href={downloadAuditLink}
                download
                target="_blank"
                rel="noreferrer"
                className="smeqa-rr-home-hiring-action__button-container"
              >
                <Button
                  onClick={() => {}}
                  outline
                  label="Download Audit File"
                  addClass="smeqa-rr-home-hiring-action__button"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="grid-row">
        <div className="smeqa-rr-hiring-action-justifications padding-bottom-8">
          {flaggedDiv}
          <h2 className="smeqa-rr-hiring-action-justification__title">
            Pending reviews
          </h2>

          <Accordion
            addClass="smeqa-rr-hiring-action-accordion"
            title={`Pending reviews (${pendingReviews.length})`}
          >
            {pendingReviews}
          </Accordion>

          <hr />

          <h2 className="smeqa-rr-hiring-action-justification__title">
            Reviews marked as invalid
          </h2>

          <Accordion
            addClass="smeqa-rr-hiring-action-accordion"
            title={`Invalid reviews (${invalidReviews.length})`}
          >
            {invalidReviews}
          </Accordion>

          <hr />

          <h2 className="smeqa-rr-hiring-action-justification__title">
            Validated reviews
          </h2>

          <Accordion
            addClass="smeqa-rr-hiring-action-accordion"
            title={`Valid reviews (${validReviews.length})`}
          >
            {validReviews}
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default Review;
