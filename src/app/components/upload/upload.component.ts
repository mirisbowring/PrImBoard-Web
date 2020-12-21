import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MediaService } from 'src/app/services/media.service';
import { Media } from 'src/app/models/media';
import { startWith, debounceTime, switchMap, map, catchError } from 'rxjs/operators';
import { of, Observable, Subscription } from 'rxjs';
import { HelperService } from 'src/app/services/helper.service';
import { TagService } from 'src/app/services/tag.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatInput } from '@angular/material/input';
import { HttpEvent, HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { UserService } from 'src/app/services/user.service';
import { Node } from 'src/app/models/node';
import { NodeService } from 'src/app/services/node.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  @ViewChild('fileUpload', { static: false }) fileUpload: ElementRef; files = [];

  tagAutoComplete$: Observable<string> = null;
  private subscriptions = new Subscription();

  tagCtrl = new FormControl('');

  alertMessage = '';

  separatorKeysCodes: number[] = [ENTER, COMMA];
  globalTags: string[] = [];
  nodes: Node[] = [];
  selectedNode: Node = {id: ''};
  imgURL = '';
  uploaded = 0;
  toBeUploaded = 0;

  constructor(private mediaService: MediaService,
    private tagService: TagService,
    private nodeService: NodeService) { }

  ngOnInit() {
    // pull tags
    this.receiveTags();
    this.receiveNodes();
  }

  addTag(input: HTMLInputElement, tags: string[], element?: any): string[] {
    const value = input.value;

    // Add tag
    if ((value || '').trim()) {
      tags.push(value.trim());
    }

    tags = HelperService.tidyTags(tags);

    // Reset the input value
    if (input) {
      input.value = '';
    }

    if (element !== undefined) {
      (element as MatInput).value = '';
    }

    return tags;
  }

  loadImage(file) {
    const mimeType = file.data.type;
    if (mimeType.match(/image\/*/) == null) {
      // Only images are supported
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file.data);
    reader.onload = () => {
      this.imgURL = reader.result as string;
    }
  }

  receiveNodes() {
    this.subscriptions.add(
      this.nodeService.getNodes().subscribe((data: Node[]) => {
        if (data != null) {
          this.nodes = data;
        }
      })
    );
  }

  receiveTags() {
    this.tagAutoComplete$ = this.tagCtrl.valueChanges.pipe(
      startWith(''),
      // delay emits
      debounceTime(200),
      // use switch map to cancel previous subscribed events, before creating new
      switchMap(value => {
        if (value !== '' && value != null) {
          return this.tagService.tagPreview(value);
        } else {
          // no value present
          return of(null);
        }
      })
    );
  }

  removeTag(tag: string, index: number): void {
    switch (index) {
      case -1:
        this.globalTags = HelperService.removeItem<string>(tag, this.globalTags);
        break;
      default:
        this.files[index].media.tags = HelperService.removeItem<string>(tag, this.files[index].media.tags);
    }
  }

  selectedTag(event: MatAutocompleteSelectedEvent, index: number, element?: any): void {
    switch (index) {
      case -1:
        this.globalTags.push(event.option.viewValue);
        element.value = event.option.viewValue;
        this.set('global-tag', -1, element, element);
        break;
      default:
        this.files[index].media.tags.push(event.option.viewValue);
    }
    if (element !== undefined) {
      (element as MatInput).value = '';
    }
    this.tagCtrl.setValue('');
  }

  set(attr: string, index: number, value: any, element?: any) {
    switch (attr){
      case 'title':
        this.files[index].media.title = value;
        break;
      case 'date':
        this.files[index].media.timestamp = Math.round((value as Date).getTime() / 1000);
        break;
      case 'description':
        this.files[index].media.description = value;
        break;
      case 'global-date':
        for (const file of this.files) {
          file.media.timestamp = Math.round((value as Date).getTime() / 1000);
        }
        break;
      case 'global-description':
        for (const file of this.files) {
          file.media.description = value;
        }
        break;
      case 'tag':
        this.files[index].media.tags = this.addTag(value, this.files[index].media.tags, element);
        break;
      case 'global-tag':
        this.globalTags = this.addTag(value, this.globalTags, this.tagCtrl);
        for (const file of this.files) {
          file.media.tags.splice(0, file.media.tags.length, ...this.globalTags);
        }
        break;
    }
  }

  parseNgDate(date): Date {
    return new Date(date*1000);
  }

  uploadFile(file) {
    const formData = new FormData();

    formData.append('uploadfile', file.data);
    formData.append('filemeta', JSON.stringify(file.media));
    file.inProgress = true;

    this.mediaService.uploadMedia(this.selectedNode.APIEndpoint, formData).pipe(
      map((event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            file.progress = Math.round(event.loaded * 100 / event.total);
            if (file.progress === 100) {
              this.uploaded += 1;
            }
            break;
          case HttpEventType.Response:
            return event;
        }
      }),
      catchError((error: HttpErrorResponse) => {
        file.inProgress = false;
        return of(`${file.media.title} upload failed.`);
      })).subscribe((event: any) => {
        if (typeof (event) === 'object') {
          // console.log(event.body);
        }
      });
  }

  uploadFiles() {
    if (this.selectedNode.id === '') {
      this.alertMessage = 'Please select a Node first!';
      return
    } else {
      this.alertMessage = '';
    }
    this.fileUpload.nativeElement.value = '';
    this.toBeUploaded = this.files.length;
    this.files.forEach(file => {
      this.uploadFile(file);
    });
  }

  chooseFiles() {
    const fileChooser = this.fileUpload.nativeElement; fileChooser.onchange = () => {
      for (const file of fileChooser.files) {
        const media = {
          title: file.name,
          timestamp: Math.round(file.lastModified / 1000),
          contentType: file.type,
          extension: file.name.split('.').pop(),
          tags: []
        } as Media;
        this.files.push({ data: file, media, inProgress: false, progress: 0 });
      }
    };
    fileChooser.click();
  }

}
