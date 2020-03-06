import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { MediaService } from 'src/app/services/media.service';
import { Media } from 'src/app/models/media';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter as fil, withLatestFrom } from 'rxjs/operators';
import { DestroySubscribers, CombineSubscriptions } from 'ngx-destroy-subscribers';
import { Unsubscribable } from 'rxjs';

@Component({
  selector: 'app-media-list',
  templateUrl: './media.list.component.html',
  styleUrls: ['./media.list.component.css']
})
@DestroySubscribers()
export class MediaListComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('mediastream', { read: ElementRef, static: false }) public mediastream: ElementRef;

  @CombineSubscriptions()
  private subscribers: Unsubscribable;

  isFullListDisplayed = false;
  media: Media[] = [];
  filter: string;
  prevID: string;
  private curID: string;

  constructor(private mediaService: MediaService, route: ActivatedRoute, private router: Router) {
    this.subscribers = this.router.events.pipe(
      fil(e => e instanceof NavigationEnd),
      withLatestFrom(route.params, route.fragment)
    ).subscribe(([e, params, fragment]) => {
      console.log(e instanceof NavigationEnd);
      let operate = false;
      if (this.curID !== fragment) {
        this.curID = fragment;
        this.prevID = fragment;
        operate = true;
      }
      if (this.filter !== params.filter) {
        this.filter = params.filter;
        if (!operate || !this.curID) {
          this.prevID = null;
          operate = true;
        }
      }
      if (operate || (e as NavigationEnd).urlAfterRedirects === '/home') {
        console.log('getting');
        this.media = [];
        this.requestMedia();
      }
    });
  }

  ngOnInit() { }

  ngAfterViewInit() { }

  ngOnDestroy() { }

  requestMedia() {
    console.log(this.prevID + '     ' + this.curID + '    ' + this.filter);
    this.mediaService.getMediaPage(this.prevID, 0, this.filter).subscribe((data: Media[]) => {
      if (data == null || data.length === 0) {
        this.isFullListDisplayed = true;
      } else {
        this.media = this.media.concat(data);
        this.prevID = this.media[this.media.length - 1].id;
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
    }, 0);
  }



}
