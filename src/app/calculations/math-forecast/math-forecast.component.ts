import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {ForecastingModelService} from "../../services/forecasting-model.service";
import {CalculationsService} from "../../services/calculations.service";
import {ICalculatingPredictiveRegression} from "../../models/calculations.model";
import {ModalService} from "../../services/modal.service";

@Component({
  selector: 'app-math-forecast',
  templateUrl: './math-forecast.component.html',
  styleUrls: ['./math-forecast.component.scss']
})
export class MathForecastComponent implements OnInit {
  mathematicalForecastTable: ICalculatingPredictiveRegression[];

  constructor(
    private router: Router,
    public forecastModelService: ForecastingModelService,
    private calculationsService: CalculationsService,
    private modalService: ModalService
  ) { }

  ngOnInit(): void {
    this.createTable()
  }
  createTable(){
    console.log(this.forecastModelService.getTicketInformation().stepOne.Session['id'])
    console.log(this.forecastModelService.getTicketInformation().stepOne.calcYearsNumber['name'])
    this.calculationsService.getCalculationMultiple(this.forecastModelService.getTicketInformation().stepOne.Session['id'], this.forecastModelService.getTicketInformation().stepOne.calcYearsNumber['name'],this.forecastModelService.getTicketInformation().stepOne.scenarioMacro['type'] )
      .subscribe(
        res => {this.mathematicalForecastTable = res;},
        error => this.modalService.open(error.error.message),
        () => console.log('HTTP request completed.')
      )
  }

  nextPage() {
    this.router.navigate(['steps/forecast']);
  }

  prevPage() {
    this.router.navigate(['steps/import']);
  }
}
