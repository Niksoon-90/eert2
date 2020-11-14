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
  stepThree: any;
  mathematicalForecastTable: ICalculatingPredictiveRegression[];
  reportingYears= [];
  additionalInformation: boolean = false;
  sessionId: number;
  stepOnecalcYearsNumber:number;
  correspondence: any;

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

  }

  ngOnInit(): void {
    this.sessionId = this.forecastModelService.getTicketInformation().stepOne.Session['id']
    this.stepOnecalcYearsNumber = this.forecastModelService.getTicketInformation().stepOne.calcYearsNumber['name']
    this.stepThree = this.forecastModelService.ticketInformation.stepThree;
    this.additionalInfo(this.forecastModelService.ticketInformation.stepOne.Session['year']);
    if(this.forecastModelService.ticketInformation.stepThree.forecastingStrategy !== null){
      this.calculateForecastingStrategy();
    }

  }
  additionalInfo(items){
    console.log(items)
    for (let item of items) {
        this.reportingYears.push({"name": item});
    }
  }

  prevPage() {
    this.router.navigate(['steps/mathForecast']);
  }

  nextPage() {
    this.forecastModelService.ticketInformation.stepThree.forecastingStrategy = this.stepThree.forecastingStrategy;
    console.log(this.forecastModelService.getTicketInformation().stepOne)
    this.router.navigate(['steps/payment']);
  }

  calculateForecastingStrategy() {
    switch (this.stepThree.forecastingStrategy.type) {
      case 'simple':
       this.calculationsService.getCalculationSimple(this.sessionId, this.stepOnecalcYearsNumber)
         .subscribe(
           res => {this.mathematicalForecastTable = res, console.log(res)},
           err => console.log(err.error))
        break;
      case 'fiscal':
        this.calculationsService.getCalculationFiscal(this.sessionId, this.stepOnecalcYearsNumber, this.stepThree.yearsSession['name'])
          .subscribe( res => this.mathematicalForecastTable = res)
        break;
      case 'fixed':
        this.calculationsService.getCalculationFixed(this.sessionId, this.stepOnecalcYearsNumber)
          .subscribe( res => this.mathematicalForecastTable = res)
        break;
      case 'increasing':
        this.calculationsService.getCalculationIncreasing(this.sessionId, this.stepOnecalcYearsNumber)
          .subscribe( res => this.mathematicalForecastTable = res)
        break;
      case 'average':
        this.calculationsService.getCalculationAverage(this.sessionId, this.stepOnecalcYearsNumber)
          .subscribe( res => this.mathematicalForecastTable = res)
        break;
      default:
        break;
    }
  }

  spying(event: any) {
    event.value.type === 'fiscal'?  this.additionalInformation = true :  this.additionalInformation = false
  }
}
