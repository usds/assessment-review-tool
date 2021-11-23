import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./App/appSlice";
import hiringActionReducer from "./App/HiringActions/hiringActionSlice";
import assessmentReducer from "./App/Assessment/assessmentSlice";
import reviewReducer from "./App/Review/reviewSlice";
import metricsReducer from "./App/Metrics/metricsSlice";

const store = configureStore({
  reducer: {
    app: appReducer,
    hiringActions: hiringActionReducer,
    assessment: assessmentReducer,
    review: reviewReducer,
    metrics: metricsReducer,
  },
});
const dispatch = store.dispatch;

export default store;
export { dispatch };
