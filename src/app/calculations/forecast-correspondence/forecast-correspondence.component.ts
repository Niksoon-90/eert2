import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {ICalculatingPredictiveRegression, ISelectMethodUsers} from "../../models/calculations.model";
import {ForecastingModelService} from '../../services/forecasting-model.service';
import {ShipmentsService} from "../../services/shipments.service";
import {CalculationsService} from "../../services/calculations.service";

@Component({
  selector: 'app-forecast-correspondence',
  templateUrl: './forecast-correspondence.component.html',
  styleUrls: ['./forecast-correspondence.component.scss']
})
export class ForecastCorrespondenceComponent implements OnInit {
  methodUsers: ISelectMethodUsers[];
  testData: any;
  stepThree: any;
  mathematicalForecastTable: ICalculatingPredictiveRegression[];
  reportingНear: '';

  constructor(
    private router: Router,
    public forecastModelService: ForecastingModelService,
    private calculationsService: CalculationsService,
    ) {
    this.methodUsers = [
      {id: 1, type: 'simple', name:'Вычисление прогноза корреспонденций по методу наименьших квадратов'},
      {id: 2, type: 'fiscal', name:'Вычисление прогноза корреспонденций по отчётному году'},
      {id: 3, type: 'fixed',  name:'Вычисление прогноза корреспонденций по тенденции (по фиксированным промежуткам)'},
      {id: 4, type: 'increasing',  name:'Вычисление прогноза корреспонденций по тенденции (по увеличивающимся промежуткам)'},
      {id: 5, type: 'average', name:'Вычисление прогноза корреспонденций по среднему арифметическому'},
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
    this.stepThree = this.forecastModelService.ticketInformation.stepThree;
    if(this.forecastModelService.ticketInformation.stepThree.forecastingStrategy !== null){
      this.calculateForecastingStrategy();
    }

  }


  prevPage() {
    this.router.navigate(['steps/mathForecast']);
  }

  nextPage() {
    this.forecastModelService.ticketInformation.stepThree.forecastingStrategy = this.stepThree.forecastingStrategy;
    this.router.navigate(['steps/payment']);
  }

  calculateForecastingStrategy() {
    switch (this.stepThree.forecastingStrategy.type) {
      case 'simple':
       this.calculationsService.getCalculationSimple(this.forecastModelService.getTicketInformation().stepOne.Session['id'], this.forecastModelService.getTicketInformation().stepOne.calcYearsNumber['name'])
         .subscribe( res => this.mathematicalForecastTable = res)
        break;
      case 'fiscal':
        this.calculationsService.getCalculationFiscal(this.forecastModelService.getTicketInformation().stepOne.Session['id'], this.forecastModelService.getTicketInformation().stepOne.calcYearsNumber['name'], this.reportingНear)
          .subscribe( res => console.log(res))
        break;
      case 'fixed':
        this.calculationsService.getCalculationFixed(this.forecastModelService.getTicketInformation().stepOne.Session['id'], this.forecastModelService.getTicketInformation().stepOne.calcYearsNumber['name'])
          .subscribe( res => this.mathematicalForecastTable = res)
        break;
      case 'increasing':
        this.calculationsService.getCalculationIncreasing(this.forecastModelService.getTicketInformation().stepOne.Session['id'], this.forecastModelService.getTicketInformation().stepOne.calcYearsNumber['name'])
          .subscribe( res => this.mathematicalForecastTable = res)
        break;
      case 'average':
        this.calculationsService.getCalculationAverage(this.forecastModelService.getTicketInformation().stepOne.Session['id'], this.forecastModelService.getTicketInformation().stepOne.calcYearsNumber['name'])
          .subscribe( res => this.mathematicalForecastTable = res)
        break;
      default:
        break;
    }
  }
}
