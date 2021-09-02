import { RefObject } from "react";
import { Container } from "react-dom";

import { Code } from "./compiler";

export interface CustomizableEditorProps {
  code: Code;
  currentFile: string;
  viewer: RefObject<Container>;
  isSolution: boolean;
  theme: string;
  keyMap: string;
  storageKey: string;
  codeEditorContext: string;
}
