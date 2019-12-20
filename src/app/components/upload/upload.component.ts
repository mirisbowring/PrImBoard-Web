import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MediaService } from 'src/app/services/media.service';
import { Media } from 'src/app/models/media';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  public uForm = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
    creator: new FormControl(''),
    timestamp: new FormControl(''),
    url: new FormControl(''),
    urlThumb: new FormControl(''),
    type: new FormControl(''),
    format: new FormControl('')
  });

  constructor(private mediaService: MediaService) { }

  types;

  ngOnInit() {
    this.types = [
      {prop: 'Video'},
      {prop: 'Image'}
    ];
  }

  private submituForm() {
    this.mediaService.createMedia(new Media().Upload(
      this.uForm.controls.title.value,
      this.uForm.controls.description.value,
      this.uForm.controls.creator.value,
      // this.uForm.controls.timestamp.value,
      this.uForm.controls.url.value,
      this.uForm.controls.urlThumb.value,
      this.uForm.controls.type.value,
      this.uForm.controls.format.value
    )).subscribe();
  }

}
