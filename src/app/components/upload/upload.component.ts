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
      { prop: 'Video' },
      { prop: 'Image' }
    ];
  }

  private submituForm() {
    let med: Media;
    med = this.uForm.getRawValue();
    med.timestamp = Math.round((this.uForm.controls.timestamp.value as Date).getTime() / 1000);
    this.mediaService.createMedia(med).subscribe();
  }

}
