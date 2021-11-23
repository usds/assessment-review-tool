import React from "react";
import Textarea from "../../commonComponents/Textarea";

import Button from "../../commonComponents/Button";

const AssessmentReview = ({
  isAssessmentValid,
  assessmentRequiresReview,
  applicantName,
  evaluationNote,
  assessmentDate,
  isFeedbackNoteShowing,
  localFeedbackNote,
  AssessmentStatusIndicator,
  isFeedbackButtonShowing,
  handleShowFeedback,
  handleSaveFeedback,
  handleEditAssessmentReview,
  handleCancelAssessmentReviewEdit,
  handleValidateAssessment,
  handleInvalidateAssessment,
  handleUpdateLocalFeedbackNote,
  competencyEvaluations,
}) => {
  const editButton = handleEditAssessmentReview && (
    <div className="smeqa-rr-hiring-action-justification__edit">
      <Button onClick={handleEditAssessmentReview} label="Edit" outline />
    </div>
  );

  const activeEditButtons = handleCancelAssessmentReviewEdit && (
    <>
      <Button
        onClick={
          isAssessmentValid
            ? handleInvalidateAssessment
            : handleValidateAssessment
        }
        label={isAssessmentValid ? "Return Evaluation" : "Validate"}
        outline
      />
      <a
        href="#cancel"
        className="smeqa-rr-hiring-action-justification__cancel"
        onClick={handleCancelAssessmentReviewEdit}
      >
        Cancel
      </a>
    </>
  );
  const validationButtons = assessmentRequiresReview && (
    <>
      <div className="display-flex flex-column flex-align-center">
        <Button
          onClick={handleValidateAssessment}
          label="Validate"
          outline={false}
          addClass="smeqa-rr-hiring-action-justification__button validate"
        />
        <Button
          onClick={handleInvalidateAssessment}
          label="Return Evaluation"
          outline={true}
          addClass="smeqa-rr-hiring-action-justification__button "
        />
      </div>
    </>
  );
  /* <div className="smeqa-rr-hiring-action-justification__top-row">
          <div className="smeqa-rr-hiring-action-justification__top-row-item">
            <h5 className="smeqa-rr-hiring-action-justification__top-row-title">
              Competency
            </h5>
            <p className="smeqa-rr-hiring-action-justification__top-row-value">
              {c.competency_name}
            </p>
          </div>
          <div className="smeqa-rr-hiring-action-justification__top-row-item">
            <h5 className="smeqa-rr-hiring-action-justification__top-row-title">
              Evaluation
            </h5>
            <p className="smeqa-rr-hiring-action-justification__top-row-value">
              {c.competency_selector_name}
            </p>
          </div>
        </div>
        {c.evaluation_note && (
          <div className="smeqa-rr-hiring-action-justification__text-row">
            <h5 className="smeqa-rr-hiring-action-justification__text-row-title">
              Competency Evaluation Justificaiton
            </h5>
            <p
              className="smeqa-rr-hiring-action-justification__text"
              style={{ whiteSpace: "pre-wrap" }}
            >
              {c.evaluation_note}
            </p>
          </div>
        )} */
  const competencyEvaluationNotes = competencyEvaluations.map((c) => {
    return (
      <tr key={c.competency_name}>
        <th scope="row">{c.competency_name}</th>
        <td>{c.competency_selector_name}</td>
        <td>{c.evaluation_note}</td>
      </tr>
    );
  });
  const applicationEvaluationNote = evaluationNote && (
    <div className="smeqa-rr-hiring-action-justification__text-row">
      <h5 className="smeqa-rr-hiring-action-justification__text-row-title">
        Application Evaluation Notes
      </h5>
      <p
        className="smeqa-rr-hiring-action-justification__text"
        style={{ whiteSpace: "pre-wrap" }}
      >
        {evaluationNote}
      </p>
    </div>
  );

  return (
    <div className="smeqa-rr-hiring-action-justification shadow-2 radius-lg">
      <div className="smeqa-rr-hiring-action-justification__body">
        <div className="smeqa-rr-hiring-action-justification__top-row">
          <div className="smeqa-rr-hiring-action-justification__top-row-item">
            <h5 className="smeqa-rr-hiring-action-justification__top-row-title">
              Applicant
            </h5>
            <p className="smeqa-rr-hiring-action-justification__top-row-value">
              {applicantName}
            </p>
          </div>
          <div className="smeqa-rr-hiring-action-justification__top-row-item">
            <h5 className="smeqa-rr-hiring-action-justification__top-row-title">
              Evaluation Date
            </h5>
            <p className="smeqa-rr-hiring-action-justification__top-row-value">
              {assessmentDate}
            </p>
          </div>
          <div className="smeqa-rr-hiring-action-justification__top-row-item">
            <div className="smeqa-rr-hiring-action-justification__status-container">
              {AssessmentStatusIndicator}
            </div>
          </div>
          <div className="smeqa-rr-hiring-action-justification__top-row-item">
            {validationButtons}
            {editButton}
            {activeEditButtons}
          </div>
        </div>
        <table className="usa-table usa-table--borderless usa-table--striped width-full">
          {/* <caption>Competency Evaluations</caption> */}
          <thead>
            <tr>
              <th
                scope="col"
                className="smeqa-rr-hiring-action-justification__top-row-title"
              >
                Competency
              </th>
              <th
                scope="col"
                className="smeqa-rr-hiring-action-justification__top-row-title"
              >
                Evaluation
              </th>
              <th
                scope="col"
                className="smeqa-rr-hiring-action-justification__top-row-title"
              >
                Justification
              </th>
            </tr>
          </thead>
          <tbody>{competencyEvaluationNotes}</tbody>
        </table>
        {applicationEvaluationNote}

        <div className="smeqa-rr-hiring-action-justification__sme-note-row maxw-tablet">
          {isFeedbackNoteShowing ? (
            <>
              <Textarea
                value={localFeedbackNote}
                label="Note to SME"
                name="noteToSME"
                addClass="smeqa-rr-hiring-action-justification__textarea"
                onChange={handleUpdateLocalFeedbackNote}
              />
              <p className="smeqa-rr-hiring-action-justification__sme-note-help">
                Enter a message to the SME explaining why their justification
                needs amendment.
              </p>

              <div className="smeqa-rr-hiring-action-justification__send-btn">
                <Button
                  label="Save and Return Evaluation"
                  onClick={handleSaveFeedback}
                />
              </div>
            </>
          ) : localFeedbackNote ? (
            <>
              <h5>Note to applicant</h5>
              <p>{localFeedbackNote}</p>
              <Button
                label="Edit Evaluation Feedback"
                onClick={handleShowFeedback}
                outline={true}
              />
            </>
          ) : (
            <>
              <Button
                label="Add Evaluation Feedback"
                onClick={handleShowFeedback}
                outline={true}
              />
            </>
          )}
          {/* <div className="smeqa-rr-hiring-action-justification__sme-feedback-button padding-bottom-2">
            {isFeedbackButtonShowing && (
              <Button
                label="Evaluation Feedback"
                onClick={handleShowFeedback}
                outline={true}
              />
            )}
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default AssessmentReview;
