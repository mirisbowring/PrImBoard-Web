import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService as AuthGuard } from 'src/app/services/auth-guard.service';
import { InviteComponent } from 'src/app/components/invite/invite.component';
import { UploadComponent } from 'src/app/components/upload/upload.component';
import { LoginComponent } from 'src/app/components/login/login.component';
import { LogoutComponent } from 'src/app/components/logout/logout.component';
import { MediaComponent } from 'src/app/components/media/media.component';
import { ListComponent } from 'src/app/components/event/event.list.component';
import { ShowComponent } from 'src/app/components/event/event.show.component';
import { CreateComponent } from 'src/app/components/event/event.create.component';
import { MediaListComponent } from 'src/app/components/media/media.list.component';


const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'event', component: ShowComponent, canActivate: [AuthGuard ]},
    { path: 'event/:id', component: ShowComponent, canActivate: [AuthGuard ]},
    { path: 'event/new', component: CreateComponent, canActivate: [AuthGuard ]},
    { path: 'events', component: ListComponent, canActivate: [AuthGuard ]},
    { path: 'home', component: MediaListComponent, canActivate: [AuthGuard] },
    { path: 'home/:filter', component: MediaListComponent, canActivate: [AuthGuard] },
    { path: 'media/:filter/:id', component: MediaComponent, canActivate: [AuthGuard] },
    { path: 'invite', component: InviteComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'logout', component: LogoutComponent, canActivate: [AuthGuard] },
    { path: 'media/:id', component: MediaComponent, canActivate: [AuthGuard] },
    { path: 'upload', component: UploadComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
