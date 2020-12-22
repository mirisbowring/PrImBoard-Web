import { Group } from './group';
import { Event } from './event';
import { Media } from './media';

export interface Message {
  multiselect?: boolean;
  openAccessDialog?: boolean;
  openDeleteDialog?: boolean;
  openTagDialog?: boolean;
  openEventDialog?: boolean;
  openEventEditDialog?: boolean;
  openMediaCarouselDialog?: boolean;
}

export interface AccessMessage {
  canceled?: boolean;
  deleted?: boolean;
  added?: boolean;
  groups: Group[];
}

export interface EventMessage{
  deleted?: boolean;
  updated?: boolean;
  canceled?: boolean;
  event: Event;
}

export interface MediaMessage{
  deleted?: boolean;
  updatedEvents?: boolean;
  updatedGroups?: boolean;
  updatedTags?: boolean;
  canceled?: boolean;
  media: Media[];
}

export interface ModalMessage<T>{
  deleted?: boolean;
  updated?: boolean
  canceled?: boolean;
  data: T;
}
