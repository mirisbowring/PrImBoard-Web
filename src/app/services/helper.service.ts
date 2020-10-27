import { Injectable } from '@angular/core';
import { Group } from 'src/app/models/group';
import { Event } from 'src/app/models/event';

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
}
