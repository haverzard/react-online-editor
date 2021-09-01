import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { FileContainer, FilesSwapRequest } from "../models/file";

export interface FileState {
  container: FileContainer;
  current: string;
}

const initialState: FileState = { container: {}, current: "App" };

const fileSlice = createSlice({
  name: "file",
  initialState,
  reducers: {
    init(state, action: PayloadAction<FileState>) {
      const { container, current } = action.payload;
      state.container = container;
      state.current = current;
    },
    rename(state, action: PayloadAction<string>) {
      const { current, container } = state;
      const fileName = action.payload;

      const names = Object.keys(state.container);
      const newContainer: FileContainer = {};
      names.forEach((name) => {
        const newName = name === current ? fileName : name;
        newContainer[newName] = container[name];
      });

      state.container = newContainer;
      state.current = fileName;
    },
    remove(state, action: PayloadAction<string>) {
      const { current, container } = state;
      const fileName = action.payload;

      let newCurrent = current;
      if (fileName === newCurrent) {
        newCurrent = "App";
      }
      const newContainer: FileContainer = { ...container };
      delete newContainer[fileName];

      state.container = newContainer;
      state.current = newCurrent;
    },
    add(state, action: PayloadAction<string>) {
      const { container } = state;
      const fileName = action.payload;

      const newContainer: FileContainer = { ...container, [fileName]: "" };

      state.container = newContainer;
      state.current = fileName;
    },
    swap(state, action: PayloadAction<FilesSwapRequest>) {
      const { container } = state;
      const { from, to } = action.payload;

      const names = Object.keys(container);
      const newContainer: FileContainer = {};
      names.forEach((name) => {
        if (name === from) name = to;
        else if (name === to) name = from;
        newContainer[name] = container[name];
      });

      state.container = newContainer;
    },
    view(state, action: PayloadAction<string>) {
      state.current = action.payload;
    },
    edit(state, action: PayloadAction<string>) {
      const { current } = state;
      state.container[current] = action.payload;
    },
  },
});

export const { init, rename, remove, add, swap, view, edit } = fileSlice.actions;

export default fileSlice.reducer;
