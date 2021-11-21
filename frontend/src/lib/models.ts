export interface File {
  fileID: number;
  name: string;
  path: string;
  owner: number;
  parentID: number;
  key: FileCryptoData;
}

export interface FileCryptoData {
  header: string;
  keyEnc: string;
  nonce: string;
}

export interface Folder {
  folderID: number;
  name: string;
  path: string;
  owner: number;
  parentID: number;
}

export interface FolderContent {
  files: File[];
  folders: Folder[];
}
