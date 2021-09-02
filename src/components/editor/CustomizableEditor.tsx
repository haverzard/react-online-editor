/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Controlled as CodeMirror } from "react-codemirror2";
import { useDispatch, useSelector } from "react-redux";
import "codemirror/lib/codemirror.css";

import { ignoreError } from "../../utilities/error";
import FileList from "../file-list/FileList";
import { CustomizableEditorProps } from "../../models/editor";
import { init, edit } from "../../store/fileSlice";
import { RootState } from "../../store";

import * as styles from "./Editor.module.css";

function CustomizableEditor({
  code,
  currentFile,
  isSolution,
  theme,
  keyMap,
  storageKey,
  runCode,
}: CustomizableEditorProps) {
  const { app, files } = code;
  const [_app, setApp] = useState(app);
  const _files = useSelector((state: RootState) => state.files.container);
  const _current = useSelector((state: RootState) => state.files.current);
  const dispatch = useDispatch();

  const options = {
    mode: { name: "jsx", json: true },
    theme: theme,
    keyMap: keyMap,
    lineNumbers: true,
    lineWrapping: true,
    autoCloseBrackets: true,
  };

  const getCurrentCode = () => {
    if (_current === "App") {
      return _app;
    }
    return _files[_current];
  };

  // TODO: add abstraction here
  const loadDependencies = () => {
    window["React"] = React;
  };

  const editCode = (_editor: any, _data: any, value: string) => {
    if (_current === "App") {
      return setApp(value);
    }
    dispatch(edit(value));
  };

  useEffect(() => {
    window.addEventListener("error", ignoreError);

    loadDependencies();
    dispatch(init({ container: files, current: currentFile }));

    return () => window.removeEventListener("error", ignoreError);
  }, []);

  useEffect(() => {
    runCode({ files: _files, app: _app });
  }, [_files, _app]);

  useEffect(() => {
    setApp(app);
    dispatch(init({ container: files, current: currentFile }));
  }, [isSolution]);

  useEffect(() => {
    if (storageKey) {
      localStorage[`code:${storageKey}`] = JSON.stringify({ app: _app, files: _files });
    }
  }, [_files, _app]);

  return (
    <>
      <FileList />
      <CodeMirror
        className={styles["codeEditor"]}
        value={getCurrentCode()}
        options={options}
        onBeforeChange={editCode}
      />
    </>
  );
}

export default CustomizableEditor;
