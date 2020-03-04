import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { of, Observable } from 'rxjs';
import { Tag } from 'src/app/models/tag';
import { FormControl } from '@angular/forms';
import { startWith, debounceTime, switchMap } from 'rxjs/operators';
import { TagService } from 'src/app/services/tag.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {

  authenticated: boolean;

  tagAutoComplete$: Observable<Tag> = null;
  tagInput = new FormControl('');

  constructor(private userService: UserService, public router: Router, private tagService: TagService, authService: AuthService) {

    // store authenticated in a local boolean to prevent delay due to cookie access
    router.events.subscribe(val => {
      this.authenticated = authService.isAuthenticated();
      console.log('called');
    });
    // parse filter from url if authenticated only
    if (!this.authenticated) {
      let filter = window.location.pathname;
      if (filter.startsWith('/home/')) {
        filter = filter.replace('/home/', '');
        this.tagInput.setValue(filter);
      }
    }
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // pull tags
    this.receiveTags();
  }

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
    this.router.navigate(['/home/' + input ]);
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
