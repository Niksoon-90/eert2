import { Component, OnInit } from '@angular/core';
import {MenuItem} from "primeng/api";

@Component({
  selector: 'app-calculations',
  templateUrl: './calculations.component.html',
  styleUrls: ['./calculations.component.scss']
})
export class CalculationsComponent implements OnInit {
  forecastingModel: MenuItem[];
  forecastingModelIndex: 0;
  constructor() { }


  ngOnInit() {
    this.forecastingModel = [
      {label: 'Шаг 1', routerLink: 'import'},
      {label: 'Шаг 2', routerLink: 'mathForecast'},
      {label: 'Шаг 3', routerLink: 'forecast'},
      {label: 'Шаг 4', routerLink: 'payment'},
      {label: 'Шаг 5', routerLink: 'summVolumes'},
      {label: 'Шаг 6', routerLink: 'export'},
    ];
    console.log(this.forecastingModelIndex)
  }
}
