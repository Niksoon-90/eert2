import { Component, OnInit } from '@angular/core';
import {ISession} from "../../models/shipmenst.model";
import {ShipmentsService} from "../../services/shipments.service";
import {ForecastingModelService} from "../../services/forecasting-model.service";
import {IHorizonforecast} from "../../models/calculations.model";
import {Router} from "@angular/router";


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
    public forecastModelService: ForecastingModelService,
    private router: Router,
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
  }


  getInitialDate(){
    this.shipmentsService.getShipSession().subscribe(
      res => {this.initialDate = res;
      }
    );
  }

  nextPage() {
    if(this.stepOne !== undefined){
      this.forecastModelService.ticketInformation.stepOne.Session = this.stepOne.Session;
      this.forecastModelService.ticketInformation.stepOne.calcYearsNumber = this.stepOne.calcYearsNumber;
      console.log( this.forecastModelService.ticketInformation.stepOne.calcYearsNumber['name'])
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
