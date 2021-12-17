import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  fetchMetrics,
  selectMetrics,
  selectMetricsStatus,
  selectCurrentHiringActionId,
} from "./metricsSlice";
import Loading from "../commonComponents/Loading";
import Metrics from "./Metrics";
import { selectHiringActionDetails } from "../HiringActions/hiringActionSlice";

const MetricsContainer = (props) => {
  const dispatch = useDispatch();
  const { hiringActionId } = props.match.params;
  const currentHiringAction = useSelector(selectCurrentHiringActionId);

  const metricsStatus = useSelector(selectMetricsStatus);

  const hiringActionInfo =
    useSelector(selectHiringActionDetails(hiringActionId)) || {};
  //     assessment_name
  // position_name
  // department_name
  // component_name
  // position_details
  const {
    department_name: departmentName,
    position_name: positionName,
    position_details: level,
  } = hiringActionInfo;
  const reviewURL = `/hiring-action/hr/${hiringActionId}/review`;

  const isLoading = metricsStatus === "pending" || metricsStatus === "idle";
  useEffect(() => {
    if (metricsStatus === "idle" || hiringActionId !== currentHiringAction) {
      dispatch(fetchMetrics(hiringActionId));
    }
  });
  const { evaluators, reviewers, applicants, applications, assignments } =
    useSelector(selectMetrics);
  let estimates = {};
  let reviewerStats = {};
  if (!isLoading) {
    estimates =
      applicants &&
      applicants.reduce(
        (memo, a) => {
          switch (a.evaluation_status) {
            case "meets":
              memo.movingForward++;
              break;
            case "does_not_meet":
              memo.notMoving++;
              break;
            default:
              break;
          }
          return memo;
        },
        { movingForward: 0, notMoving: 0 }
      );
    reviewerStats = reviewers.reduce(
      (memo, reviewer) => {
        memo.pending += +reviewer.pending_amendment;
        memo.adjudicated += +reviewer.adjudicated;
        return memo;
      },
      { pending: 0, adjudicated: 0 }
    );
    reviewerStats.remaining = evaluators.reduce(
      (sum, e) => sum + +e.pending_review,
      0
    );
  }

  return (
    <Loading isLoading={isLoading}>
      {!isLoading && (
        <Metrics
          reviewURL={reviewURL}
          departmentName={departmentName}
          positionName={positionName}
          level={level}
          evaluators={evaluators}
          reviewers={reviewers.filter((r) => r.reviewer_id)}
          applicants={applicants}
          applications={applications}
          assignments={assignments}
          estimates={estimates}
          reviewerStats={reviewerStats}
        />
      )}
    </Loading>
  );
};

export default withRouter(MetricsContainer);
