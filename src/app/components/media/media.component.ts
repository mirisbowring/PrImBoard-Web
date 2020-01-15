import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MediaService } from 'src/app/services/media.service';
import { Media } from 'src/app/models/media';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.css']
})
export class MediaComponent implements OnInit, AfterViewInit {

  med: Media;

  constructor(private mediaService: MediaService) { }

  ngOnInit() {

  }

  ngAfterViewInit() {
    // receive hash from current url
    let tmp = location.href;
    const parts = tmp.split('/');
    tmp = parts[parts.length - 1];
    // receive media object
    this.mediaService.getMediaByHash(tmp).subscribe((data: Media) => {
      this.med = data;
    });
  }

}
