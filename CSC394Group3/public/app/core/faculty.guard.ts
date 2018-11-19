import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';
import { tap, map, take } from 'rxjs/operators';

@Injectable()
export class FacultyGuard implements CanActivate {
  constructor(private auth: AuthService){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    return this.auth.user$.pipe(
      take(1),
      map(user => (user && user.roles.admin) || (user && user.roles.faculty) ? true : false),
      tap(isFaculty => {
        if(!isFaculty){
        console.error('ACCESS DENIED - FACULTY ONLY');
      }
      }),
    );
  }
}
