import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface DragState {
  from?: string;
  to?: string;
}

const initialState: DragState = {};

const dragSlice = createSlice({
  name: "drag",
  initialState,
  reducers: {
    reset(state) {
      delete state.from;
      delete state.to;
    },
    target(state, action: PayloadAction<string>) {
      state.to = action.payload;
    },
    select(state, action: PayloadAction<string>) {
      state.from = action.payload;
    },
    unselect(state) {
      delete state.to;
    },
    untarget(state) {
      delete state.to;
    },
  },
});

export const { reset, target, select, unselect, untarget } = dragSlice.actions;

export default dragSlice.reducer;
