import { Component, OnInit } from '@angular/core';
import {ISession} from "../../models/shipmenst.model";
import {ShipmentsService} from "../../services/shipments.service";
import {ForecastingModelService} from "../../services/forecasting-model.service";
import {IHorizonforecast} from "../../models/calculations.model";
import {Router} from "@angular/router";
import {ModalService} from "../../services/modal.service";
import {CalculationsService} from "../../services/calculations.service";
import {MonoCargoSystemsModel} from "../../models/mono-cargo-systems.model";


@Component({
  selector: 'app-import-steps-one',
  templateUrl: './import-steps-one.component.html',
  styleUrls: ['./import-steps-one.component.scss']
})
export class ImportStepsOneComponent implements OnInit {
  initialDate: ISession[];
  correspondenceSession: ISession[];
  cargoSessionSender: any[]
  cargoSessionReceiver: any[]
  horizonforecast: IHorizonforecast[];
  scenarioMacro: any[];
  stepOne: any;

  oilCargo: MonoCargoSystemsModel[];
  ore: MonoCargoSystemsModel[];
  metallurgy: MonoCargoSystemsModel[];

  constructor(
    private shipmentsService: ShipmentsService,
    public forecastModelService: ForecastingModelService,
    private router: Router,
    private modalService: ModalService,
    private calculationsService: CalculationsService
  ) {}

  ngOnInit(): void  {
    this.getInitialDate();
    this.getCorrespondenceSession();
    this.getCargoSessionSessionSender();
    this.getCargoSessionSessionReceiver();
    this.getOil();
    this.getOre();
    this.getMetallurgy();

    this.stepOne = this.forecastModelService.ticketInformation.stepOne;
    if( this.forecastModelService.ticketInformation.stepOne.calcYearsNumber !== null){
      this.horizonforecast = [];
      for (let i = 5; i <= 15; i++) {
        this.horizonforecast.push({name: i});
      }
    }
    this.scenarioMacro = [
      {id: 1, name: 'Пессимистичное значение', type: 'PESSIMISTIC'},
      {id: 1, name: 'Базовое значение', type: 'BASE'},
      {id: 1, name: 'Оптимистичное значение', type: 'OPTIMISTIC'}
    ]
  }



  getInitialDate(){
    this.shipmentsService.getShipSession().subscribe(
      res => this.initialDate = res,
      error => this.modalService.open(error.error.message),
      () => console.log('complede')
    );
  }
  getCorrespondenceSession() {
    this.shipmentsService.getCorrespondenceSession().subscribe(
      res => {this.correspondenceSession = res; console.log(res)},
      error => this.modalService.open(error.message),
      () => console.log()
    )
  }
  getCargoSessionSessionSender() {
    this.shipmentsService.getClaimSession('SENDER_CLAIMS').subscribe(
      res => {this.cargoSessionSender = res; console.log('res', res)},
      error => this.modalService.open(error.message),
      () =>  console.log()
    )
  }
  getCargoSessionSessionReceiver() {
    this.shipmentsService.getClaimSession('RECEIVER_CLAIMS').subscribe(
      res => {this.cargoSessionReceiver = res; console.log('res', res)},
      error => this.modalService.open(error.message),
      () =>  console.log()
    )
  }
  getOil(){
    this.calculationsService.getOil().subscribe(
      res => {this.oilCargo = res; console.log('res', res)},
      error => this.modalService.open(error.message),
      () =>  console.log()
    )
  }
  getOre(){
    this.calculationsService.getOre().subscribe(
      res => {this.ore = res; console.log('res', res)},
      error => this.modalService.open(error.message),
      () =>  console.log()
    )
  }
  getMetallurgy(){
    this.calculationsService.getMetallurgy().subscribe(
      res => {this.metallurgy = res; console.log('res', res)},
      error => this.modalService.open(error.message),
      () =>  console.log()
)
}

  nextPage() {
    if(this.stepOne !== undefined){
      console.log(this.stepOne)
      this.forecastModelService.ticketInformation.stepOne.Session = this.stepOne.Session;
      this.forecastModelService.ticketInformation.stepOne.calcYearsNumber = this.stepOne.calcYearsNumber;
      this.forecastModelService.ticketInformation.stepOne.scenarioMacro = this.stepOne.scenarioMacro;
      this.forecastModelService.ticketInformation.stepOne.correspondenceSession = this.stepOne.correspondenceSession;
      this.forecastModelService.ticketInformation.stepOne.cargoSessionSender = this.stepOne.cargoSessionSender;
      this.forecastModelService.ticketInformation.stepOne.cargoSessionReceiver = this.stepOne.cargoSessionReceiver;
      this.forecastModelService.ticketInformation.stepOne.oilCargo = this.stepOne.oilCargo;
      this.forecastModelService.ticketInformation.stepOne.ore = this.stepOne.ore;
      this.forecastModelService.ticketInformation.stepOne.metallurgy = this.stepOne.metallurgy;
      this.router.navigate(['steps/mathForecast']);
    }
  }

}
