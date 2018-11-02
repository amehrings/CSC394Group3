import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as firebase from 'firebase/app';
import { AngularFirestore } from 'angularfire2/firestore';

@Component({
  selector: 'app-job-landing',
  templateUrl: './job-landing.component.html',
  styleUrls: ['./job-landing.component.scss']
})
export class JobLandingComponent implements OnInit {

  firstColumn = 'Computer Science';
  secondColumn = 'Jobs';
  switchCount = 0;

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

  finalArraySkills: any[];
  newFinalArraySkills: any[];
  
  concentrations: any[];
  courses: any[];
  degrees: any[];
  jobs: any[];
  saved: any[] = ["saved1", "saved2"];
  matches: any[] = [];
  degreeMatches: any[] = [];
  degreeScores: any[] = [];
  dbCourseMap: Map<string, {}>;


  
  constructor(    private route: ActivatedRoute,
    private afs: AngularFirestore
    ) { 
      this.dbSkills= this.getUserSkills();
      this.jobsMap = this.getJobsMap();
      this.getDegreeSkills();
    }

  ngOnInit() {
    this.jobs = this.getJobs();
    this.degrees = this.getDegrees();
    this.choicesArray = this.jobs;

  }

  

  jobsCheck(job: String){
    return this.jobsMap.get(job)
  }

  switchColumn(){
    if(this.switchCount == 0){
      this.firstColumn = this.secondColumn;
      this.secondColumn = "Degrees";
    }else{
      var temp = this.firstColumn;    
      this.firstColumn = this.secondColumn;
      this.secondColumn = temp;
    }

    if (this.flag == true){
      this.choicesArray = this.jobs;
      this.selectedValue = undefined;
      this.flag = false;
    } else {
      this.choicesArray = this.degrees;
      this.selectedValue = undefined;
      this.flag = true;
    }
    this.switchCount++;
  }

  performMatch(option){
    if(option.isUserInput){
      this.getNewDegreeSkills(option.source.value)
    }    
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

  getDegreeSkills(){
    const firestore = firebase.firestore();

    firestore.collection('/degrees').doc(this.underscoreFix("Computer_Science")).get().then(doc => {
      if(doc.data().courses){
        this.courses = doc.data().courses;
      }else{
        this.concentrations = this.getKeys(this.getMap(doc.data()))
        this.courses = this.getValues(this.getMap(doc.data()))
        this.finalArraySkills = this.getDegreeSkillsFinal(this.getMap(doc.data()))
      }
    })
  }

  getNewDegreeSkills(name){
    const firestore = firebase.firestore();

    firestore.collection('/degrees').doc(this.underscoreFix(name)).get().then(doc => {
      if(doc.data().courses){
        this.courses = doc.data().courses;
      }else{
        this.concentrations = this.getKeys(this.getMap(doc.data()))
        this.courses = this.getValues(this.getMap(doc.data()))
        this.finalArraySkills = this.getDegreeSkillsFinal(this.getMap(doc.data()))
      }

      var degreeSkill = [];
      for(let i=0; i<this.jobs.length;i++){
        degreeSkill = this.jobSkills.get(this.jobs[i].replace(new RegExp(" ","g"),'_'));
        this.degreeMatches[i] = [this.jobs[i], this.getDegreeScore(degreeSkill)]
      }
      this.degreeMatches.sort(this.Comparator);
    })
  }

  getDegreeSkillsFinal(map){
    var objFirst = Object.entries(Array.from(map.values()))[0]
    var objSecond = objFirst[1]
    var finalMap = new Map(Object.entries(objSecond))
    var merged = [].concat.apply([], Array.from(finalMap.values()))
    return this.removeDuplicates(merged)
  }

  getJobs(): any[]{
    const firestore = firebase.firestore();
    firestore.collection('/jobs').get().then((snapshot) =>{
      snapshot.forEach(snapshot => {
        this.jobs.push(snapshot.id);
        this.jobSkills.set(snapshot.id,Array.from(Object.entries(snapshot.data())));
        this.replaceWithSpace(this.jobs)

      });
      let jobskill = [];
      for(let i=0; i<this.jobs.length;i++){
        jobskill = this.jobSkills.get(this.jobs[i].replace(new RegExp(" ","g"),'_'));
        this.jobScores.push(this.getMatchScore(jobskill));
        this.matches.push([this.jobs[i],this.jobScores[i]]);
      }
      this.matches.sort(this.Comparator);

      let degreeskill = [];
      for(let i=0; i<this.jobs.length;i++){
        degreeskill = this.jobSkills.get(this.jobs[i].replace(new RegExp(" ","g"),'_'));
        this.degreeScores.push(this.getDegreeScore(degreeskill));
        this.degreeMatches.push([this.jobs[i],this.degreeScores[i]]);
      }
      this.degreeMatches.sort(this.Comparator);
    });
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
    for(let i=0; i<jobskill.length; i++){
      if(this.dbSkills.includes(jobskill[i][1].toLowerCase())){
        matchScore += 10 * (<number> this.dbMap.get(jobskill[i][1].toLowerCase()));
      }
    }
    matchScore = Math.round((matchScore/500) * 100);
    return matchScore;
  }

  getDegreeScore(jobskill){
    let matchScore = 0;
    for(let i=0; i<jobskill.length; i++){
      if(this.finalArraySkills.includes(jobskill[i][1])){
        matchScore += 10;
      }
    }
    return matchScore;
  }

  switchHeart(id: String){
    var result = this.jobsCheck(id);

    var jobsUpdate={};
    jobsUpdate['jobsMap.'+id] = !result;
    this.afs.collection('users').doc(firebase.auth().currentUser.uid).update(jobsUpdate);
    this.getJobsMap();
  } 

  removeDuplicates(arr){
    let unique_array = []
    for(let i = 0;i < arr.length; i++){
        if(unique_array.indexOf(arr[i]) == -1){
            unique_array.push(arr[i])
        }
    }
    return unique_array
  }

  underscoreFix(s: string): string{
    for (var i = 0; i < s.length; i++){
      s = s.replace(' ', '_');
    }
    return s;
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
        this.degrees.push(snapshot.id)
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
}
