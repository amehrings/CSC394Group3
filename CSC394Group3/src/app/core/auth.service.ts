import { Injectable } from "@angular/core";
import 'rxjs/add/operator/toPromise';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import {User} from './user';
import { Observable} from 'rxjs/Observable';
import { of as observableOf } from 'rxjs/Observable/of';
import { switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {
  user$: Observable<User>;

  constructor(public afAuth: AngularFireAuth, public afs: AngularFirestore, public router: Router) {                 
    this.user$ = this.afAuth.authState.pipe(switchMap(user => {
      if(user){
        return this.afs.doc<User>('users/${user.userId').valueChanges()
      } else{
        return observableOf(null)
      }
    }))
  }

  doRegister(value){
    return new Promise<any>((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
      .then(res => {
        resolve(res);
      }, err => reject(err))
    })
  }

  doLogin(value){
    return new Promise<any>((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(value.email, value.password)
      .then(res => {
        resolve(res);
      }, err => reject(err))
    })
  }

  doLogout(){
    return new Promise((resolve, reject) => {
      if(firebase.auth().currentUser){
        this.afAuth.auth.signOut();
        resolve();
      }
      else{
        reject();
      }
    });
  }

  
  updateUserData(userEmail:string = '', userId: string = '', userDegree = '', userConcentration = '', isStudent: boolean = true, isFaculty: boolean = false, isAdmin: boolean = false, userSkills = {}){
    const user: User = {
      userId: userId,
      email: userEmail,
      roles: {
        student: isStudent,
        faculty: isFaculty,
        admin: isAdmin
      },
      concentration: userConcentration,
      degree: userDegree,
      skillsMap: userSkills
    };
    const userRef: AngularFirestoreDocument<any> = this.afs.doc('users/' + user.userId);

    const userData: User = user;

    /*var data = {
      skills: []
    };*/
    
    // this.afs.collection('skills').doc('myskills').set(data);

    return userRef.set(userData, { merge: true})
  }

  checkAuthorization(user: User, allowedRoles: string[]): boolean {
    if (!user) return false
    for (const role of allowedRoles) {
      if(user.roles[role]) {
        return true
      }
    }
    return false
  }

  canRead(user: User): boolean {
    const allowed = ['admin', 'faculty', 'student'];
    return this.checkAuthorization(user, allowed)
  }

  canEdit(user: User): boolean {
    const allowed = ['admin', 'faculty', 'student'];
    return this.checkAuthorization(user, allowed)
  }

  canDelete(user: User): boolean {
    const allowed = ['admin', 'faculty', 'student'];
    return this.checkAuthorization(user, allowed)
  }


}
