import { Comment } from 'src/app/models/comment';
// import { User } from 'src/app/models/user';
import { Group } from './group';
import { Node } from './node';

export interface Media {
  id: string;
  sha1: string;
  filename: string;
  filenameThumb?: string;
  title: string;
  description: string;
  comments: Comment[];
  creator: string;
  tags: string[];
  events: string[];
  groups: Group[];
  timestamp: number;
  timestampUpload: number;
  url: string;
  urlThumb: string;
  type: string;
  extension: string;
  contentType: string;
  users?: string[];
  nodes?: Node[];
}

export interface MediaEventMap {
  Events: Event[];
  MediaIDs: string[];
}

export interface MediaGroupMap {
  Groups: Group[];
  MediaIDs: string[];
}
