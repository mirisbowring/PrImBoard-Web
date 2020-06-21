import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router, NavigationStart } from '@angular/router';
import { of, Observable, Unsubscribable, Subscription } from 'rxjs';
import { Tag } from 'src/app/models/tag';
import { FormControl } from '@angular/forms';
import { startWith, debounceTime, switchMap, filter as fil } from 'rxjs/operators';
import { TagService } from 'src/app/services/tag.service';
import { AuthService } from 'src/app/services/auth.service';
import { DestroySubscribers, CombineSubscriptions } from 'ngx-destroy-subscribers';
import { MessageService } from './services/message.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {

  private subscriptions = new Subscription();

  authenticated: boolean;

  tagAutoComplete$: Observable<Tag> = null;
  tagInput = new FormControl('');

  multiselect = false;

  private mediaID: string;
  private filter: string;
  private eventID: string;

  constructor(
    private userService: UserService,
    public router: Router,
    private tagService: TagService,
    private authService: AuthService,
    private messageService: MessageService,
  ) { }

  ngOnInit() {
    // store authenticated in a local boolean to prevent delay due to cookie access
    this.subscriptions.add(
      this.router.events.subscribe(() => {
        this.authenticated = this.authService.isAuthenticated();
        // parse filter from url if authenticated only
        if (this.authenticated) {
          // filter has to be manually parsed because this component is not in scope of router-outlet
          const path = window.location.pathname;
          if (path.startsWith('/home/')) {
            this.clear();
            this.filter = decodeURI(path.split('/')[2]);
            this.tagInput.setValue(decodeURI(this.filter));
          } else if (path.startsWith('/event/')) {
            // e.x.: http://localhost:4200/event/5eef2decd92bfe4db4329d91/myFilter
            const parts = path.split('/');
            this.eventID = decodeURI(parts[2]);
            if (parts.length === 4) {
              this.filter = decodeURI(parts[3]);
            }
          } else if (path.startsWith('/media/')) {
            const paths = path.split('/');
            this.filter = paths.length === 4 ? decodeURI(paths[2]) : null;
            this.mediaID = paths.length === 4 ? paths[3] : paths[2];
          } else {
            this.tagInput.setValue('');
            this.filter = null;
          }
        }
      })
    );

    this.subscriptions.add(
      this.router.events.pipe(
        fil(event => event instanceof NavigationStart)
      ).subscribe((event: NavigationStart) => {
        if (event.restoredState) {
          if (this.mediaID && this.filter) {
            if (this.eventID) {
              this.router.navigate(['/event', this.eventID, this.filter], { fragment: this.mediaID });
            } else {
              this.router.navigate(['/home', this.filter], { fragment: this.mediaID });
            }
            history.forward();
          } else if (this.mediaID) {
            if (this.eventID) {
              this.router.navigate(['/event', this.eventID], { fragment: this.mediaID });
            } else {
              this.router.navigate(['/home'], { fragment: this.mediaID });
            }
            history.forward();
          } else if (this.filter) {
            if (this.eventID) {
              this.router.navigate(['/event', this.eventID, this.filter]);
            } else {
              this.router.navigate(['/home', this.filter]);
            }
            history.forward();
          }
        }
      })
    );
  }

  ngAfterViewInit() {
    // pull tags
    this.receiveTags();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  receiveTags() {
    this.tagAutoComplete$ = this.tagInput.valueChanges.pipe(
      startWith(''),
      // delay emits
      debounceTime(200),
      // use switch map to cancel previous subscribed events, before creating new
      switchMap(value => {
        if (value !== '') {
          return this.tagService.tagPreview(value);
        } else {
          // no value present
          return of(null);
        }
      })
    );
  }

  submitTagForm() {
    const input = this.tagInput.value;
    if (input === '') {
      if (this.eventID) {
        this.router.navigate(['/event', this.eventID]);
      } else {
        this.router.navigate(['/home']);
      }
    }
    if (this.eventID) {
      this.router.navigate(['/event/' + this.eventID + '/' + input]);
    } else {
      this.router.navigate(['/home/' + input]);
    }
  }

  toggleMultiselect(selected: boolean): void {
    this.multiselect = selected;
    this.messageService.sendMessage({ multiselect: selected });
  }

  openEventDialog(): void {
    this.messageService.sendMessage({ openEventDialog: true });
  }

  openTagDialog(): void {
    this.messageService.sendMessage({ openTagDialog: true });
  }

  doLogout() {
    this.userService.logoutUser().subscribe(
      res => {
        if (res.status === 204) {
          this.router.navigate(['/login']);
        }
      }
    );
  }

  private clear(): void {
    this.mediaID = null;
    this.eventID = null;
    this.filter = null;
  }
}
