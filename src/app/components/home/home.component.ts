import { Component, OnInit } from '@angular/core';
import { MediaService } from '../../services/media.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  media = [];

  constructor(private mediaService : MediaService) { }

  ngOnInit() {
    this.mediaService.getAllMedia().subscribe((data: any[]) => {
      console.log(data);
      this.media = data;
    })
  }

}
