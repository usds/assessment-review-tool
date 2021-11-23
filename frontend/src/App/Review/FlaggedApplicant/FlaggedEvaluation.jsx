import React from "react";
import Textarea from "../../commonComponents/Textarea";

import Button from "../../commonComponents/Button";

const FlaggedApplicant = ({
  applicantName,
  flagDate,
  handleReleaseFromFlag,
  handleEditExplanationButton,
  isFeedbackNoteShowing,
  localFeedbackNote,
  handleUpdateLocalFeedbackNote,
  handleSaveFeedback,
  flagMessage,
  ApplicantStatusIndicator,
  released,
}) => {
  // const editButton = handleEditAssessmentReview && (
  //   <div className="smeqa-rr-hiring-action-justification__edit">
  //     <Button onClick={handleEditAssessmentReview} label="Edit" outline />
  //   </div>
  // );
  const ReleaseButton = (
    <Button
      onClick={handleReleaseFromFlag}
      label="Release"
      outline={false}
      addClass="smeqa-rr-hiring-action-justification__button validate"
      disabled={released}
    />
  );
  const EditNoteButton = (
    <Button
      onClick={handleEditExplanationButton}
      label="Edit Note"
      outline={true}
      addClass="smeqa-rr-hiring-action-justification__button validate"
      disabled={released}
    />
  );

  // const activeEditButtons = handleCancelAssessmentReviewEdit && (
  //   <>
  //     <Button
  //       onClick={
  //         isAssessmentValid
  //           ? handleInvalidateAssessment
  //           : handleValidateAssessment
  //       }
  //       label={isAssessmentValid ? "Request Edit" : "Validate"}
  //       outline
  //     />
  //     <a
  //       href="#cancel"
  //       className="smeqa-rr-hiring-action-justification__cancel"
  //       onClick={handleCancelAssessmentReviewEdit}
  //     >
  //       Cancel
  //     </a>
  //   </>
  // );
  // const validationButtons = assessmentRequiresReview && (
  //   <>
  //     <div className="display-flex flex-column flex-align-center">
  //       <Button
  //         onClick={handleValidateAssessment}
  //         label="Validate"
  //         outline={false}
  //         addClass="smeqa-rr-hiring-action-justification__button validate"
  //       />
  //       <Button
  //         onClick={handleInvalidateAssessment}
  //         label="Request Edit"
  //         outline={true}
  //         addClass="smeqa-rr-hiring-action-justification__button "
  //       />
  //     </div>
  //   </>
  // );
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
              Flag Date
            </h5>
            <p className="smeqa-rr-hiring-action-justification__top-row-value">
              {flagDate}
            </p>
          </div>
          <div className="smeqa-rr-hiring-action-justification__top-row-item">
            <div className="smeqa-rr-hiring-action-justification__status-container">
              {ApplicantStatusIndicator}
            </div>
          </div>
          <div className="smeqa-rr-hiring-action-justification__top-row-item">
            {ReleaseButton}
          </div>
        </div>
        <div className="smeqa-rr-hiring-action-justification__top-row">
          <h5 className="smeqa-rr-hiring-action-justification__top-row-title">
            Flag Reason
          </h5>
        </div>
        <div className="smeqa-rr-hiring-action-justification__top-row">
          <p className="smeqa-rr-hiring-action-justification__top-row-value">
            {flagMessage}
          </p>
        </div>
        <div className="smeqa-rr-hiring-action-justification__sme-note-row maxw-tablet">
          {isFeedbackNoteShowing && !released ? (
            <>
              <Textarea
                value={localFeedbackNote}
                label="Note About Applicants"
                name="flagNote"
                addClass="smeqa-rr-hiring-action-justification__textarea"
                onChange={handleUpdateLocalFeedbackNote}
              />
              <p className="smeqa-rr-hiring-action-justification__sme-note-help">
                This note will be attached to this applicant for all evaluators.
                Please reach out to the evaluator directly if this is not an
                issue with the applicant. Examples of what are appropriate here
                are instructions on how to find a resume, an applicant's name
                correction, etc.
              </p>

              <div className="smeqa-rr-hiring-action-justification__send-btn">
                <Button label="Save Note" onClick={handleSaveFeedback} />
              </div>
            </>
          ) : (
            <>
              <h5>Note to evaluators</h5>
              <p style={{ overflowWrap: "break-word" }}>{localFeedbackNote}</p>
              {EditNoteButton}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlaggedApplicant;
