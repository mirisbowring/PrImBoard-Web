import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { MediaService } from '../../services/media.service';
import { Media } from 'src/app/models/media';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {

  @ViewChild('mediastream', { read: ElementRef, static: false }) public mediastream: ElementRef;

  isFullListDisplayed = false;
  media: Media[] = [];

  constructor(private mediaService: MediaService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.mediaService.getMediaPage(null, 0).subscribe((data: Media[]) => {this.media = data; this.requestMedia(); });
  }

  requestMedia() {
    this.mediaService.getMediaPage(this.media[this.media.length - 1].id, 0).subscribe((data: Media[]) => {
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
