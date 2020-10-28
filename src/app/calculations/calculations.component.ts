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
      {label: 'Шаг 1'},
      {label: 'Шаг 2'},
      {label: 'Шаг 3'},
      {label: 'Шаг 4'},
      {label: 'Шаг 5'},
      {label: 'Шаг 6'},
    ];
    console.log(this.forecastingModelIndex)
  }
}
