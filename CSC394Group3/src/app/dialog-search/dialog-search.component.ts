import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { skillsSearchService } from '../skills-search.service';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';
import { MatListOption} from '@angular/material/list';
import { AngularFirestore } from 'angularfire2/firestore';
import { UserComponent } from '../user/user.component';
import * as firebase from 'firebase/app';

export interface DialogData {
  data: string;
}

@Component({
  selector: 'app-dialog-search',
  templateUrl: './dialog-search.component.html',
  styleUrls: ['./dialog-search.component.scss']
})
export class DialogSearchComponent implements OnInit{

  skills: any[];
  startAt = new Subject();
  endAt = new Subject();
  searchSkills: any[];
  first: boolean = true;
  lastKeypress: number = 0;
  lowerCaseSkillsList: any[];
  degrees: any[];
  showAccordianBool: boolean;
  courses: any[];

  constructor(public dialogRef: MatDialogRef<DialogSearchComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,     
              private skillsService: skillsSearchService,
              private afs: AngularFirestore
  ) { }

  ngOnInit(){
    this.skillsService.getSkills().subscribe((skills) => {
      this.skills = skills[0].skills;
      this.lowerCaseSkillsList = this.skills.map(v => v.toLowerCase());
    });

    this.degrees = this.getDegrees();   
    console.log(this.courses) 
  }

  showAccordion(event) {
    console.log(event)
        if (event.index === 1) {
            setTimeout(() => {
                this.showAccordianBool = true;
                console.log(this.showAccordianBool)
            }, 100);
        } else {
            setTimeout(() => {
                this.showAccordianBool = false;
            }, 100);
        }
  }
  
  
  onNoClick(): void {
    this.dialogRef.close();
  }

  search($event) {
    if ($event.timeStamp -this.lastKeypress > 50){
      let q = $event.target.value
      //this.startAt.next(q);
      //this.endAt.next(q+"\uf8ff");

      this.searchSkills = this.lowerCaseSkillsList.filter(skills=> skills.indexOf(q) !== -1);
    }
    this.lastKeypress = $event.timeStamp
  }

  selectionChange(option: MatListOption) {
    if(option.selected == true){     
      var skillsUpdate={};
      skillsUpdate['skillsMap.'+option.value.toLowerCase()] = 0;
      this.afs.collection('users').doc(firebase.auth().currentUser.uid).update(skillsUpdate)
      //this.afs.collection('users').doc(firebase.auth().currentUser.uid).update({skills: firebase.firestore.FieldValue.arrayUnion(option.value)});
    }    
  }  

  getDegrees(): any[]{
    const firestore = firebase.firestore();
    firestore.collection('/degrees').get().then((snapshot) =>{
      snapshot.forEach(snapshot => {
        // console.log(snapshot.id)
        this.degrees.push(snapshot.id)
        // console.log(snapshot.data())
        this.replaceWithSpace(this.degrees)
      })
    })
    return [];
  }
  
  replaceWithSpace(a: Array<any>): any[]{
    for (var i = 0; i < a.length; i++){
      a[i] = a[i].replace('_', ' ');
    }
    return a;
  }

  loadDocs(s: string): any[]{
    console.log(s)
    const firestore = firebase.firestore();
    firestore.collection('/degrees').doc(s).get().then(doc => {
      console.log(doc.data())
      this.courses = doc.data().courses;
      console.log(doc.data())
    }).catch(function(error) {
      return this.courses;
    })
    return [];
  }

}
