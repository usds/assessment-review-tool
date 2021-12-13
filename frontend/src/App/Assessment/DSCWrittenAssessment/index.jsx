import React, { useState } from "react";
import WrittenAssessment from "./DSC_WrittenAssessment";

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
  // updateAssessmentEvaluationNote,
  // selectAssessmentEvaluationNote,
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
import PassFailJustification from "../Competencies/DSCPassFailJustification";

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

const WrittenAssessmentContainer = withRouter((props) => {
  const dispatch = useDispatch();
  const { hiringActionId } = props.match.params;

  const formState = useSelector(selectFormState);
  const [competencies, experienceCompetencies] =
    useSelector(selectCompetencies);
  const competencyEls = competencies
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((c) => <PassFailJustification id={c.id} key={c.id} />);
  const experienceEls = experienceCompetencies.map((c) => (
    <PassFailCompetency id={c.id} key={c.id} />
  ));
  const applicantName = useSelector(selectApplicantName);
  const isFormCompleted = useSelector(selectIsFormComplete);

  const isFormDisabled = useSelector(selectIsFormDisabled);
  const isTieBreaker = useSelector(selectTieBreaker);

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
          label: `Total evaluations needed: ${totalEvaluationsNeeded}`,
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
    <WrittenAssessment
      isTieBreaker={isTieBreaker}
      applicantNotes={applicantNotes}
      progressBar={progressBar}
      AssessmentAlert={assessmentAlert}
      handleSubmitReview={handleSubmitReview}
      applicantName={applicantName}
      handleRecuseFromApplication={handleRecuseFromApplication}
      handleFlagReview={handleFlagReview}
      formState={formState}
      isFormCompleted={isFormCompleted}
      isFormDisabled={isFormDisabled}
      competencies={competencyEls}
      experiences={experienceEls}
    />
  );
});

export default WrittenAssessmentContainer;
