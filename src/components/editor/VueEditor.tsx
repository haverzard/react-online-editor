import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import * as Vue from "vue";

import { VueEditorProps } from "../../models/editor";
import ErrorBoundary from "../error-boundary/ErrorBoundary";
import { Code, TargetFramework } from "../../models/compiler";
import createBundler from "../../utilities/worker";

import "codemirror/mode/jsx/jsx";
import "codemirror/addon/edit/closebrackets";
import "codemirror/keymap/sublime";
import "codemirror/theme/shadowfox.css";

import CustomizableEditor from "./CustomizableEditor";

function VueEditor({ viewerId, codeEditorContext = "test", ...props }: VueEditorProps) {
  const [worker, setWorker] = useState<any>();
  const renderViewer = (node: JSX.Element) => {
    ReactDOM.render(<ErrorBoundary>{node}</ErrorBoundary>, document.getElementById(viewerId));
  };

  const runBundle = (bundle: string) => {
    try {
      const runner = new Function("require", bundle);
      const vueElement = runner(() => null);
      vueElement.mount(`#${viewerId}`);
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
      worker.postMessage({ code, context: codeEditorContext, target: TargetFramework.VUE });
    }
  };

  const loadDependencies = () => {
    // @ts-expect-error: Namespace not supported in TS
    window["vue"] = Vue;
  };

  useEffect(() => {
    loadDependencies();
    const bundler = createBundler();
    setWorker(bundler);
    return () => bundler.terminate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <CustomizableEditor {...props} theme="shadowfox" keyMap="sublime" runCode={run} />
    </>
  );
}

export default VueEditor;
