import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {ISelectMethodUsers} from "../../models/calculations.model";
import {ForecastingModelService} from '../../services/forecasting-model.service';

@Component({
  selector: 'app-forecast-correspondence',
  templateUrl: './forecast-correspondence.component.html',
  styleUrls: ['./forecast-correspondence.component.scss']
})
export class ForecastCorrespondenceComponent implements OnInit {
  methodUsers: ISelectMethodUsers[];
  methodItemUsers: ISelectMethodUsers;
  testData: any;

  constructor(
    private router: Router,
    public forecastModelService: ForecastingModelService,
    ) {
    this.methodUsers = [
      {id: 1, name:'Метод наименьших квадратов'},
      {id: 2, name:'Метод по отчетному году'},
      {id: 3, name:'Метод по тенденции'},
      {id: 4, name:'Метод по среднему арифметическому значению'},
    ]
    this.testData = [
      {id:1, z1:1, z2:1, z3:1, z4:1, z5:1, z6:1, z7:1, z8:1, z9:1, z10:1, z11:1, z12:1, z13:1, z14:1},
      {id:2, z1:2, z2:1, z3:1, z4:1, z5:1, z6:1, z7:1, z8:1, z9:1, z10:1, z11:1, z12:1, z13:1, z14:1},
      {id:3, z1:3, z2:1, z3:1, z4:1, z5:1, z6:1, z7:1, z8:1, z9:1, z10:1, z11:1, z12:1, z13:1, z14:1},
      {id:4, z1:4, z2:1, z3:1, z4:1, z5:1, z6:1, z7:1, z8:1, z9:1, z10:1, z11:1, z12:1, z13:1, z14:1},
      {id:5, z1:5, z2:1, z3:1, z4:1, z5:1, z6:1, z7:1, z8:1, z9:1, z10:1, z11:1, z12:1, z13:1, z14:1},
      {id:6, z1:6, z2:1, z3:1, z4:1, z5:1, z6:1, z7:1, z8:1, z9:1, z10:1, z11:1, z12:1, z13:1, z14:1},
      {id:7, z1:7, z2:1, z3:1, z4:1, z5:1, z6:1, z7:1, z8:1, z9:1, z10:1, z11:1, z12:1, z13:1, z14:1},
      {id:8, z1:8, z2:1, z3:1, z4:1, z5:1, z6:1, z7:1, z8:1, z9:1, z10:1, z11:1, z12:1, z13:1, z14:1},
      {id:9, z1:9, z2:1, z3:1, z4:1, z5:1, z6:1, z7:1, z8:1, z9:1, z10:1, z11:1, z12:1, z13:1, z14:1},
      {id:10, z1:10, z2:1, z3:1, z4:1, z5:1, z6:1, z7:1, z8:1, z9:1, z10:1, z11:1, z12:1, z13:1, z14:1}
    ]
  }


  ngOnInit(): void {
    this.initials();
  }

  initials(){
    this.forecastModelService.getTicketInformation().stepOne.Session['id'],
      this.forecastModelService.getTicketInformation().stepOne.calcYearsNumber['name']
  }

  prevPage() {
    this.router.navigate(['steps/mathForecast']);
  }

  nextPage() {
    this.router.navigate(['steps/payment']);
  }

  test($event: any) {
    console.log($event)
  }
}
