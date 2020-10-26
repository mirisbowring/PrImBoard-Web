export interface Event {
   id?: string;
   title?: string;
   description?: string;
   comments?: Comment[];
   creator?: string;
   groups?: number[];
   timestampCreation?: number;
   timestampStart?: number;
   timestampEnd?: number;
   url?: string;
   urlThumb?: string;
}

export interface EventMessage{
  deleted?: boolean;
  updated?: boolean;
  canceled?: boolean;
  event: Event;
}
