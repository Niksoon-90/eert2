import { Component, OnInit } from '@angular/core';
import {ISession} from "../../models/shipmenst.model";
import {ShipmentsService} from "../../services/shipments.service";
import {ForecastingModelService} from "../../services/forecasting-model.service";
import {IHorizonforecast} from "../../models/calculations.model";
import {Router} from "@angular/router";
import {ModalService} from "../../services/modal.service";


@Component({
  selector: 'app-import-steps-one',
  templateUrl: './import-steps-one.component.html',
  styleUrls: ['./import-steps-one.component.scss']
})
export class ImportStepsOneComponent implements OnInit {
  initialDate: ISession[];
  horizonforecast: IHorizonforecast[];
  scenarioMacro: any[];
  stepOne: any;

  constructor(
    private shipmentsService: ShipmentsService,
    public forecastModelService: ForecastingModelService,
    private router: Router,
    private modalService: ModalService
  ) {}

  ngOnInit(): void  {
    this.getInitialDate()
    this.stepOne = this.forecastModelService.ticketInformation.stepOne;
    if( this.forecastModelService.ticketInformation.stepOne.calcYearsNumber !== null){
      this.horizonforecast = [];
      for (let i = 5; i <= 15; i++) {
        this.horizonforecast.push({name: i});
      }
    }
    this.scenarioMacro = [
      {id: 1, name: 'Пессимистичное значение'},
      {id: 1, name: 'Базовое значение'},
      {id: 1, name: 'Оптимистичное значение'}
    ]
  }


  getInitialDate(){
    this.shipmentsService.getShipSession().subscribe(
      res => this.initialDate = res,
      err => {this.modalService.open(err.error.message); console.log(err.error)},
      () => console.log('complede')
    );
  }

  nextPage() {
    if(this.stepOne !== undefined){
      console.log(this.stepOne)
      this.forecastModelService.ticketInformation.stepOne.Session = this.stepOne.Session;
      this.forecastModelService.ticketInformation.stepOne.calcYearsNumber = this.stepOne.calcYearsNumber;
      this.router.navigate(['steps/mathForecast']);
    }

  }

  setInitialDate(event: any) {

    if(this.stepOne.idShipments && event.value){
      console.log('setInitialDate', event.value.id)
    }
    console.log('test', this.forecastModelService.ticketInformation.stepOne.id)

  }


}
