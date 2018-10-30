import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { skillsSearchService } from '../skills-search.service';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';
import { MatListOption} from '@angular/material/list';
import { AngularFirestore } from 'angularfire2/firestore';
import { UserComponent } from '../user/user.component';
import * as firebase from 'firebase/app';
import { MatStepper } from '@angular/material';


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
  concentrations: any[];
  dbCourseMap: Map<string, {}>;
  @ViewChild('stepper') stepper: MatStepper;
  isSelected: number= 0;

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

  underscoreFix(s: string): string{
    for (var i = 0; i < s.length; i++){
      s = s.replace(' ', '_');
    }
    return s;
  }

  clearArray(){
    this.courses=[];
    this.concentrations=[];
    console.log(this.isSelected)
  }

  clearArray2(){
    this.courses=[];
    console.log(this.isSelected)

  }
  
  getKeys(map){
    return [... Array.from(map.keys()).slice(0)]
  }

  getValues(map){
    var objFirst = Object.entries(Array.from(map.values()))[0]
    var objSecond = objFirst[1]
    var finalMap = new Map(Object.entries(objSecond))
    return Array.from(finalMap.keys())
  }

  getCourseMap(map){
    var objFirst = Object.entries(Array.from(map.values()))[0]
    var test = map
    console.log(test)
    var objSecond = objFirst[1]
    console.log(objSecond)
    var finalMap = new Map(Object.entries(objSecond))
    console.log(finalMap)
    return finalMap
  }

  getCourses(option){
    if(option.selected == true){
      var index;
      for(let i = 0; i < this.concentrations.length; i++){
        if (option.value === this.concentrations[i]){
            index = i;
        }
      }
      var objFirst = Object.entries(Array.from(this.dbCourseMap.values()))[index]
      var objSecond = objFirst[1]
      var finalMap = new Map(Object.entries(objSecond))
      this.courses = Array.from(finalMap.keys())
      this.stepper.next()
      console.log(this.isSelected)
    }
  }

  courseSelection(option: MatListOption) {
    if(option.selected == true){     
      // skillsUpdate['skillsMap.'+option.value.toLowerCase()] = 0;
      // this.afs.collection('users').doc(firebase.auth().currentUser.uid).update(skillsUpdate)
      this.afs.collection('users').doc(firebase.auth().currentUser.uid).update({courses: firebase.firestore.FieldValue.arrayUnion(option.value)});
    }    
  }  

  getMap(map){
    return new Map(Object.entries(map))
  }

  isEmpty(a: any[]): boolean{
    if (a.length == 0){
      return true
    }
    return false
  }

  loadDocs(option: MatListOption): any[]{
    if(option.selected == true && this.isSelected < 1){
      this.isSelected++
      const firestore = firebase.firestore();
      firestore.collection('/degrees').doc(this.underscoreFix(option.value)).get().then(doc => {
        if(doc.data().courses){
          this.courses = doc.data().courses;
        }else{
          this.concentrations = this.getKeys(this.getMap(doc.data()))
          this.courses = this.getValues(this.getMap(doc.data()))
          this.dbCourseMap = this.getMap(doc.data())
        }

        if (typeof(this.concentrations) == 'undefined' || this.concentrations.length == 0){
          this.stepper.selectedIndex = 2;
        }else{
          this.stepper.next()
        }
      })
      return [];
    }
  }
}
