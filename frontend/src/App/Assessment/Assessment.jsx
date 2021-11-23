import React from "react";
import Footer from "../commonComponents/Footer";

const Assessment = ({ children }) => {
  return (
    <div id="main-wrapper">
      <main
        id="main-content"
        role="main"
        className="usa-layout-docs smeqa-rr__main"
      >
        <div className="smeqa-rr-nav usa-dark-background smeqa-rr__exit-review-header">
          <div className="smeqa-rr-nav__body">
            <a href="/">Exit review</a>
          </div>
        </div>
        {children}
      </main>
      <Footer includeReturnToTop={false} />
    </div>
  );
};
export default Assessment;
