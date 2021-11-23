import React from "react";
import LoadingOverlay from "react-loading-overlay";

/**
 *
 * @param {isLoading} boolean
 *
 * TODO: add proptypes
 */
const Loading = ({ isLoading, children }) => {
  return (
    <LoadingOverlay active={isLoading} spinner text="Loading...">
      {children}
    </LoadingOverlay>
  );
};

export default Loading;
