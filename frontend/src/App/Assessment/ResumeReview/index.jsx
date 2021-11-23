import React, { useState } from "react";
import ResumeReview from "./ResumeReview";

import { withRouter } from "react-router-dom";
import Button from "../../commonComponents/Button";

import ProgressBar from "../../commonComponents/ProgressBar";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNextAssessment,
  selectApplicantName,
  selectFormState,
  selectSMEProgress,
  selectFormAlert,
  updateAssessmentEvaluationNote,
  selectAssessmentEvaluationNote,
  putRecusalFromReview,
  putFlaggedReview,
  postReviewSubmission,
  selectCompetencies,
  selectIsFormDisabled,
  selectIsFormComplete,
  flagApplicant,
  cancelFlag,
  selectApplicantNotes,
  selectTieBreaker,
} from "../assessmentSlice";
import Alert from "../../commonComponents/Alert";
import PassFailCompetency from "../Competencies/PassFailCompetency";
import Textarea from "../../commonComponents/Textarea";

const AssessmentAlert = (props) => {
  const { hiringActionId } = props;
  const [flagReason, updateFlagReason] = useState("");
  const formDetails = useSelector(selectFormAlert);
  const dispatch = useDispatch();

  if (!formDetails) {
    return null;
  }
  const { title, body, alertType, action } = formDetails;
  let children = null;
  switch (action) {
    case "next":
      children = (
        <Button
          onClick={() => {
            dispatch(fetchNextAssessment(hiringActionId));
          }}
          label="Review next applicant"
        />
      );
      break;
    case "flag":
      children = (
        <div>
          <Textarea
            value={flagReason}
            name="flagFeedback"
            onChange={(e) => {
              updateFlagReason(e.target.value);
            }}
          ></Textarea>
          <Button
            onClick={(e) => {
              e.preventDefault();
              dispatch(cancelFlag());
            }}
            label="Cancel"
          ></Button>
          <Button
            onClick={(e) => {
              e.preventDefault();
              dispatch(putFlaggedReview(flagReason));
            }}
            label="Flag Applicant"
          />
        </div>
      );
      break;
    default:
      break;
  }
  return (
    <Alert type={alertType} title={title} body={body}>
      {children}
    </Alert>
  );
};

const ResumeReviewContainer = withRouter((props) => {
  const dispatch = useDispatch();
  const { hiringActionId } = props.match.params;

  const formState = useSelector(selectFormState);
  const [competencies, experienceCompetencies] =
    useSelector(selectCompetencies);

  const competencyEls = competencies.map((c) => (
    <PassFailCompetency id={c.id} key={c.id} />
  ));
  const experienceEls = experienceCompetencies.map((c) => (
    <PassFailCompetency id={c.id} key={c.id} />
  ));
  const applicantName = useSelector(selectApplicantName);
  const isFormCompleted = useSelector(selectIsFormComplete);

  const isFormDisabled = useSelector(selectIsFormDisabled);
  const isTieBreaker = useSelector(selectTieBreaker);

  // if (!["default", "re-evaluate", "note"].includes(formState)) {
  //   isFormDisabled = true;
  // }
  // const specialties = specialtyCompetencies ? (
  //   <>
  //     <div className="grid-row grid-gap-2 smeqa-rr-row">
  //       <div className="tablet:grid-col-8">
  //         <h2 className="smeqa-rr-comps__title">Specialty Competencies</h2>
  //       </div>
  //     </div>
  //     {specialtyCompetencies}
  //   </>
  // ) : null;

  // always show note

  const assessmentJustification = useSelector(selectAssessmentEvaluationNote);

  const movesForwardNote = (
    <Textarea
      value={assessmentJustification}
      heading="Optional Evaluation Notes"
      label="Provide any comments about the applicant and explain any assumptions you may have made."
      name={`moves-forward-note`}
      onChange={(e) => dispatch(updateAssessmentEvaluationNote(e.target.value))}
      maxLength={1000}
    />
  );

  const {
    totalEvaluated,
    totalEvaluationsNeeded,
    applicantsEvaluatedByUser,
    // totalApplicants
  } = useSelector(selectSMEProgress);
  const progressBar = (
    <React.Fragment>
      <ProgressBar
        total={{
          quantity: totalEvaluationsNeeded,
          label: `Estimated evaluations needed: ${totalEvaluationsNeeded}`,
        }}
        positive={{
          quantity: totalEvaluated,
          label: `Total evaluations completed: ${totalEvaluated}`,
        }}
        comment={`Applicants reviewed by you: ${applicantsEvaluatedByUser}`}
      />
    </React.Fragment>
  );
  const handleRecuseFromApplication = (e) => {
    e.preventDefault();
    dispatch(putRecusalFromReview());
  };
  const handleFlagReview = (e) => {
    e.preventDefault();
    dispatch(flagApplicant());
    window.scrollTo(0, 0);
  };
  const handleSubmitReview = (e) => {
    e.preventDefault();
    dispatch(postReviewSubmission());
  };
  const assessmentAlert = <AssessmentAlert hiringActionId={hiringActionId} />;

  const applicantNotes = useSelector(selectApplicantNotes);
  return (
    <ResumeReview
      isTieBreaker={isTieBreaker}
      applicantNotes={applicantNotes}
      progressBar={progressBar}
      AssessmentAlert={assessmentAlert}
      handleSubmitReview={handleSubmitReview}
      applicantName={applicantName}
      handleRecuseFromApplication={handleRecuseFromApplication}
      handleFlagReview={handleFlagReview}
      formState={formState}
      movesForwardNote={movesForwardNote}
      isFormCompleted={isFormCompleted}
      isFormDisabled={isFormDisabled}
      competencies={competencyEls}
      experiences={experienceEls}
    />
  );
});

export default ResumeReviewContainer;
