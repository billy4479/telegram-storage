export interface File {
  id: number;
  name: string;
  path: string;
  parentID: number;
  userID: number;
}

export interface Folder {
  id: number;
  name: string;
  path: string;
  owner: number;
  parentID: number;
}

export interface FolderContent {
  files: File[];
  folders: Folder[];
}
