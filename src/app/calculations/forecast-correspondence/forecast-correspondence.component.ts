import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {ISelectMethodUsers} from "../../models/calculations.model";

@Component({
  selector: 'app-forecast-correspondence',
  templateUrl: './forecast-correspondence.component.html',
  styleUrls: ['./forecast-correspondence.component.scss']
})
export class ForecastCorrespondenceComponent implements OnInit {
  methodUsers: ISelectMethodUsers[];
  methodItemUsers: ISelectMethodUsers;

  constructor(private router: Router) {
    this.methodUsers = [
      {id: 1, name:'Метод наименьших квадратов'},
      {id: 2, name:'Метод по отчетному году'},
      {id: 3, name:'Метод по тенденции'},
      {id: 4, name:'Метод по среднему арифметическому значению'},
    ]
  }


  ngOnInit(): void {
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
