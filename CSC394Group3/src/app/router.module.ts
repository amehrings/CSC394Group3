import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { UserComponent } from './user/user.component';
import { AdminComponent } from './admin/admin.component';
import { RegisterComponent } from './register/register.component';
import { UserResolver } from './user/user.resolver';
import { AuthGuard } from './core/auth.guard';
import { JobLandingComponent } from './job-landing/job-landing.component'
import { AdminGuard } from './core/admin.guard';
import { FacultyGuard } from './core/faculty.guard';
import { FacultyComponent } from './faculty/faculty.component';



const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [AuthGuard] },
  { path: 'user', component: UserComponent,  resolve: { data: UserResolver}},
  { path: 'jobLanding', component: JobLandingComponent,  resolve: { data: UserResolver}},
  { path: 'admin', component: AdminComponent,  resolve: { data: UserResolver}, canActivate: [AdminGuard] },
  { path: 'faculty', component: FacultyComponent,  resolve: { data: UserResolver}, canActivate: [FacultyGuard] } 
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})

export class AppRouterModule {}

