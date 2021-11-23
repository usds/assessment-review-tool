import React from "react";

import { useSelector } from "react-redux";
import { selectAllHiringActions } from "../hiringActionSlice";
import HiringActionOverview from "./HiringActionOverview";
import HiringActionList from "./HiringActionList";

// import { exportResults } from "../utils/exportResults";

// import Header from "../commonComponents/Header";
// import Banner from "../commonComponents/Banner";
// import Footer from "../commonComponents/Footer";

const HiringActionListContainer = () => {
  const hiringActionDetails = useSelector(selectAllHiringActions);
  const hiringActions = hiringActionDetails.map((action) => (
    <HiringActionOverview
      {...action}
      key={`hiring-action-overview-${action.id}`}
    />
  ));

  return <HiringActionList hiringActions={hiringActions} />;
};

export default HiringActionListContainer;
