import { Chart } from 'chart.js';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  chart = [];

  constructor() { }

  ngOnInit() {
    var canvas = <HTMLCanvasElement>document.getElementById("myChart");
    var ctx = canvas.getContext("2d");
    this.chart = new Chart(ctx,{
      type: 'doughnut',
      data: {
          labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
          datasets: [{
              // label: '# of Votes',
              data: [12, 19, 3, 5, 2, 3],
              backgroundColor: this.randomColorFill(6),
              borderColor: this.randomColorBorder(6),
              borderWidth: 1
          }]
      },
      options: {
        legend: {
          display: false
       },
       responsive: false,
          scales: {
              // yAxes: [{
              //     ticks: {
              //         beginAtZero:true
              //     }
              // }]
          }
      }
  });
    console.log(this.chart)
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
}
