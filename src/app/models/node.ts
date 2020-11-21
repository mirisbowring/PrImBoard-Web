export interface Node {
  id?: string;
  title?: string;
  creator?: string;
  type?: string;
  username?: string;
  password?: string;
  APIEndpoint?: string;
  dataEndpoint?: string;
  ipfsApiPort?: number;
  ipfsApiUrl?: string;
  ipfsGateway?: string;
  userSession?: string;
}
