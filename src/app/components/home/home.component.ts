import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MediaService } from '../../services/media.service';
import { MediaJson, Media } from 'src/app/models/media';
import { MediaAdapter } from 'src/app/adapter/media.adapter';
import { map } from "rxjs/operators";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {

  temp = Array;
  math = Math;
  media = [];

  constructor(private mediaService: MediaService, private adapter: MediaAdapter ) { }

  ngOnInit() {

  }

  ngAfterViewInit() {
    // this.mediaService.getAllMedia().subscribe((data: any[]) => {
    //   this.media = data;
    // });
    this.mediaService.getAllMedia().pipe(
      map((data: any[]) => data.map(item => this.adapter.adapt(item)))
    ).subscribe((data: any[]) => this.media = data);
  }

}
