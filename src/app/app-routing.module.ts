import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService as AuthGuard, AuthGuardService } from 'src/app/services/auth-guard.service';
import { HomeComponent } from 'src/app/components/home/home.component';
import { InviteComponent } from 'src/app/components/invite/invite.component';
import { UploadComponent } from 'src/app/components/upload/upload.component';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { MediaComponent } from './components/media/media.component';
import { ListComponent } from './components/event/event.list.component';
import { ShowComponent } from './components/event/event.show.component';
import { CreateComponent } from './components/event/event.create.component';


const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'event', component: ShowComponent, canActivate: [AuthGuard ]},
    { path: 'event/:id', component: ShowComponent, canActivate: [AuthGuard ]},
    { path: 'event/new', component: CreateComponent, canActivate: [AuthGuard ]},
    { path: 'events', component: ListComponent, canActivate: [AuthGuard ]},
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'invite', component: InviteComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'logout', component: LogoutComponent, canActivate: [AuthGuard] },
    { path: 'media/:sha1', component: MediaComponent, canActivate: [AuthGuard] },
    { path: 'upload', component: UploadComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
