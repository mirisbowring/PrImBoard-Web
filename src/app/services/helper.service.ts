import { Injectable } from '@angular/core';
import { Group } from '../models/group';
import { Event } from '../models/event';
import { Media } from '../models/media';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  static removeItem<T>(item: T, list: T[]): T[] {
    const index = list.indexOf(item);
    if (index >= 0) {
      list.splice(index, 1);
    }
    return list;
  }

  /** Removes trailing and leading whitespaces and ignore duplicates, lowers case */
  static tidyEvents(myArr: Event[]): Event[] {
    return myArr.filter((thing, index, self) => self.findIndex(t => t.id === thing.id) === index);
  }

  /** Removes trailing and leading whitespaces and ignores duplicates */
  static tidyGroups(groups: Group[]): Group[] {
    for (const group of groups) {
      group.title = group.title.trim();
    }
    return groups.filter((thing, index, self) => self.findIndex(g => g.title === thing.title) === index);
  }

  /** Removes trailing and leading whitespaces and ignore duplicates, lowers case */
  static tidyTags(myArr: string[]): string[] {
    for (let tag of myArr) {
      tag = tag.trim();
    }
    return myArr.filter((thing, index, self) => self.findIndex(t => t === thing) === index);
  }

  public static toggleChipCancel(chip: string): void {
    const el = document.getElementById(chip);
    el.innerHTML = (el.innerHTML === 'cancel') ? 'close' : 'cancel';
  }

  static thumbURL(m: Media, username: string, cookieAuth: boolean): string {
    if (m.filenameThumb != null && m.filenameThumb.length > 0 && m.nodes != null && m.nodes.length > 0) {
      const node = m.nodes[0]
      if (node == null) {
        return m.filenameThumb;
      }
      let tmp: string;
      if (m.creator === username) {
        tmp = node.APIEndpoint + '/api/v1/file/' + m.creator + '/' + m.filenameThumb + '?thumb=true&group=false' + '&cookieAuth=' + (cookieAuth? 'true': 'false');
      } else {
        tmp = node.APIEndpoint + '/api/v1/file/' + m.groups[0].id + '/' + m.filenameThumb + '?thumb=true&group=true' + '&cookieAuth=' + (cookieAuth? 'true': 'false');
      }

      return tmp;
    }
    return m.filenameThumb;
  }

  static resourceURL(m: Media, username: string, cookieAuth: boolean): string {
    if (m.filename != null && m.filename.length > 0 && m.nodes != null && m.nodes.length > 0) {
      const node = m.nodes[0]
      if (node == null) {
        return m.filename;
      }
      let tmp: string;
      if (m.creator === username) {
        tmp = node.APIEndpoint + '/api/v1/file/' + m.creator + '/' + m.filename + '?thumb=false&group=false' + '&cookieAuth=' + (cookieAuth? 'true': 'false');
      } else {
        tmp = node.APIEndpoint + '/api/v1/file/' + m.groups[0].id + '/' + m.filename + '?thumb=false&group=true' + '&cookieAuth=' + (cookieAuth? 'true': 'false');
      }

      return tmp;
    }
    return m.filename;
  }

}
