import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getHiringActions } from "./hiringActionRequests";

export const fetchHiringActions = createAsyncThunk(
  "hiringActions/setHiringActions",
  async () => {
    return await getHiringActions();
  }
);

export const hiringActions = createSlice({
  name: "hiringActions",
  initialState: {
    error: "",
    status: "idle",
    hiringActions: [],
  },
  reducers: {},
  extraReducers: {
    [fetchHiringActions.pending]: (state, action) => {
      state.status = "pending";
      state.error = "";
    },
    [fetchHiringActions.fulfilled]: (state, { payload }) => {
      state.status = "fulfilled";
      state.error = "";
      state.hiringActions = payload;
    },
    [fetchHiringActions.rejected]: (state, action) => {
      state.status = "failed";
      state.error = "";
    },
  },
});

export const selectHiringActionListStatus = (state) =>
  state.hiringActions.status;

export const selectAllHiringActions = (state) =>
  state.hiringActions.hiringActions;

export const getHiringActionRole = (id) => (state) => {
  const hiringActions = state.hiringActions.hiringActions;
  const hiringAction = hiringActions.find((ha) => {
    return ha.id === id;
  });
  return hiringAction ? hiringAction.userType : null;
};
export const selectHiringActionDetails = (id) => (state) => {
  return state.hiringActions.hiringActions.find((ha) => ha.id === id);
};
export default hiringActions.reducer;
