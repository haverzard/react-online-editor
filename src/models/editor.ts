import { RefObject } from "react";
import { Container } from "react-dom";

import { Code } from "./compiler";

interface EditorProps {
  code: Code;
  currentFile: string;
  isSolution: boolean;
  storageKey: string;
}

export interface CustomizableEditorProps extends EditorProps {
  runCode: (code: Code) => void;
  theme: string;
  keyMap: string;
}

export interface ReactEditorProps extends EditorProps {
  viewer: RefObject<Container>;
  codeEditorContext: string;
}
