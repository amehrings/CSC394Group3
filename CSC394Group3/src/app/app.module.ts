import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFirestoreModule, AngularFirestore } from 'angularfire2/firestore';
import { AngularFireModule } from 'angularfire2';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AppRouterModule } from './router.module';
import { UserComponent } from './user/user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthGuard } from './core/auth.guard';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AuthService } from './core/auth.service';
import { UserService } from './core/user.service';
import { UserResolver } from './user/user.resolver';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule} from './material.module';
import { NavComponent } from './nav/nav.component';
import { skillsSearchService } from './skills-search.service';
import { DialogSearchComponent } from './dialog-search/dialog-search.component';
import { JobLandingComponent } from './job-landing/job-landing.component';
import { AdminGuard } from './core/admin.guard';
import { AdminComponent } from './admin/admin.component';
import { FacultyGuard } from './core/faculty.guard';
import { FacultyComponent } from './faculty/faculty.component';
import { MatSortModule } from '@angular/material';
import { MatTableModule } from '@angular/material';




@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    UserComponent,
    NavComponent,
    DialogSearchComponent,
    JobLandingComponent,
    AdminComponent,
    FacultyComponent  
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AppRouterModule,
    ReactiveFormsModule,
    FormsModule,
    AngularFireAuthModule,
    BrowserAnimationsModule,
    MaterialModule,
    MatSortModule,
    MatTableModule
  ],
  providers: [AngularFirestore, AuthService, UserService, UserResolver, AuthGuard, skillsSearchService, AdminGuard, FacultyGuard],
  bootstrap: [AppComponent],
  entryComponents: [DialogSearchComponent]
})
export class AppModule { }
