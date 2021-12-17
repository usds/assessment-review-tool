import React from "react";
import { Link } from "react-router-dom";
import Button from "../commonComponents/Button";

const Metrics = ({
  evaluators,
  reviewers,
  applicants,
  applications,
  assignments,
  departmentName,
  positionName,
  level,
  estimates,
  reviewerStats,
  reviewURL,
}) => {
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
              <Link
                to={reviewURL}
                className="smeqa-rr-home-hiring-action__button-container"
              >
                <Button
                  onClick={() => {}}
                  type="submit"
                  label="Return To Review"
                  addClass="smeqa-rr-home-hiring-action__button"
                />
              </Link>
              {/* <Button
                  onClick={() => this.props.handleExportResults()}
                  outline
                  label="Export hiring action to TAS"
                  addClass="smeqa-rr-hiring-action__button"
                /> */}
            </div>
          </div>
        </div>
      </div>
      <div className="grid-row smeqa-rr-hiring-action__container">
        <div className="smeqa-rr-hiring-action">
          <div className="smeqa-rr-hiring-action__body">
            <section>
              <h3 className="smeqa-rr-hiring-action__title">
                Current Estimated Results
              </h3>
              <dl>
                <dt>Moving Forward Estimate</dt>
                <dd>{estimates.movingForward}</dd>
                <dt>Not Moving Forward Estimate</dt>
                <dd>{estimates.notMoving}</dd>
              </dl>
            </section>
          </div>
        </div>
      </div>
      <div className="grid-row smeqa-rr-hiring-action__container">
        <div className="smeqa-rr-hiring-action">
          <div className="smeqa-rr-hiring-action__body">
            <section>
              <h3 className="smeqa-rr-hiring-action__title">
                Current Assignments
              </h3>
              {assignments.length ? (
                <table>
                  <caption>Current Assignments</caption>
                  <tbody>
                    <tr>
                      <th>Evaluator</th>
                      <th>Applicant</th>
                      <th>Last Updated</th>
                    </tr>
                    {assignments.map((a) => (
                      <tr key={a.id}>
                        <td>{a.evaluator}</td>
                        <td>{a.applicant}</td>
                        <td>{a.updated_at}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No active evaluators</p>
              )}
            </section>
          </div>
        </div>
      </div>
      <div className="grid-row smeqa-rr-hiring-action__container">
        <div className="smeqa-rr-hiring-action">
          <div className="smeqa-rr-hiring-action__body">
            <section>
              <h3 className="smeqa-rr-hiring-action__title">HR Summary</h3>
              <dl>
                <dt>Pending Amendment Reviews</dt>
                <dd>{reviewerStats.pending}</dd>
                <dt>Reviews Adjudicated By HR</dt>
                <dd>{reviewerStats.adjudicated}</dd>
                <dt>Total Reviews</dt>
                <dd>{reviewerStats.pending + reviewerStats.adjudicated}</dd>

                <dt>Needing Review</dt>
                <dd>{reviewerStats.remaining}</dd>
              </dl>
              {reviewers.length ? (
                <table>
                  <caption>HR Activity</caption>
                  <tbody>
                    <tr>
                      <th>Name</th>
                      <th>Pending Amendment</th>
                      <th>Adjudicated</th>
                      <th>Total</th>
                    </tr>
                    {reviewers.map((r) => (
                      <tr key={r.id}>
                        <td>{r.name}</td>
                        <td>{r.pending_amendment}</td>
                        <td>{r.adjudicated}</td>
                        <td>{+r.pending_amendment + +r.adjudicated}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No evaluations reviewed yet</p>
              )}
            </section>
          </div>
        </div>
      </div>
      <section>
        <h3 className="smeqa-rr-hiring-action__title">SME Summary</h3>
        <dl>
          <dt>Total Reviewed by SMEs</dt>
          <dd>
            {evaluators.reduce((sum, e) => {
              return (
                sum + +e.pending_amendment + +e.pending_review + +e.completed
              );
            }, 0)}
          </dd>
          {/* <dt>Estimated Total of Reviews</dt>
          <dd>{totalNeededReviews}</dd> */}
        </dl>
        {evaluators.length ? (
          <table>
            <caption>SME Activity</caption>
            <tbody>
              <tr>
                <th>name</th>
                <th>Pending Amendment</th>
                <th>Pending Review</th>
                <th>Completed</th>
                <th>Recusals</th>
              </tr>
              {evaluators.map((evaluator) => (
                <tr key={evaluator.evaluator}>
                  <td>{evaluator.name}</td>
                  {/* <td>{evaluator.email}</td> */}
                  <td>{evaluator.pending_amendment}</td>
                  <td>{evaluator.pending_review}</td>
                  <td>{evaluator.completed}</td>
                  <td>{evaluator.recusals}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p> No applicants have been evaluated yet</p>
        )}
        <section>
          <h3 className="smeqa-rr-hiring-action__title">Applicant Summary</h3>
          <dl>
            <dt> Completed Applicants: </dt>
            <dd>
              {applicants.filter((a) => a.review_status === "complete").length}
            </dd>
            <dt> Total Number of Applicants: </dt>
            <dd>{applicants.length}</dd>
          </dl>
          {applicants.length ? (
            <>
              <table>
                <caption>Applicant Status</caption>
                <tbody>
                  <tr>
                    <th>Name</th>
                    <th>Evaluation Status</th>
                    <th>Review Status</th>
                    <th>Total Evaluations</th>
                    <th>Total Recused</th>
                    <th>Flagged</th>
                  </tr>
                  {applicants.map((a) => (
                    <tr key={a.id}>
                      <td>{a.name}</td>
                      <td>{a.evaluation_status}</td>
                      <td>{a.review_status}</td>
                      <td>{a.evaluators}</td>
                      <td>{a.recused}</td>
                      <td>{a.flagged && "🚩"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <p>No applications evaluated</p>
          )}
        </section>
      </section>
    </div>
  );
};

export default Metrics;
