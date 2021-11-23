import React from "react";
import { USER_TYPES } from "../config/constants";

export const PermissionContext = React.createContext();

export const generatePermissions = user => {
  // TODO: create separate permissions for test env (so admin can do everything, which isn't desirable in production)

  return {
    resume: {
      canSubmitReview: user && user.type !== USER_TYPES.HR,
      canRecuse: user && user.type !== USER_TYPES.HR,
      canSkip: user && user.type !== USER_TYPES.HR
    },
    hiringAction: {
      canCreate: user && user.type === USER_TYPES.HR,
      canReviewSMEJustifications: user && user.type !== USER_TYPES.SME,
      canEdit: user && user.type === USER_TYPES.HR,
      canView: true, // user && user.type === USER_TYPES.HR,
      canExportResults: user && user.type !== USER_TYPES.SME
    },
    // In general, try not to use these. Be more specific.
    user: {
      email: user && user.email,
      isHR: user && user.type === USER_TYPES.HR,
      isSME: user && user.type === USER_TYPES.SME
    }
  };
};
