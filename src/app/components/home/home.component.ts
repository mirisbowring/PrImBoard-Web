import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MediaService } from '../../services/media.service';
import { Media } from 'src/app/models/media';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {

  temp = Array;
  math = Math;
  media: Media[];

  constructor(private mediaService: MediaService ) { }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.mediaService.getAllMedia().subscribe((data: Media[]) => this.media = data);
  }

}
