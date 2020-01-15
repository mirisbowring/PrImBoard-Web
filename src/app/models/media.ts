import { Tag } from 'src/app/models/tag';
import { Event } from 'src/app/models/event';

export interface Media {
  _id: string;
  sha1: string;
  title: string;
  description: string;
  creator: string;
  tags: string[];
  events: string[];
  groups: string[];
  timestamp: number;
  timestampUpload: number;
  url: string;
  urlThumb: string;
  type: string;
  format: string;
}
