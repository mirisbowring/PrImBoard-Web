import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { MediaService } from 'src/app/services/media.service';
import { Media } from 'src/app/models/media';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-media-list',
  templateUrl: './media.list.component.html',
  styleUrls: ['./media.list.component.css']
})
export class MediaListComponent implements OnInit, AfterViewInit {

  @ViewChild('mediastream', { read: ElementRef, static: false }) public mediastream: ElementRef;

  isFullListDisplayed = false;
  media: Media[] = [];
  filter: string;

  constructor(private mediaService: MediaService, private router: Router, private route: ActivatedRoute) {
    route.params.subscribe(param => {
      this.mediaService.getMediaPage(null, 0, param.filter).subscribe((data: Media[]) => {this.media = data; this.requestMedia(); });
    });
   }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  requestMedia() {
    this.mediaService.getMediaPage(this.media[this.media.length - 1].id, 0, this.filter).subscribe((data: Media[]) => {
      if (data == null || data.length === 0) {
        this.isFullListDisplayed = true;
      } else {
        this.media = this.media.concat(data);
        this.callbackUntilScrollable();
      }
    });
  }

  onScroll() {
    this.requestMedia();
  }

  private callbackUntilScrollable() {
    window.setTimeout(() => {
      if (this.mediastream.nativeElement.clientHeight <= window.innerHeight + 500) {
        this.onScroll();
      }
    }, 0);  // If you use loading-placeholder.
  }



}
