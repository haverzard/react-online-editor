import ReactDOM from "react-dom";

import { ReactEditorProps } from "../../models/editor";
import ErrorBoundary from "../error-boundary/ErrorBoundary";
import { bundleModule } from "../../utilities/compiler";
import { Code } from "../../models/compiler";

import "codemirror/mode/jsx/jsx";
import "codemirror/addon/edit/closebrackets";
import "codemirror/keymap/sublime";
import "codemirror/theme/shadowfox.css";

import CustomizableEditor from "./CustomizableEditor";

function ReactEditor({ viewer, codeEditorContext, ...props }: ReactEditorProps) {
  const renderViewer = (node: JSX.Element) => {
    if (viewer) {
      ReactDOM.render(<ErrorBoundary>{node}</ErrorBoundary>, viewer.current);
    }
  };

  const run = (code: Code) => {
    try {
      const bundleRunner = bundleModule(code, { context: codeEditorContext, allowDependencies: true });
      bundleRunner(
        (node: JSX.Element) => renderViewer(node),
        () => null
      );
    } catch (err: any) {
      renderViewer(<pre style={{ color: "red" }}>{err.message}</pre>);
    }
  };

  return <CustomizableEditor {...props} theme="shadowfox" keyMap="sublime" runCode={run} />;
}

export default ReactEditor;
