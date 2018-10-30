import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as firebase from 'firebase/app';
import { AngularFirestore, QuerySnapshot } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-job-landing',
  templateUrl: './job-landing.component.html',
  styleUrls: ['./job-landing.component.scss']
})
export class JobLandingComponent implements OnInit {

  firstColumn = 'Degrees';
  secondColumn = 'Jobs';
  choicesArray: any;
  flag: boolean = true;
  selectedValue;
  oldHeart = 'fa fa-heart';
  heart = 'fa fa-heart-o';

  selectedJob: string;

  dbSkills: any[];
  dbSkillsRating: any[];
  dbMap: Map<String, any>;
  dbCourses: any[];

  degrees: any[];
  jobs: any[];
  saved: any[] = ["saved1", "saved2"];

  constructor(    private route: ActivatedRoute,
    private afs: AngularFirestore
    ) { 
      this.dbSkills= this.getUserSkills();

    }

  ngOnInit() {
    this.jobs = this.getJobs();
    this.degrees = this.getDegrees();
    this.choicesArray = this.degrees;

  }

  switchHeart(id){
    console.log(id)
    var selectedHeart = document.getElementById(id);
    console.log(selectedHeart.innerHTML)
    var temp = this.heart;
    this.heart = this.oldHeart;
    this.oldHeart = temp;
  }

  switchColumn(){
    var temp = this.firstColumn;    
    this.firstColumn = this.secondColumn;
    this.secondColumn = temp;

    if (this.flag == true){
      this.choicesArray = this.jobs;
      this.selectedValue = undefined;
      this.flag = false;
    } else {
      this.choicesArray = this.degrees;
      this.selectedValue = undefined;
      this.flag = true;
    }
  }

  performMatch(option){
    if(option.isUserInput){
      console.log(option.source.value)
    }
    console.log(this.dbSkills)
    
  }

  getUserSkills(): any[] {
    const firestore = firebase.firestore();
    firestore.collection('/users').doc(firebase.auth().currentUser.uid).get().then(doc => {
      this.dbSkills = this.getKeys(doc.data().skillsMap);
      this.dbSkillsRating = this.getValues(doc.data().skillsMap);
      this.dbMap = this.getMap(doc.data().skillsMap);
      this.dbCourses = doc.data().courses;
    }).catch(function(error) {
      return null;
    })
    return [];
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

  getJobs(): any[]{
    const firestore = firebase.firestore();
    firestore.collection('/jobs').get().then((snapshot) =>{
      snapshot.forEach(snapshot => {
        // console.log(snapshot.id)
        this.jobs.push(snapshot.id)
        // console.log(snapshot.data())
        this.replaceWithSpace(this.jobs)

      })
    })
    return [];
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
      // console.log(a[i])
    }
    return a;
  }
}
