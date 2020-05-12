import { Tag } from 'src/app/models/tag';
import { Comment } from 'src/app/models/comment';
import { Event } from 'src/app/models/event';
import { User } from 'src/app/models/user';
import { Group } from './group';

export interface Media {
  id: string;
  sha1: string;
  title: string;
  description: string;
  comments: Comment[];
  creator: string;
  tags: Tag[];
  events: string[];
  groups: Group[];
  timestamp: number;
  timestampUpload: number;
  url: string;
  urlThumb: string;
  type: string;
  format: string;
  users?: User[];
}
