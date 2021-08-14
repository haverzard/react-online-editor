import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Controlled as CodeMirror } from "react-codemirror2";

import { FileContainer, FilesSwapRequest, FileState } from "../../models/file";
import { ignoreError } from "../../utilities/error";
import FileList from "../file-list/CFileList";
import ErrorBoundary from "../error-boundary/ErrorBoundary";
import { bundleModule } from "../../utilities/compiler";
import { Code } from "../../models/compiler";

import * as styles from "./Editor.module.css";
// import 'codemirror/mode/jsx/jsx'
// import 'codemirror/addon/edit/closebrackets'
// import 'codemirror/keymap/sublime'
// import 'codemirror/theme/shadowfox.css'

const CODE_EDITOR_CONTEXT: any = "code-editor-context";

function CustomizableEditor3({ code, currentFile, viewer, isSolution, theme, keyMap, storageKey }: any) {
  const { mainApp, additionals } = code;
  const [app, setApp] = useState(mainApp);
  const [files, setFiles] = useState<FileContainer>(additionals);
  const [current, setCurrent] = useState(currentFile);
  const options = {
    mode: { name: "jsx", json: true },
    theme: theme,
    keyMap: keyMap,
    lineNumbers: true,
    lineWrapping: true,
    autoCloseBrackets: true,
  };
  const filenames = ["App"].concat(Object.keys(files));

  const setFileState = ({ _files, _current }: FileState) => {
    setFiles(_files);
    setCurrent(_current);
  };

  const renderViewer = (node: JSX.Element) => {
    // Fun fact: ReactDOM throws 2 errors here
    ReactDOM.render(<ErrorBoundary>{node}</ErrorBoundary>, viewer.current);
  };

  const run = (code: Code) => {
    try {
      const bundle = bundleModule(code, { context: CODE_EDITOR_CONTEXT, allowDependencies: true });
      bundle(
        (node: JSX.Element) => renderViewer(node),
        () => null
      );
    } catch (err) {
      renderViewer(<pre style={{ color: "red" }}>{err.message}</pre>);
    }
  };

  const getCurrentCode = () => {
    if (current === "App") {
      return app;
    }
    return files[current];
  };

  const loadDependencies = () => {
    window["React"] = React;
  };

  const addFile = (file: string) => {
    const newFiles = files;
    newFiles[file] = "";
    setFileState({ _files: newFiles, _current: file });
  };

  const renameFile = (file: string) => {
    let newFiles: FileContainer = {};

    // if it's new name -> replace current with new name with same order
    // if it's the same -> do nothing
    if (file !== current) {
      const names = Object.keys(files);
      names.forEach((name) => {
        const newName = name === current ? file : name;
        newFiles[newName] = files[name];
      });
    } else {
      newFiles = files;
    }

    setFileState({ _files: newFiles, _current: file });
  };

  const deleteFile = (file: string) => {
    // change to App if current file is deleted
    let newCurrent = current;
    if (file === current) {
      newCurrent = "App";
    }

    // destroy file reference
    const newFiles = { ...files };
    delete newFiles[file];

    setFileState({ _files: newFiles, _current: newCurrent });
  };

  const swapFiles = ({ from, to }: FilesSwapRequest) => {
    const newFiles: FileContainer = {};
    const names = Object.keys(files);
    names.forEach((name) => {
      if (name === from) name = to;
      else if (name === to) name = from;
      newFiles[name] = files[name];
    });
    setFiles(newFiles);
  };

  const updateFiles = ({ action, file }: any) => {
    switch (action) {
      case "add":
        addFile(file);
        break;
      case "rename":
        renameFile(file);
        break;
      case "delete":
        deleteFile(file);
        break;
      case "swap":
        swapFiles(file);
        break;
      case "new-current":
        setCurrent(file);
        break;
      default:
    }
  };

  const handleCodeEdit = (_editor: any, _data: any, value: string) => {
    if (current === "App") {
      setApp(value);
      return;
    }

    const newFiles = files;
    newFiles[current] = value;
    setFiles(newFiles);
  };

  useEffect(() => {
    window.addEventListener("error", ignoreError);

    loadDependencies();

    return () => window.removeEventListener("error", ignoreError);
  }, []);

  useEffect(() => {
    run({ files, app });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files, app]);

  useEffect(() => {
    setApp(mainApp);
    setFiles(additionals);
    setCurrent(currentFile);
    if (storageKey) {
      localStorage[`code:${storageKey}`] = JSON.stringify({ mainApp: app, additionals: files });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSolution]);

  return (
    <>
      <FileList current={current} updateFiles={updateFiles} names={filenames} />
      <CodeMirror
        className={styles["codeEditor"]}
        value={getCurrentCode()}
        options={options}
        onBeforeChange={handleCodeEdit}
      />
    </>
  );
}

export default CustomizableEditor3;
