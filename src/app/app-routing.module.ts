import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService as AuthGuard } from 'src/app/services/auth-guard.service';
import { RegisterComponent } from 'src/app/components/register/register.component';
import { UploadComponent } from 'src/app/components/upload/upload.component';
import { LoginComponent } from 'src/app/components/login/login.component';
import { LogoutComponent } from 'src/app/components/logout/logout.component';
import { ModalMediaViewComponent } from 'src/app/components/modals/modal.media.view.component';
import { ListComponent } from 'src/app/components/event/event.list.component';
import { CreateComponent } from 'src/app/components/event/event.create.component';
import { MediaListComponent } from 'src/app/components/media/media.list.component';
import { SettingComponent } from './components/setting/setting.component';


const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'event/:id', component: MediaListComponent, canActivate: [AuthGuard] },
  { path: 'event/:id/:filter', component: MediaListComponent, canActivate: [AuthGuard] },
  { path: 'event/new', component: CreateComponent, canActivate: [AuthGuard] },
  { path: 'events', component: ListComponent, canActivate: [AuthGuard] },
  { path: 'home', component: MediaListComponent, canActivate: [AuthGuard] },
  { path: 'home/:filter', component: MediaListComponent, canActivate: [AuthGuard] },
  { path: 'media/:id', component: ModalMediaViewComponent, canActivate: [AuthGuard] },
  { path: 'media/:filter/:id', component: ModalMediaViewComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'settings', component: SettingComponent, canActivate: [AuthGuard] },
  { path: 'upload', component: UploadComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    // useHash: true,
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
