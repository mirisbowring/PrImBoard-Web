import { Group } from './group';

export interface Node {
  id?: string;
  title?: string;
  creator?: string;
  groupIDs?: string[];
  groups?: Group[];
  type?: string;
  APIEndpoint?: string;
  dataEndpoint?: string;
  userSession?: string;
  secret?:string;
  shown?:boolean;
  new?:boolean;
}
