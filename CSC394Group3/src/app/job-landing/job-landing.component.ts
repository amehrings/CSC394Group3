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

  oldHeart = 'fa fa-heart';
  heart = 'fa fa-heart-o';


  degrees: any[] = ["degree1", "degree2"];
  jobs: any[];
  saved: any[] = ["saved1", "saved2"];

  constructor(    private route: ActivatedRoute,
    private afs: AngularFirestore
    ) { 
    }

  ngOnInit() {
    this.jobs = this.getJobs();
    this.degrees = this.getDegrees();
    this.choicesArray = this.degrees;

  }

  switchHeart(){
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
      this.flag = false;
    } else {
      this.choicesArray = this.degrees;
      this.flag = true;
    }
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
      console.log(a[i])
    }
    return a;
  }
}
