import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router, NavigationStart } from '@angular/router';
import { of, Observable, Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { startWith, debounceTime, switchMap, filter as fil, map, distinctUntilChanged } from 'rxjs/operators';
import { TagService } from 'src/app/services/tag.service';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from './services/message.service';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {

  private subscriptions = new Subscription();

  public authenticated = false;
  public userProfile: KeycloakProfile | null = null;

  tagAutoComplete$: Observable<string> = null;
  tagInput = new FormControl('');

  multiselect = false;

  private mediaID: string;
  private filter: string;
  private eventID: string;

  activeRoute: string;

  constructor(
    private userService: UserService,
    public router: Router,
    private tagService: TagService,
    private authService: AuthService,
    private messageService: MessageService,
    private readonly keycloak: KeycloakService,
    private cookieService: CookieService,
  ) { }

  async ngOnInit() {
    window.onpopstate = function(event) {
      this.cookieService.set('keycloak-jwt', '');
    };
    this.authenticated = await this.keycloak.isLoggedIn();

    if (this.authenticated) {
      this.userProfile = await this.keycloak.loadUserProfile();
    }
    // store authenticated in a local boolean to prevent delay due to cookie access
    this.subscriptions.add(
      this.router.events.subscribe(() => {
        // this.authenticated = this.authService.isAuthenticated();
        // parse filter from url if authenticated only
        if (this.authenticated) {
          // parse current route
          const path = window.location.pathname;
          if (path.startsWith('/home')){
            this.activeRoute = 'home';
          } else if (path.startsWith('/events')) {
            this.activeRoute = 'events';
          } else if (path.startsWith('/media')) {
            this.activeRoute = 'media';
          }
          // filter has to be manually parsed because this component is not in scope of router-outlet
          if (path.startsWith('/home/')) {
            this.clear();
            this.filter = decodeURI(path.split('/')[2]);
            this.tagInput.setValue(decodeURI(this.filter));
          } else if (path.startsWith('/event/')) {
            this.activeRoute = 'event';
            // e.x.: http://localhost:4200/event/5eef2decd92bfe4db4329d91/myFilter
            const parts = path.split('/');
            this.eventID = decodeURI(parts[2]);
            if (parts.length === 4) {
              this.filter = decodeURI(parts[3]);
            }
          } else if (path.startsWith('/media/')) {
            this.activeRoute = 'media';
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

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(term => term !== '' ? this.tagService.tagPreview(term) : [])
    )

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

  openAccessDialog(): void {
    this.messageService.sendMessage({ openAccessDialog: true });
  }

  openDeleteDialog(): void {
    this.messageService.sendMessage({ openDeleteDialog: true });
  }

  openEventDialog(): void {
    this.messageService.sendMessage({ openEventDialog: true });
  }

  openTagDialog(): void {
    this.messageService.sendMessage({ openTagDialog: true });
  }

  public login() {
    this.keycloak.login();
  }

  public logout() {
    this.keycloak.logout();
  }

  private clear(): void {
    this.mediaID = null;
    this.eventID = null;
    this.filter = null;
  }
}
