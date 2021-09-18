import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

import { ReactEditorProps } from "../../models/editor";
import { Code, TargetFramework } from "../../models/compiler";
import ErrorBoundary from "../error-boundary/ErrorBoundary";
import createBundler from "../../utilities/worker";

import "codemirror/mode/jsx/jsx";
import "codemirror/addon/edit/closebrackets";
import "codemirror/keymap/sublime";
import "codemirror/theme/shadowfox.css";

import CustomizableEditor from "./CustomizableEditor";

function ReactEditor({ viewer, codeEditorContext = "test", ...props }: ReactEditorProps) {
  const [worker, setWorker] = useState<any>();
  const renderViewer = (node: JSX.Element) => {
    if (viewer) {
      ReactDOM.render(<ErrorBoundary>{node}</ErrorBoundary>, viewer.current);
    }
  };

  const runBundle = (bundle: string) => {
    try {
      const runner = new Function("render", "require", bundle);
      renderViewer(runner(() => null));
    } catch (err: any) {
      renderViewer(<pre style={{ color: "red" }}>{err.message}</pre>);
    }
  };

  const run = (code: Code) => {
    if (worker) {
      worker.onmessage = (event: any) => {
        runBundle(event.data);
      };
      worker.onerror = (err: any) => {
        renderViewer(<pre style={{ color: "red" }}>{err.message}</pre>);
      };
      worker.postMessage({ code, context: codeEditorContext, target: TargetFramework.REACT });
    }
  };

  const loadDependencies = () => {
    window["React"] = React;
  };

  useEffect(() => {
    loadDependencies();
    const bundler = createBundler();
    setWorker(bundler);
    return () => bundler.terminate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <CustomizableEditor {...props} theme="shadowfox" keyMap="sublime" runCode={run} />;
}

export default ReactEditor;
