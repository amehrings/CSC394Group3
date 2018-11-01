import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as firebase from 'firebase/app';
import { AngularFirestore, QuerySnapshot } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {waitForMap} from "@angular/router/src/utils/collection";
import {forEach} from "@angular-devkit/schematics";


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
  heart = 'fa fa-heart';
  noHeart = 'fa fa-heart-o';

  selectedJob: string;

  dbSkills: any[];
  dbSkillsRating: any[];
  dbMap: Map<String, any>;
  jobsMap: Map<String, any>;
  jobSkills: Map<String, any[]> = new Map();
  jobScores: any[] = [];
  dbCourses: any[];

  degrees: any[];
  jobs: any[];
  saved: any[] = ["saved1", "saved2"];
  matches: any[] = [];

  
  constructor(    private route: ActivatedRoute,
    private afs: AngularFirestore
    ) { 
      this.dbSkills= this.getUserSkills();
      this.jobsMap = this.getJobsMap();
    console.log(this.jobsMap);
    }

  ngOnInit() {
    this.jobs = this.getJobs();
    console.log(this.jobSkills);
    this.degrees = this.getDegrees();
    this.choicesArray = this.degrees;

  }

  switchHeart(id: String){
    var result = this.jobsCheck(id);

    var jobsUpdate={};
    jobsUpdate['jobsMap.'+id] = !result;
    this.afs.collection('users').doc(firebase.auth().currentUser.uid).update(jobsUpdate);
    this.getJobsMap();
  // var temp = this.heart;
  // this.heart = this.oldHeart;
  // this.oldHeart = temp;
  } 

  jobsCheck(job: String){
    return this.jobsMap.get(job)
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
    //console.log(this.dbSkills)
    
  }

  getJobsMap(): Map<String,any>{
    const firestore = firebase.firestore();
    firestore.collection('/users').doc(firebase.auth().currentUser.uid).get().then(doc => {
      this.jobsMap = this.getMap(doc.data().jobsMap);
    }).catch(function(error) {
      return null;
    });
    return new Map();
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

  getMatchScore(jobskill){
    let matchScore = 0;
    //console.log(this.jobSkills.get(job.replace(' ','_')));

    for(let i=0; i<jobskill.length; i++){
      if(this.dbSkills.includes(jobskill[i][1].toLowerCase())){
        matchScore += 10;
      }
    }
    return matchScore;
  }

  getJobs(): any[]{
    const firestore = firebase.firestore();
    firestore.collection('/jobs').get().then((snapshot) =>{
      snapshot.forEach(snapshot => {
        // console.log(snapshot.id)
        this.jobs.push(snapshot.id);
        //console.log(snapshot.data());
        this.jobSkills.set(snapshot.id,Array.from(Object.entries(snapshot.data())));
        //console.log(this.jobSkills);
        this.replaceWithSpace(this.jobs)

      });
      //console.log(this.jobSkills);
      let jobskill = [];
      for(let i=0; i<this.jobs.length;i++){
        jobskill = this.jobSkills.get(this.jobs[i].replace(new RegExp(" ","g"),'_'));
        //console.log(this.jobs[i].replace(new RegExp(" ","g"),'_'));
        //console.log(jobskill);
        this.jobScores.push(this.getMatchScore(jobskill));
        this.matches.push([this.jobs[i],this.jobScores[i]]);
      }
      this.matches.sort(this.Comparator);
      console.log(this.matches);
    });
    return [];
  }
  Comparator(a,b){
    if (a[1] < b[1]) return 1;
    if (a[1] > b[1]) return -1;
    return 0;
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
