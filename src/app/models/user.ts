export interface User {
  username: string;
  firstname?: string;
  lastname?: string;
  password?: string;
  urlImage?: string;
  token?: string;
  settings?: Settings;
}

export interface Settings {
  ipfsNodes?: IPFSNode[];
}

export interface IPFSNode {
  title?: string;
  username?: string;
  password?: string;
  address?: string;
  ipfsApiPort?: number;
  ipfsApiUrl?: string;
  ipfsGateway?: string;
}
