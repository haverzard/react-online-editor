import { configureStore } from "@reduxjs/toolkit";

import fileReducer from "./fileSlice";
import dragReducer from "./dragSlice";

const store = configureStore({
  reducer: {
    files: fileReducer,
    drag: dragReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
