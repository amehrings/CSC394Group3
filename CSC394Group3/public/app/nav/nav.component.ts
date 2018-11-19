import { Component, OnInit } from '@angular/core';
import { FirebaseUserModel } from '../core/user.model';
import { UserService } from '../core/user.service';
import { AuthService } from '../core/auth.service';
import { Location} from '@angular/common';
import { ActivatedRoute} from '@angular/router';
import{ FormBuilder} from '@angular/forms';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import { tap, map, take } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';



@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  myRole: boolean = false;
  rolesMap: Map<String, any> = new Map();

  constructor(
    public authService: AuthService,
    private location: Location,
    private afs: AngularFirestore
) {
}

getMap(map) {
  return new Map(Object.entries(map));
}

isAdmin(): Map<String, any>{
 const firestore = firebase.firestore();
 firestore.collection('/users').doc(firebase.auth().currentUser.uid).get().then(doc => {
  this.rolesMap = this.getMap(doc.data().roles)
  console.log(this.rolesMap);
 })

 return new Map();
}

logout(){
  this.authService.doLogout()
    .then((res) => {
      this.location.back();
    }, (error) => {
      console.log('Logout error', error);
    });
}

delete() {
  this.authService.doDelete()
    .then((res) => {
    }, (error) => {
      console.log('Delete error', error);
    });
}

  ngOnInit() {}

}
