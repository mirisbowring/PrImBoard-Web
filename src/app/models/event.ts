export interface Event {
   id: string;
   title: string;
   description: string;
   comments: Comment[];
   creator: string;
   groups: number[];
   timestampCreation: number;
   timestampStart: number;
   timestampEnd: number;
   url: string;
   urlThumb: string;
}
