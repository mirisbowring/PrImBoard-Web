import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MediaService } from '../../services/media.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {

  temp = Array;
  math = Math;
  media = [];
  public message = 'hi';

  constructor(private mediaService: MediaService) { }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.mediaService.getAllMedia().subscribe((data: any[]) => {
      console.log(data);
      this.media = data;
    });
  }

  mediaSlices(cols: number): number {
    return this.media.length;
  }

  public printHi() {
    alert(this.message);
  }

}
