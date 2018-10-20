import { Component, OnInit } from '@angular/core';
import { FirebaseUserModel } from '../core/user.model';
import { UserService } from '../core/user.service';
import { AuthService } from '../core/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore } from 'angularfire2/firestore';

import * as firebase from 'firebase/app';
import { MatDialog } from '@angular/material';
import { DialogSearchComponent } from '../dialog-search/dialog-search.component';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})

export class UserComponent implements OnInit{

  
  dbSkills: any[];
  dbSkillsRating: any[];
  dbMap: Map<String,Number>;
  result: String;
  user: FirebaseUserModel = new FirebaseUserModel();
  profileForm: FormGroup;

  constructor(
    public userService: UserService,
    public authService: AuthService,
    private route: ActivatedRoute,
    private location: Location,
    private form: FormBuilder,
    public dialog: MatDialog,
    private afs: AngularFirestore
  ) {
    this.dbSkills= this.getUserSkills();
  }

  ngOnInit(): void {
    this.route.data.subscribe(routeData => {
      let data = routeData['data'];
      if (data) {
        this.user = data;
        //this.dbSkills = this.getUserSkills()
        this.createForm(this.user.name);
      }
    });
  }
  
  getUserSkills(): any[] {
    const firestore = firebase.firestore();
    firestore.collection('/users').doc(firebase.auth().currentUser.uid).get().then(doc => {
      this.dbSkills = this.getKeys(doc.data().skillsMap);
      this.dbSkillsRating = this.getValues(doc.data().skillsMap);
      this.dbMap = this.getMap(doc.data().skillsMap);
      console.log(this.dbSkills)
      console.log(this.dbSkillsRating)

    }).catch(function(error) {
      return null;
    })
    return [];
  }

  getName(){
    return firebase.auth().currentUser.displayName
  }

  getKeys(map){
    return Array.from(this.getMap(map).keys())
  }

  getValues(map){
    return Array.from(this.getMap(map).values())
  }

  getMap(map){
    return new Map(Object.entries(map))
  }

  createForm(name) {
    this.profileForm = this.form.group({
      name: [name, Validators.required ]
    });
  }

  openSearchDialog() {
    const dialogRef = this.dialog.open(DialogSearchComponent, {
      width: '750px',
      position: {top: '50px'}
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getUserSkills();
    });
  }

  logout(){
    this.authService.doLogout()
    .then((res) => {
      this.location.back();
    }, (error) => {
      console.log("Logout error", error);
    });
  }

  displayMessage(num: Number): String{
    switch(num){
      case  5: {
        return "Extremely Confident";
      }

      case  3: {
        return "Confident";
      }

      case  1: {
        return "Familiar But Not Confident";
      }
    }
  }
  starHandler(skill: String, num: Number){
    var skillsUpdate={};
    skillsUpdate['skillsMap.'+skill.toLowerCase()] = num;
    this.afs.collection('users').doc(firebase.auth().currentUser.uid).update(skillsUpdate);
  }

  starCheck(skill: String){
    console.log(this.dbMap.get(skill))
    return this.dbMap.get(skill)
    // if (this.dbMap.get(skill) !=)
  }

  // save(value) {
  //   this.userService.updateCurrentUser(value)
  //   .then(res => {
  //     console.log(res);
  //   }, err => console.log(err));
  // }
}
