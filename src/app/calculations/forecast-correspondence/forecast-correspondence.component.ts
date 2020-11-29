import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {ICalculatingPredictiveRegression, ISelectMethodUsers} from "../../models/calculations.model";
import {ForecastingModelService} from '../../services/forecasting-model.service';
import {CalculationsService} from "../../services/calculations.service";
import {ModalService} from "../../services/modal.service";
import {IShipment} from "../../models/shipmenst.model";
import {HttpResponse} from "@angular/common/http";
import {UploadFileService} from "../../services/upload-file.service";

@Component({
  selector: 'app-forecast-correspondence',
  templateUrl: './forecast-correspondence.component.html',
  styleUrls: ['./forecast-correspondence.component.scss']
})
export class ForecastCorrespondenceComponent implements OnInit {
  methodUsers: ISelectMethodUsers[];
  stepThree: any;
  mathematicalForecastTable: IShipment[];
  reportingYears= [];
  additionalInformation: boolean = false;
  sessionId: number;
  stepOnecalcYearsNumber:number;
  disableCorrelation: boolean = true;
  loading: boolean = false



  constructor(
    private router: Router,
    public forecastModelService: ForecastingModelService,
    private calculationsService: CalculationsService,
    private modalService: ModalService,
    private uploadFileService: UploadFileService,
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
    for (let item of items) {
        this.reportingYears.push({"name": item});
    }
  }

  prevPage() {
    this.router.navigate(['steps/mathForecast']);
  }

  nextPage() {
    this.forecastModelService.ticketInformation.stepThree.forecastingStrategy = this.stepThree.forecastingStrategy;
    this.router.navigate(['steps/export']);
  }

  calculateForecastingStrategy() {
    this.disableCorrelation= true;
    this.loading = false;
    switch (this.stepThree.forecastingStrategy.type) {
      case 'simple':
       this.calculationsService.getCalculationSimple(this.sessionId, this.stepOnecalcYearsNumber)
         .subscribe(
           res => {this.mathematicalForecastTable = res, console.log('simple', res)},
           error => this.modalService.open(error.error.message),
           () => {this.disableCorrelation = false, this.loading = true}
         )
        break;
      case 'fiscal':
        this.calculationsService.getCalculationFiscal(this.sessionId, this.stepOnecalcYearsNumber, this.stepThree.yearsSession['name'])
          .subscribe(
            res => {this.mathematicalForecastTable = res,  console.log('fiscal', res)},
            error => this.modalService.open(error.error.message),
            () => {this.disableCorrelation = false, this.loading = true}
          )
        break;
      case 'fixed':
        this.calculationsService.getCalculationFixed(this.sessionId, this.stepOnecalcYearsNumber)
          .subscribe(
              res => {this.mathematicalForecastTable = res, console.log('fixed', res)},
            error => this.modalService.open(error.error.message),
            () => {this.disableCorrelation = false, this.loading = true}
          )
        break;
      case 'increasing':
        this.calculationsService.getCalculationIncreasing(this.sessionId, this.stepOnecalcYearsNumber)
          .subscribe(
            res => {this.mathematicalForecastTable = res, console.log('increasing', res)},
            error => this.modalService.open(error.error.message),
            () => {this.disableCorrelation = false, this.loading = true}
          )
        break;
      case 'average':
        this.calculationsService.getCalculationAverage(this.sessionId, this.stepOnecalcYearsNumber)
          .subscribe(
            res => {this.mathematicalForecastTable = res, console.log('average', res)},
            error => this.modalService.open(error.error.message),
            () => {this.disableCorrelation = false, this.loading = true}
          )
        break;
      default:
        break;
    }
  }

  spying(event: any) {
    event.value.type === 'fiscal'?  this.additionalInformation = true :  this.additionalInformation = false
  }

