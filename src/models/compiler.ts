import { FileContainer } from "./file";

export enum TargetFramework {
  REACT,
  VUE,
}

export interface FileBundlingOption {
  context: string;
  target: TargetFramework;
  fileName: string;
}

export interface BundlerOption {
  context: string;
  target: TargetFramework;
  allowDependencies: boolean;
}

export interface Code {
  app: string;
  files: FileContainer;
}
