import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-job-landing',
  templateUrl: './job-landing.component.html',
  styleUrls: ['./job-landing.component.scss']
})
export class JobLandingComponent implements OnInit {

  firstColumn = 'Degrees';
  secondColumn = 'Jobs';
  choicesArray: any[] = [];
  flag: boolean = true;

  oldHeart = 'fa fa-heart';
  heart = 'fa fa-heart-o';


  degrees: any[] = ["degree1", "degree2"];
  jobs: any[] = ["job1", "job2"];
  saved: any[] = ["saved1", "saved2"];

  constructor(    private route: ActivatedRoute,
    ) { }

  ngOnInit() {
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
}
