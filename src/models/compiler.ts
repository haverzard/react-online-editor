import { FileContainer } from "./file";

export interface FileBundlingOption {
  context: string;
  fileName: string;
}

export interface BundlerOption {
  context: string;
  allowDependencies: boolean;
}

export interface Code {
  app: string;
  files: FileContainer;
}
