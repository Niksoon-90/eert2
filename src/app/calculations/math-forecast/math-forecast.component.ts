import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-math-forecast',
  templateUrl: './math-forecast.component.html',
  styleUrls: ['./math-forecast.component.scss']
})
export class MathForecastComponent implements OnInit {
  customers: any

  constructor(private router: Router) { }

  ngOnInit(): void {
      this.customers = [
        {z1:'Тест значение 1', z2:'Тест значение 1', z3:'Тест значение 1'},
        {z1:'Тест значение 2', z2:'Тест значение 2', z3:'Тест значение 2'},
        {z1:'Тест значение 3', z2:'Тест значение 3', z3:'Тест значение 3'},
        {z1:'Тест значение 4', z2:'Тест значение 4', z3:'Тест значение 4'},
        {z1:'Тест значение 5', z2:'Тест значение 5', z3:'Тест значение 5'},
        {z1:'Тест значение 6', z2:'Тест значение 6', z3:'Тест значение 6'},
        {z1:'Тест значение 7', z2:'Тест значение 7', z3:'Тест значение 7'},
        {z1:'Тест значение 8', z2:'Тест значение 8', z3:'Тест значение 8'},
        {z1:'Тест значение 9', z2:'Тест значение 9', z3:'Тест значение 9'}
      ]


  }

  nextPage() {
    this.router.navigate(['steps/forecast']);
  }

  prevPage() {
    this.router.navigate(['steps/import']);
  }
}
