import React from "react";
import { useSelector } from "react-redux";
import { selectUser } from "./appSlice";
import Banner from "./commonComponents/Banner";
import Footer from "./commonComponents/Footer";
import Header from "./commonComponents/Header";
import Loading from "./commonComponents/Loading";

const App = ({ children, isLoading, classNames }) => {
  const user = useSelector(selectUser);
  return (
    <div className="App">
      <a className="usa-skipnav" href="#main-content">
        Skip to main content
      </a>
      <Loading isLoading={isLoading}>
        <div id="main-wrapper">
          <Banner />
          <Header user={user} />
          <main id="main-content" role="main" className={classNames}>
            {children}
          </main>

          <Footer includeReturnToTop={false} />
        </div>
      </Loading>
    </div>
  );
};

export default App;
