import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import HiringActionList from "./HiringActions/HiringActionList";
// import Home from "./Home";
// import Banner from "./commonComponents/Banner";
// import ResumeReview from "./ResumeReview";
import NotFoundComponent from "./NotFoundView";
import LoginPage from "./LoginPage";
// import Loading from "./commonComponents/Loading";
// import HrView from "./HrView";
// // import { getHiringActions } from "../query/hiringActions";
import ErrorBoundary from "./Error/ErrorBoundary";
// import { ErrorContext } from "./Error/ErrorContext";
// import ErrorPage from "./Error/ErrorView";

import { useDispatch, useSelector } from "react-redux";
import { selectUser, login, selectUserStatus } from "./appSlice";
import {
  getHiringActionRole,
  selectHiringActionListStatus,
} from "./HiringActions/hiringActionSlice";

import { USER_ROLES } from "../constants";

import App from "./App";
import Assessment from "./Assessment";
import Review from "./Review";
import Metrics from "./Metrics";

function PrivateHiringActionRoute({ children, user, role, ...rest }) {
  // Get hiring action role
  const hiringActionId = rest.computedMatch.params.hiringActionId;
  const userRole = useSelector(getHiringActionRole(hiringActionId));
  return (
    <Route
      {...rest}
      render={({ location }) => {
        if (userRole !== role) {
          return (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: location },
              }}
            />
          );
        }
        return children;
      }}
    />
  );
}

function PrivateRoute({ children, user, ...rest }) {
  return (
    <Route
      exact
      {...rest}
      render={({ location }) => {
        if (!user) {
          return (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: location },
              }}
            />
          );
        }
        return children;
      }}
    />
  );
}

const AppContainer = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const userStatus = useSelector(selectUserStatus);
  // const error = useSelector(selectUserError);

  const hiringActionListStatus = useSelector(selectHiringActionListStatus);

  useEffect(() => {
    if (userStatus === "idle") {
      dispatch(login());
    }
  });

  const isLoading =
    userStatus === "pending" ||
    userStatus === "idle" ||
    hiringActionListStatus === "pending";
  if (isLoading) {
    return <App isLoading={isLoading}></App>;
  }
  return (
    <ErrorBoundary>
      <Router>
        <Switch>
          {/* Login page will redirect to home page if user is already logged in */}
          <Route
            path="/login"
            render={({ location }) => {
              if (!user) {
                return (
                  <App isLoading={isLoading}>
                    <LoginPage />
                  </App>
                );
              }
              return (
                <Redirect to={{ pathname: "/", state: { from: location } }} />
              );
            }}
          />
          {/* Home page renders all hiring actions (vacancy + assessment) for each user with proper permissions; redirects to login if there is no current user.  */}
          <PrivateRoute exact path="/" user={user}>
            <App
              isLoading={isLoading}
              classNames="usa-layout-docs smeqa-rr__main smeqa-rr-home"
            >
              <HiringActionList />
            </App>
          </PrivateRoute>
          {/* Hiring Action Types */}
          <PrivateHiringActionRoute
            user={user}
            path="/assessment/:hiringActionId/"
            role={USER_ROLES.SME}
          >
            <Assessment />
          </PrivateHiringActionRoute>
          <PrivateHiringActionRoute
            user={user}
            path="/hiring-action/hr/:hiringActionId/review"
            role={USER_ROLES.HR}
          >
            <App>
              <Review />
            </App>
          </PrivateHiringActionRoute>
          <PrivateHiringActionRoute
            user={user}
            path="/hiring-action/metrics/:hiringActionId"
            role={USER_ROLES.HR}
          >
            <App>
              <Metrics />
            </App>
          </PrivateHiringActionRoute>
          {/* METRICS */}
          {/* user level type authorization needs to be handled in the componenet */}
          {/* SME resume review page */}
          {/* HR Review Page */}
          <Route
            render={() => (
              <App>
                <NotFoundComponent />
              </App>
            )}
          />
        </Switch>
      </Router>
    </ErrorBoundary>
  );
};

export default AppContainer;
