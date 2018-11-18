import { Chart } from 'chart.js';
import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  chart = [];
  dbSkillsMap: Map<string, {}> = new Map();
  dbSkillsNames = [];
  dbSkillsFrequency = [];
  topValuesNames: any[];
  topValues: any[] = [];
  result: any[] = [];

  constructor(public afs: AngularFirestore) {
  }

  ngOnInit() {
    var count= 0;
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
          responsive: false
          }
        });
        count++;
      }


    })
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
}
