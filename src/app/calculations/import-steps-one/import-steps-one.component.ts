import { Component, OnInit } from '@angular/core';
import {ISession} from "../../models/shipmenst.model";
import {ShipmentsService} from "../../services/shipments.service";
import {Router} from "@angular/router";
import {ForecastingModelService} from "../../services/forecasting-model.service";
import {IHorizonforecast} from "../../models/calculations.model";

@Component({
  selector: 'app-import-steps-one',
  templateUrl: './import-steps-one.component.html',
  styleUrls: ['./import-steps-one.component.scss']
})
export class ImportStepsOneComponent implements OnInit {
  initialDate: ISession[];
  horizonforecast: IHorizonforecast[];
  stepOne: any;

  constructor(
    private shipmentsService: ShipmentsService,
    private router: Router,
    public forecastModelService: ForecastingModelService) {
    this.horizonforecast = [
        {id: 1, name: 5},
        {id: 2, name: 6},
        {id: 3, name: 7},
        {id: 4, name: 8},
        {id: 5, name: 9},
        {id: 6, name: 10},
        {id: 7, name: 11},
        {id: 8, name: 12},
        {id: 9, name: 13},
        {id: 10, name: 14},
        {id: 11, name: 15}
    ]
  }

  ngOnInit(): void  {
    this.getInitialDate()
    this.stepOne = this.forecastModelService.ticketInformation.stepOne;
  }

  getInitialDate(){
    this.shipmentsService.getShipSession().subscribe(
      res => {this.initialDate = res;
      }
    )
  }

  nextPage() {
      this.forecastModelService.ticketInformation.stepOne = this.stepOne;
      this.router.navigate(['steps/mathForecast']);
  }

  setInitialDate(event: any) {
    if(this.stepOne.idShipments && event.value){
      console.log('setInitialDate', event)
    }
    console.log('test',this.forecastModelService.ticketInformation.stepOne)
  }
}
