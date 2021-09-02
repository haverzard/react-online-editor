// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React from "react";
import ReactDOM from "react-dom";
import { Controlled as CodeMirror } from "react-codemirror2";
import { transform } from "@babel/standalone";

import FileList from "../file-list/FileList-[TODO-REMOVE]";
import ErrorBoundary from "../error-boundary/ErrorBoundary";
import { ignoreError } from "../../utilities/error";

// import 'codemirror/mode/jsx/jsx'
// import 'codemirror/addon/edit/closebrackets'
// import 'codemirror/keymap/sublime'
// import 'codemirror/theme/shadowfox.css'

import * as styles from "./Editor.module.css";

const CODE_EDITOR_CONTEXT = "code-editor-context";

class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: props.code
        ? {
            mainApp: props.code.mainApp,
            additionals: { ...props.code.additionals },
          }
        : {
            mainApp: "",
            additionals: {},
          },
      current: props.current,
    };
    this.isSolution = props.isSolution;
  }

  componentDidMount() {
    // Catch the global errors thrown by ReactDOM
    // See https://github.com/facebook/react/issues/13681
    window.addEventListener("error", ignoreError);

    this.loadDependencies();
    this.run(this.state.code);
  }

  componentWillUnmount() {
    // Don't forget to remove
    window.removeEventListener("error", ignoreError);
  }

  componentDidUpdate() {
    if (this.props.isSolution !== this.isSolution) {
      this.isSolution = this.props.isSolution;
      this.setState({
        code: { mainApp: this.props.code.mainApp, additionals: { ...this.props.code.additionals } },
        current: this.props.current,
      });
    }
    if (this.props.storageKey) {
      localStorage[`code:${this.props.storageKey}`] = JSON.stringify(this.state.code);
    }
    this.run(this.state.code);
  }

  renderViewer(node) {
    // Fun fact: ReactDOM throws 2 errors here
    ReactDOM.render(<ErrorBoundary>{node}</ErrorBoundary>, this.props.viewer.current);
  }

  compile = (code) => {
    delete window[CODE_EDITOR_CONTEXT];
    window[CODE_EDITOR_CONTEXT] = {};
    let transpiled = "var editorContext = {};\n";

    // Iterate additional files
    Object.keys(code.additionals).forEach((fileName) => {
      // Handle exports
      window[CODE_EDITOR_CONTEXT][fileName] = {};
      let tempTranspiled = transform(code.additionals[fileName], { presets: ["es2015", "react"] }).code;

      // Replace exports init
      tempTranspiled = tempTranspiled.replace(
        'Object.defineProperty(exports, "__esModule", {\n  value: true\n});',
        `window["${CODE_EDITOR_CONTEXT}"]["${fileName}.js"] = {}`
      );

      // Replaces `exports.<something>`
      tempTranspiled = tempTranspiled.replaceAll(/exports\.[a-zA-Z]*[a-zA-Z0-9_-]*/g, (pattern) => {
        const regexModuleName = /exports\.([a-zA-Z]*[a-zA-Z0-9_-]*)/;
        const moduleName = pattern.match(regexModuleName)[1];
        return `window["${CODE_EDITOR_CONTEXT}"]["${fileName}.js"]["${moduleName}"]`;
      });

      tempTranspiled = "  " + tempTranspiled.replaceAll("\n", "\n  ");

      // eslint-disable-next-line no-useless-concat
      transpiled +=
        "\n" +
        `editorContext["${fileName}.js"] = () => {\n${tempTranspiled}\n  return window["${CODE_EDITOR_CONTEXT}"]["${fileName}.js"]\n}`;
    });

    // Main app file
    transpiled += "\n" + transform(code.mainApp, { presets: ["es2015", "react"] }).code;
    transpiled += "\nrender(React.createElement(App, null))";

    // Handle package imports (replaces `require("<something>")`)
    transpiled = transpiled.replaceAll(/require\("[^"]*"\)/g, (pattern) => {
      try {
        const regexPackageName = /require\("([^".]*)"\)/;
        const packageName = pattern.match(regexPackageName)[1];
        if (packageName) {
          return `window["${packageName}"]`;
        }
      } catch {
        const regexFileName = /require\("\.\/([^"]*)"\)/;
        const fileName = pattern.match(regexFileName)[1];
        if (fileName) {
          return `window["${CODE_EDITOR_CONTEXT}"]["${fileName}"] ? window["${CODE_EDITOR_CONTEXT}"]["${fileName}"] : editorContext["${fileName}"]()`;
        }
      }
    });

    /* eslint-disable no-new-func */
    return new Function("render", "require", transpiled);
  };

  run = (code) => {
    try {
      this.compile(code)(
        (node) => this.renderViewer(node),
        () => null
      );
    } catch (err) {
      this.renderViewer(<pre style={{ color: "red" }}>{err.message}</pre>);
    }
  };

  getCurrentCode = () => {
    const current = this.state.current;
    if (current === "App") {
      return this.state.code.mainApp;
    }
    return this.state.code.additionals[current];
  };

  loadDependencies = () => {
    window["React"] = React;
  };

  addFile = (file) => {
    const newAdditionals = this.state.code.additionals;
    newAdditionals[file] = "";
    this.setState({ code: { ...this.state.code, additionals: newAdditionals }, current: file });
  };

  renameFile = (file) => {
    const additionals = this.state.code.additionals;
    let newAdditionals = {};

    // if it's new name -> replace current with new name with same order
    // if it's the same -> do nothing
    if (file !== this.state.current) {
      const keys = Object.keys(additionals);
      keys.forEach((k) => {
        newAdditionals[k === this.state.current ? file : k] = additionals[k];
      });
    } else {
      newAdditionals = additionals;
    }

    this.setState({ current: file, code: { ...this.state.code, additionals: newAdditionals } });
  };

  deleteFile = (file) => {
    // change to App if current file is deleted
    let newCurrent = this.state.current;
    if (file === this.state.current) {
      newCurrent = "App";
    }

    // destroy file reference
    const newAdditionals = this.state.code.additionals;
    delete newAdditionals[file];

    this.setState({ code: { ...this.state.code, additionals: newAdditionals }, current: newCurrent });
  };

  swapFiles = ({ from, to }) => {
    const newAdditionals = {};
    const additionals = this.state.code.additionals;
    const keys = Object.keys(additionals);
    keys.forEach((k) => {
      if (k === from) k = to;
      else if (k === to) k = from;
      newAdditionals[k] = additionals[k];
    });
    this.setState({ code: { ...this.state.code, additionals: newAdditionals } });
  };

  updateFiles = ({ action, file }) => {
    switch (action) {
      case "add":
        this.addFile(file);
        break;
      case "rename":
        this.renameFile(file);
        break;
      case "delete":
        this.deleteFile(file);
        break;
      case "swap":
        this.swapFiles(file);
        break;
      case "new-current":
        this.setState({ current: file });
        break;
      default:
    }
  };

  handleCodeEdit = (_editor, _data, value) => {
    const current = this.state.current;
    if (current === "App") {
      this.setState({ code: { ...this.state.code, mainApp: value } });
      return;
    }

    const newAdditionals = this.state.code.additionals;
    newAdditionals[current] = value;
    this.setState({
      code: {
        mainApp: this.state.code.mainApp,
        additionals: newAdditionals,
      },
    });
  };

  render() {
    const options = {
      mode: { name: "jsx", json: true },
      theme: this.props.theme || "shadowfox",
      keyMap: this.props.keyMap || "sublime",
      lineNumbers: true,
      lineWrapping: true,
      autoCloseBrackets: true,
    };
    const files = ["App"].concat(Object.keys(this.state.code.additionals));
    return (
      <>
        <FileList current={this.state.current} updateFiles={this.updateFiles} files={files} />
        <CodeMirror
          className={styles["codeEditor"]}
          value={this.getCurrentCode()}
          options={options}
          onBeforeChange={this.handleCodeEdit}
        />
      </>
    );
  }
}

export default Editor;
