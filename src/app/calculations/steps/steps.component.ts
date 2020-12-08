import { Component, OnInit } from '@angular/core';
import {MenuItem} from "primeng/api";

@Component({
  selector: 'app-steps',
  templateUrl: './steps.component.html',
  styleUrls: ['./steps.component.scss']
})
export class StepsComponent implements OnInit {
  forecastingModel: MenuItem[];
  forecastingModelIndex: 0;

  constructor() { }

  ngOnInit() {
    this.forecastingModel = [
      {label: 'Шаг 1', routerLink: 'import'},
      {label: 'Шаг 2', routerLink: 'mathForecast'},
      {label: 'Шаг 3', routerLink: 'forecast'},
      {label: 'Шаг 4', routerLink: 'payment'},
      // {label: 'Шаг 5', routerLink: 'summVolumes'},
      //{label: 'Шаг 5', routerLink: 'export'},
    ];
  }
}
