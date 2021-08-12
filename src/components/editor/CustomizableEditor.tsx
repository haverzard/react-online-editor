// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Controlled as CodeMirror } from "react-codemirror2";
import { transform } from "@babel/standalone";

import { FileContainer, FilesSwapRequest, FileState } from "../../models/file";
import { ignoreError } from "../../utilities/error";
import FileList from "../file-list/FileList";
import ErrorBoundary from "../error-boundary/ErrorBoundary";

import * as styles from "./Editor.module.css";

// import 'codemirror/mode/jsx/jsx'
// import 'codemirror/addon/edit/closebrackets'
// import 'codemirror/keymap/sublime'
// import 'codemirror/theme/shadowfox.css'

const CODE_EDITOR_CONTEXT: any = "code-editor-context";

function CustomizableEditor({ code, currentFile, isSolution, theme, keyMap, storageKey }) {
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
    ReactDOM.render(<ErrorBoundary>{node}</ErrorBoundary>, current);
  };

  const compile = ({ files, app }) => {
    delete window[CODE_EDITOR_CONTEXT];
    window[CODE_EDITOR_CONTEXT] = {} as any;
    let transpiled = "var editorContext = {};\n";

    // Iterate additional files
    Object.keys(files).forEach((name: any) => {
      // Handle exports
      window[CODE_EDITOR_CONTEXT][name] = {} as any;
      let tempTranspiled = transform(files[name], { presets: ["es2015", "react"] }).code || "";

      // Replace exports init
      tempTranspiled = tempTranspiled.replace(
        'Object.defineProperty(exports, "__esModule", {\n  value: true\n});',
        `window["${CODE_EDITOR_CONTEXT}"]["${name}.js"] = {}`
      );

      // Replaces `exports.<something>`
      tempTranspiled = tempTranspiled.replaceAll(/exports\.[a-zA-Z]*[a-zA-Z0-9_-]*/g, (pattern) => {
        const regexModuleName = /exports\.([a-zA-Z]*[a-zA-Z0-9_-]*)/;
        const moduleName = pattern.match(regexModuleName) || [];
        return `window["${CODE_EDITOR_CONTEXT}"]["${name}.js"]["${moduleName[1]}"]`;
      });

      tempTranspiled = "  " + tempTranspiled.replaceAll("\n", "\n  ");

      // eslint-disable-next-line no-useless-concat
      transpiled +=
        "\n" +
        `editorContext["${name}.js"] = () => {\n${tempTranspiled}\n  return window["${CODE_EDITOR_CONTEXT}"]["${name}.js"]\n}`;
    });

    // Main app file
    transpiled += "\n" + transform(app, { presets: ["es2015", "react"] }).code;
    transpiled += "\nrender(React.createElement(App, null))";

    // Handle package imports (replaces `require("<something>")`)
    transpiled = transpiled.replaceAll(/require\("[^"]*"\)/g, (pattern) => {
      try {
        const regexPackageName = /require\("([^".]*)"\)/;
        const packageName = pattern.match(regexPackageName) || [];
        return `window["${packageName[1]}"]`;
      } catch {
        const regexFileName = /require\("\.\/([^"]*)"\)/;
        const fileNameRes = pattern.match(regexFileName) || [];
        const fileName = fileNameRes[1];
        return `window["${CODE_EDITOR_CONTEXT}"]["${fileName}"] ? window["${CODE_EDITOR_CONTEXT}"]["${fileName}"] : editorContext["${fileName}"]()`;
      }
    });

    /* eslint-disable no-new-func */
    return new Function("render", "require", transpiled);
  };

  const run = (code) => {
    try {
      compile(code)(
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
    const newFiles = files;
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

  const updateFiles = ({ action, file }) => {
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
      localStorage[`code:${storageKey}`] = JSON.stringify({ app, files });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSolution]);

  return (
    <>
      <FileList current={current} updateFiles={updateFiles} files={filenames} />
      <CodeMirror
        className={styles["codeEditor"]}
        value={getCurrentCode()}
        options={options}
        onBeforeChange={handleCodeEdit}
      />
    </>
  );
}

export default CustomizableEditor;
