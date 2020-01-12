import { User } from './user';

export class Event {

  constructor(
    public id: string,
    public title: string,
    public description: string,
    public comments: Comment[],
    public creator: string,
    public groups: number[],
    public timestampCreation: number,
    public timestampStart: number,
    public timestampEnd: number,
    public url: string,
    public urlthumb: string
  ) { }
}

export interface EventJson {
  _id: string;
  title: string;
  description: string;
  comments: Comment[];
  creator: string;
  groups: number[];
  timestamp_creation: number;
  timestamp_start: number;
  timestamp_end: number;
  url: string;
  url_thumb: string;
}
