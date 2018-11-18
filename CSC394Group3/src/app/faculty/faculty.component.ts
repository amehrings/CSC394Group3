import { Chart } from 'chart.js';
import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';

@Component({
  selector: 'app-faculty',
  templateUrl: './faculty.component.html',
  styleUrls: ['./faculty.component.scss']
})
export class FacultyComponent implements OnInit {

  chart = [];
  dbSkillsMap: Map<string, {}> = new Map();
  dbSkillsNames = [];
  dbSkillsFrequency = [];
  topValuesNames: any[];
  topValues: any[] = [];
  result: any[] = [];
  degrees= [];

  constructor(public afs: AngularFirestore) {
  }

  ngOnInit() {
    var count= 0;
    var degreeCount=0;
    this.getSkillsFrequenciesCollection().subscribe(doc =>{
      this.dbSkillsMap = this.getMap(doc["skillsFrequency"])
      this.dbSkillsNames = this.getKeys(doc["skillsFrequency"])
      this.dbSkillsFrequency = this.getValues(doc["skillsFrequency"])
      this.topValues = this.getValues(doc["skillsFrequency"]).sort((a,b) => b - a).slice(0,10);
      // console.log(this.topValues)
      this.topValuesNames = []

      this.result = [];
      for (let i = 0; i < this.topValues.length; i++){
            if(!this.topValuesNames.includes(Object.keys(doc["skillsFrequency"]).find(key => doc["skillsFrequency"][key] === this.topValues[i]))){
              this.topValuesNames.push(Object.keys(doc["skillsFrequency"]).find(key => doc["skillsFrequency"][key] === this.topValues[i]))
              this.result.push([Object.keys(doc["skillsFrequency"]).find(key => doc["skillsFrequency"][key] === this.topValues[i]), this.topValues[i]])
            }else{
              // console.log(Object.keys(doc["skillsFrequency"]).find(key => doc["skillsFrequency"][key] === this.topValues[i]))
            }
      }
      // console.log(this.result)
      // console.log(this.topValuesNames)



      //CHART
      var canvas = <HTMLCanvasElement>document.getElementById("myChart");
      var ctx = canvas.getContext("2d");
      if(count <= 0){
        this.chart = new Chart(ctx,{
          type: 'doughnut',
          data: {
              labels: this.dbSkillsNames,
              datasets: [{
                  // label: '# of Votes',
                  data: this.dbSkillsFrequency,
                  backgroundColor: this.randomColorFill(this.dbSkillsFrequency.length),
                  borderColor: this.randomColorBorder(this.dbSkillsFrequency.length),
                  borderWidth: 1
              }]
          },
          options: {
            legend: {
              display: false
          },
          responsive: true
          }
        });
        count++;
      }
    })


    this.getUserInfo().subscribe(doc =>{
      this.degrees = this.getDegrees(doc)
      
      //CHART
      var canvas = <HTMLCanvasElement>document.getElementById("degreeChart");
      var ctx = canvas.getContext("2d");
      if(degreeCount <= 0){
        this.chart = new Chart(ctx,{
          type: 'horizontalBar',
          data: {
              labels: this.degrees[0],
              datasets: [{
                  data: this.degrees[1],
                  backgroundColor: this.randomColorFill(this.degrees[0].length),
                  borderColor: this.randomColorBorder(this.degrees[0].length),
                  borderWidth: 1
              }]
          },
          options: {
            legend: {
              display: false
             },
              scales: {
                  yAxes: [{
                      ticks: {
                          beginAtZero:true
                      }
                  }],
                  xAxes: [{
                    ticks: {
                      autoSkip: false,
                      beginAtZero: true
                      //fontSize: 20
                    }
                  }]
              }
          },
          responsive: true
        });
        degreeCount++;
      }
    })
  }
  
  getDegrees(oldArr){
    var a = [], b = [], prev;
    var arr = []

    for(let i=0; i <oldArr.length; i++){
        arr.push(oldArr[i].degree)
    }
    arr.sort();
    for ( var i = 0; i < arr.length; i++ ) {
        if ( arr[i] !== prev ) {
            a.push(arr[i]);
            b.push(1);
        } else {
            b[b.length-1]++;
        }
        prev = arr[i];
    }
    console.log(a)
    console.log(b)

    return [a, b];
  }

  randomColorFill(length): any[] {
    var colorChart = [];

    for(let i =0; i< length; i++){
      colorChart.push('rgba('+ Math.floor(Math.random() * 255)+ ',' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) +',0.4)')
    }

    return colorChart
  }

  randomColorBorder(length): any[] {
    var colorChart = [];

    for(let i =0; i< length; i++){
      colorChart.push('rgba(68,68,68,1)')
    }

    return colorChart
  }

  getKeys(map){
    var temp = Array.from(this.getMap(map).keys())
    var temp2 = Array.from(this.getMap(map).values())
    var final = []
    for(let i = 0; i < temp.length; i++){
      if(temp2[i] != 0){
        final.push(temp[i])
      }
    }
    return final
  }

  getValues(map){
    var temp = Array.from(this.getMap(map).values())
    var final = []
    for(let i = 0; i < temp.length; i++){
      if(temp[i] != 0){
        final.push(temp[i])
      }
    }
    return final
  }

  getMap(map){
    return new Map(Object.entries(map))
  }

  getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
  }

  getSkillsFrequenciesCollection(){
    var temp = this.afs.collection('/stats').doc("Skill Frequency").valueChanges();
    return temp;
  }

  getUserInfo(){
    var temp = this.afs.collection('/users').valueChanges();
    return temp;
  }
}

}
