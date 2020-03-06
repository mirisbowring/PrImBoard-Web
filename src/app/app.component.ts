import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router, NavigationStart } from '@angular/router';
import { of, Observable, Unsubscribable } from 'rxjs';
import { Tag } from 'src/app/models/tag';
import { FormControl } from '@angular/forms';
import { startWith, debounceTime, switchMap, filter } from 'rxjs/operators';
import { TagService } from 'src/app/services/tag.service';
import { AuthService } from 'src/app/services/auth.service';
import { DestroySubscribers, CombineSubscriptions } from 'ngx-destroy-subscribers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
@DestroySubscribers()
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {

  @CombineSubscriptions()
  private subscribers: Unsubscribable;

  authenticated: boolean;

  tagAutoComplete$: Observable<Tag> = null;
  tagInput = new FormControl('');

  private id: string;
  private filter: string;

  constructor(private userService: UserService, public router: Router, private tagService: TagService, private authService: AuthService) {
  }

  ngOnInit() {
    // store authenticated in a local boolean to prevent delay due to cookie access
    this.subscribers = this.router.events.subscribe(val => {
      this.authenticated = this.authService.isAuthenticated();
      // parse filter from url if authenticated only
      if (this.authenticated) {
        // filter has to be manually parsed because this component is not in scope of router-outlet
        const path = window.location.pathname;
        if (path.startsWith('/home/')) {
          this.filter = path.split('/')[2];
          this.tagInput.setValue(this.filter);
        } else if (path.startsWith('/media/')) {
          const paths = path.split('/');
          this.filter = paths.length === 4 ? paths[2] : null;
          this.id = paths.length === 4 ? paths[3] : paths[2];
        } else {
          this.tagInput.setValue('');
          this.filter = null;
        }
      }
    });

    this.subscribers = this.router.events.pipe(
      filter(event => event instanceof NavigationStart)
    ).subscribe((event: NavigationStart) => {
      if (event.restoredState) {
        if (this.id && this.filter) {
          this.router.navigate(['/home', this.filter], { fragment: this.id });
          history.forward();
        } else if (this.id) {
          this.router.navigate(['/home'], { fragment: this.id });
          history.forward();
        } else if (this.filter) {
          this.router.navigate(['/home', this.filter]);
          history.forward();
        }
      }
    });
  }

  ngAfterViewInit() {
    // pull tags
    this.receiveTags();
  }

  ngOnDestroy() { }

  receiveTags() {
    this.tagAutoComplete$ = this.tagInput.valueChanges.pipe(
      startWith(''),
      // delay emits
      debounceTime(200),
      // use switch map to cancel previous subscribed events, before creating new
      switchMap(value => {
        if (value !== '') {
          return this.tagService.tagPreview(value.toLowerCase());
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
      this.router.navigate(['/home']);
    }
    this.router.navigate(['/home/' + input]);
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
}