  correlation() {
    this.loading = false;
    switch (this.stepThree.forecastingStrategy.type) {
      case 'simple':
        this.calculationsService.getCorrelation(this.sessionId, 'LESS_SQUARE')
          .subscribe(
            res => {this.mathematicalForecastTable = res},
            error => this.modalService.open(error.error.message),
            () => this.loading = true
          )
        break;
      case 'fiscal':
        this.calculationsService.getCorrelation(this.sessionId, 'FISCAL_YEAR')
          .subscribe(
            res => {this.mathematicalForecastTable = res},
            error => this.modalService.open(error.error.message),
            () => this.loading = true
          )
        break;
      case 'fixed':
        this.calculationsService.getCorrelation(this.sessionId, 'TENDENCY_FIXED_DELTA')
          .subscribe(
            res => {this.mathematicalForecastTable = res},
            error => this.modalService.open(error.error.message),
            () => this.loading = true
          )
        break;
      case 'increasing':
        this.calculationsService.getCorrelation(this.sessionId, 'TENDENCY_INCREASING_DELTA')
          .subscribe(
            res => {this.mathematicalForecastTable = res},
            error => this.modalService.open(error.error.message),
            () => this.loading = true
          )
        break;
      case 'average':
        this.calculationsService.getCorrelation(this.sessionId, 'AVERAGE')
          .subscribe(
            res => {this.mathematicalForecastTable = res},
            error => this.modalService.open(error.error.message),
            () => this.loading = true
          )
        break;
      default:
        break;
    }
    // this.calculationsService.getCorrelation(this.sessionId).subscribe(
    //   res => {this.mathematicalForecastTable = res},
    //   error => this.modalService.open(error.error.message),
    //   () => this.loading = true
    // )
  }

  corresponTie() {
    if(this.forecastModelService.ticketInformation.stepOne.correspondenceSession === null){
      this.modalService.open('Вы забыли выбрать на первом шаге Перспективные корреспонденции!')
    }else{
      this.loading = false;
      console.log('session', this.sessionId)
      console.log('sessionKK', this.forecastModelService.ticketInformation.stepOne.correspondenceSession['id'])
      this.calculationsService.getPerspective(this.sessionId, this.forecastModelService.ticketInformation.stepOne.correspondenceSession['id'])
        .subscribe(
          res => {this.mathematicalForecastTable = res, console.log(res)},
          error => this.modalService.open(error.error.message),
          () => {
            this.loading = true;
            this.disableCorrelation = !this.disableCorrelation;
          }
        )
    }

  }

  cargoSessionSenders() {
    if(this.forecastModelService.ticketInformation.stepOne.cargoSessionSender === null){
      this.modalService.open('Вы забыли выбрать на первом шаге Файл с заявками грузоотправителей!')
    }else {
      this.loading = false;
      this.calculationsService.getCargoOwnerSessionId(this.forecastModelService.ticketInformation.stepOne.cargoSessionSender['id'], this.sessionId).subscribe(
        res => {
          this.mathematicalForecastTable = res
        },
        error => this.modalService.open(error.error.message),
        () => this.loading = true
      )
    }
  }

  cargoSessionReceivers() {
    if (this.forecastModelService.ticketInformation.stepOne.cargoSessionReceiver === null) {
      this.modalService.open('Вы забыли выбрать на первом шаге Файл с заявками грузополучателей!')
    } else {
    }
    this.loading = false;
    this.calculationsService.getCargoOwnerSessionId(this.forecastModelService.ticketInformation.stepOne.cargoSessionReceiver['id'], this.sessionId).subscribe(
      res => {
        this.mathematicalForecastTable = res
      },
      error => this.modalService.open(error.error.message),
      () => this.loading = true
    )
  }

  resetTable(item) {
    this.loading = false;
    this.mathematicalForecastTable = [...item];
    this.loading = true;
    // console.log('go', item)
  }
  downloadShip() {
    this.uploadFileService.getDownload(this.sessionId, 'SHIPMENTS').subscribe(
      (response: HttpResponse<Blob>) => {
        console.log(response)
        let filename: string = 'report.xlsx'
        let binaryData = [];
        binaryData.push(response.body);
        let downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: 'blob' }));
        downloadLink.setAttribute('download', filename);
        document.body.appendChild(downloadLink);
        downloadLink.click();
      },
      error => this.modalService.open(error.error.message)
    )
  }
}
