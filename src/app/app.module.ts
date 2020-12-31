import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { KeycloakService, KeycloakAngularModule } from 'keycloak-angular';
import { initializeKeycloak } from 'src/app/utils/utils';
import { SwiperModule } from 'swiper/angular';

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
import { NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClientModule } from '@angular/common/http';
import { RegisterComponent } from './components/register/register.component';
import { NgxScrollEventDirective } from '../app/directives/ngx-scroll-event.directive';
import { UploadComponent } from './components/upload/upload.component';
import { LoginComponent } from './components/login/login.component';
import { ModalMediaViewComponent } from './components/modals/modal.media.view.component';
import { MediaListComponent } from './components/media/media.list.component';
import { ModalUserGroupComponent } from 'src/app/components/modals/modal.usergroup.component';
import { ModalTagComponent } from 'src/app/components/modals/modal.tag.component';
import { CookieService } from 'ngx-cookie-service';
import { CreateComponent } from './components/event/event.create.component';
import { ListComponent } from './components/event/event.list.component';
import { ShowComponent } from './components/event/event.show.component';
import { SettingComponent } from './components/setting/setting.component';
import { ModalEventComponent } from './components/modals/modal.event.component';
import { ModalDeleteComponent } from './components/modals/modal.delete.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { VirtualScrollerModule } from '@michaukrieg/ngx-virtual-scroller';
import { ModalEventEditComponent } from './components/modals/modal.event.edit.component';
import { HelperService } from './services/helper.service';
import {VgCoreModule} from '@videogular/ngx-videogular/core';
import {VgControlsModule} from '@videogular/ngx-videogular/controls';
import {VgOverlayPlayModule} from '@videogular/ngx-videogular/overlay-play';
import {VgBufferingModule} from '@videogular/ngx-videogular/buffering';
import { AuthImagePipe } from './services/pipes/authImage.pipe';
import { APP_BASE_HREF, PlatformLocation } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    AuthImagePipe,
    MediaListComponent,
    RegisterComponent,
    UploadComponent,
    LoginComponent,
    ModalMediaViewComponent,
    CreateComponent,
    ListComponent,
    ShowComponent,
    SettingComponent,
    ModalUserGroupComponent,
    ModalTagComponent,
    ModalEventComponent,
    ModalEventEditComponent,
    ModalUserGroupComponent,
    NgxScrollEventDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    KeycloakAngularModule,
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
    MatChipsModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatTooltipModule,
    NgbModule,
    NgbDatepickerModule,
    ScrollingModule,
    SwiperModule,
    VirtualScrollerModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
  ],
  providers: [
    CookieService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
    {
      provide: APP_BASE_HREF,
      useFactory: (s: PlatformLocation) => s.getBaseHrefFromDOM(),
      deps: [PlatformLocation]
    },
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ModalUserGroupComponent,
    ModalTagComponent,
    ModalEventComponent,
    ModalDeleteComponent,
  ]
})
export class AppModule { }
