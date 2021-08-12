export interface FileContainer {
  [name: string]: string;
}

export interface FileState {
  _files: FileContainer;
  _current: string;
}

export interface FilesSwapRequest {
  from: string;
  to: string;
}
