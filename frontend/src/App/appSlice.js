import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { requestCurrentUser, getCurrentVersion } from "./appRequests";
import { fetchHiringActions } from "./HiringActions/hiringActionSlice";
import { dispatch } from "../store";
// const fakeTimer = () => {
//   return new Promise((resolve, reject) => {
//     setTimeout(resolve, 2000);
//   });
// };
export const login = createAsyncThunk("app/login", async () => {
  const buildVersion = await getCurrentVersion();
  const user = await requestCurrentUser();
  if (user) {
    dispatch(fetchHiringActions());
  }
  return { user, buildVersion };
});

export const appSlice = createSlice({
  name: "app",
  initialState: {
    user: undefined,
    error: "",
    status: "idle",
    buildVersion: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
    },
  },
  extraReducers: {
    [login.pending]: (state, action) => {
      state.status = "pending";
      state.error = "";
    },
    [login.fulfilled]: (state, { payload }) => {
      const { user, buildVersion } = payload;
      state.status = "fulfilled";
      state.error = "";
      state.user = user;
      state.buildVersion = buildVersion;
    },
    [login.rejected]: (state, action) => {
      state.status = "rejectd";
      state.error = action.error.message;
    },
  },
});

export const { logout } = appSlice.actions;

export const selectUser = (state) => state.app.user;
export const selectUserStatus = (state) => state.app.status;
export const selectUserError = (state) => state.app.error;
export const selectVersion = (state) => state.app.buildVersion;
export default appSlice.reducer;
