import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClientModule } from '@angular/common/http';
import { RegisterComponent } from './components/register/register.component';
import { UploadComponent } from './components/upload/upload.component';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { MediaComponent } from './components/media/media.component';
import { MediaListComponent } from './components/media/media.list.component';
import { ModalUserGroupComponent } from 'src/app/components/modals/modal.usergroup.component';
import { ModalTagComponent } from 'src/app/components/modals/modal.tag.component';
import { CookieService } from 'ngx-cookie-service';
import { CreateComponent } from './components/event/event.create.component';
import { ListComponent } from './components/event/event.list.component';
import { ShowComponent } from './components/event/event.show.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SettingComponent } from './components/setting/setting.component';
import { ModalEventComponent } from './components/modals/modal.event.component';

@NgModule({
  declarations: [
    AppComponent,
    MediaListComponent,
    RegisterComponent,
    UploadComponent,
    LoginComponent,
    LogoutComponent,
    MediaComponent,
    CreateComponent,
    ListComponent,
    ShowComponent,
    SettingComponent,
    ModalUserGroupComponent,
    ModalTagComponent,
    ModalEventComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatExpansionModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatGridListModule,
    MatMenuModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    InfiniteScrollModule,
    MatChipsModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatTooltipModule,
  ],
  providers: [CookieService],
  bootstrap: [AppComponent],
  entryComponents: [
    ModalUserGroupComponent,
    ModalTagComponent,
    ModalEventComponent,
  ]
})
export class AppModule { }
