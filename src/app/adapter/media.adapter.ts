import { Injectable } from '@angular/core';

import { Adapter } from 'src/app/adapter/adapter';
import { Media, MediaJson } from 'src/app/models/media';

@Injectable({
  providedIn: 'root'
})
export class MediaAdapter implements Adapter<Media> {
  adapt(item: any): Media {
    return new Media(
      item._id,
      item.sha1,
      item.title,
      item.description,
      item.creator,
      item.timestamp,
      item.timestamp_upload,
      item.url,
      item.urlthumb,
      item.type,
      item.format
    );
  }
}
