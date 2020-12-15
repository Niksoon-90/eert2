import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {ISelectMethodUsers} from "../../models/calculations.model";
import {ForecastingModelService} from '../../services/forecasting-model.service';
import {CalculationsService} from "../../services/calculations.service";
import {ModalService} from "../../services/modal.service";
import {IShipment} from "../../models/shipmenst.model";
import {AuthenticationService} from "../../services/authentication.service";
import {IAuthModel} from "../../models/auth.model";
import {ShipmentsService} from "../../services/shipments.service";

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
  user: IAuthModel
  payment: boolean = false
  urlPerspective =  'api/calc/correspondence/perspective?';
  forecastName: string
  constructor(
    private router: Router,
    public forecastModelService: ForecastingModelService,
    private calculationsService: CalculationsService,
    private modalService: ModalService,
    private authenticationService: AuthenticationService,
    private shipmentsService: ShipmentsService
  ) {
    this.user = this.authenticationService.userValue;
    this.methodUsers = [
      {id: 1, type: 'simple', name:'Вычисление прогноза корреспонденций по методу наименьших квадратов'},
      {id: 2, type: 'fiscal', name:'Вычисление прогноза корреспонденций по отчётному году'},
      {id: 3, type: 'fixed',  name:'Вычисление прогноза корреспонденций по тенденции (по фиксированным промежуткам)'},
      {id: 4, type: 'increasing',  name:'Вычисление прогноза корреспонденций по тенденции (по увеличивающимся промежуткам)'},
      {id: 5, type: 'average', name:'Вычисление прогноза корреспонденций по среднему арифметическому (по фиксированным промежуткам)'},
      {id: 6, type: 'averageIncreasing', name:'Вычисление прогноза корреспонденций по среднему арифметическому (по увеличивающимся промежуткам)'},
    ]
  }

  ngOnInit(): void {
    if(this.forecastModelService.ticketInformation.stepOne.oldSessionId === null && this.forecastModelService.getTicketInformation().stepOne.Session !== null){
      this.forecastModelService.ticketInformation.stepOne.oldSessionId = this.forecastModelService.ticketInformation.stepOne.Session['id']
    }
    if(this.forecastModelService.ticketInformation.stepOne.newSessionId !== null && this.forecastModelService.getTicketInformation().stepOne.Session !== null){
      this.forecastModelService.ticketInformation.stepOne.Session['id'] = this.forecastModelService.ticketInformation.stepOne.newSessionId
    }
    this.forecastName = this.forecastModelService.getTicketInformation().stepOne.nameNewShip

    if(this.forecastModelService.getTicketInformation().stepOne.Session !== null){
      this.sessionId = this.forecastModelService.getTicketInformation().stepOne.Session['id']
      this.additionalInfo(this.forecastModelService.ticketInformation.stepOne.Session['historicalYears']);
    }else{
      this.sessionId = null
    }

    this.stepOnecalcYearsNumber = this.forecastModelService.getTicketInformation().stepOne.calcYearsNumber['name']
    this.stepThree = this.forecastModelService.ticketInformation.stepThree;

    if(this.forecastModelService.ticketInformation.stepThree.forecastingStrategy !== null){
      this.calculateForecastingStrategy();
    }

  }
  //TODO FAIL!
  additionalInfo(items){
    const res = items.split(',')
    for (let item of res) {
        this.reportingYears.push({"name": item});
    }
  }

  prevPage() {
    if(this.sessionId !== null){
      this.forecastModelService.ticketInformation.stepOne.Session['id'] = this.forecastModelService.ticketInformation.stepOne.oldSessionId
      this.router.navigate(['steps/mathForecast']);
    }else {
      this.router.navigate(['steps/import']);
    }
  }


  calculateForecastingStrategy() {
    this.payment = true
    this.disableCorrelation= true;
    this.loading = false;
    switch (this.stepThree.forecastingStrategy.type) {
      case 'simple':
       this.calculationsService.getCalculationSimple(this.sessionId, this.stepOnecalcYearsNumber, this.forecastName)
         .subscribe(
           res => {this.mathematicalForecastTable = res, console.log('simple', res)},
           error => {
             this.modalService.open(error.error.message),
               this.loading = true
           },
           () => {
             if(this.forecastModelService.ticketInformation.stepOne.newSessionId === null){
               this.forecastModelService.ticketInformation.stepOne.newSessionId = this.mathematicalForecastTable[0].session
             }
             this.forecastModelService.ticketInformation.stepOne.Session['id'] = this.mathematicalForecastTable[0].session,
             this.sessionId = this.mathematicalForecastTable[0].session,
             this.disableCorrelation = false,
               this.loading = true}
         )
        break;
      case 'fiscal':
        this.calculationsService.getCalculationFiscal(this.sessionId, this.stepOnecalcYearsNumber, this.stepThree.yearsSession['name'], this.forecastName)
          .subscribe(
            res => {this.mathematicalForecastTable = res,  console.log('fiscal', res)},
            error => {
              this.modalService.open(error.error.message),
                this.loading = true
            },
            () => {
              if(this.forecastModelService.ticketInformation.stepOne.newSessionId === null){
                this.forecastModelService.ticketInformation.stepOne.newSessionId = this.mathematicalForecastTable[0].session
              }
              this.forecastModelService.ticketInformation.stepOne.Session['id'] = this.mathematicalForecastTable[0].session,
                this.sessionId = this.mathematicalForecastTable[0].session,
              this.disableCorrelation = false,
                this.loading = true
            }
          )
        break;
      case 'fixed':
        this.calculationsService.getCalculationFixed(this.sessionId, this.stepOnecalcYearsNumber, this.forecastName)
          .subscribe(
              res => {this.mathematicalForecastTable = res, console.log('fixed', res)},
            error => {
              this.modalService.open(error.error.message),
                this.loading = true
            },
            () => {
              if(this.forecastModelService.ticketInformation.stepOne.newSessionId === null){
                this.forecastModelService.ticketInformation.stepOne.newSessionId = this.mathematicalForecastTable[0].session
              }
              this.forecastModelService.ticketInformation.stepOne.Session['id'] = this.mathematicalForecastTable[0].session,
                this.sessionId = this.mathematicalForecastTable[0].session,
                this.disableCorrelation = false,
                  this.loading = true}
          )
        break;
      case 'increasing':
        this.calculationsService.getCalculationIncreasing(this.sessionId, this.stepOnecalcYearsNumber, this.forecastName)
          .subscribe(
            res => {this.mathematicalForecastTable = res, console.log('increasing', res)},
            error => {
              this.modalService.open(error.error.message),
                this.loading = true
            },
            () => {
              if(this.forecastModelService.ticketInformation.stepOne.newSessionId === null){
                this.forecastModelService.ticketInformation.stepOne.newSessionId = this.mathematicalForecastTable[0].session
              }
              this.forecastModelService.ticketInformation.stepOne.Session['id'] = this.mathematicalForecastTable[0].session,
                this.sessionId = this.mathematicalForecastTable[0].session,
              this.disableCorrelation = false,
                this.loading = true}
          )
        break;
      case 'average':
        this.calculationsService.getCalculationAverage(this.sessionId, this.stepOnecalcYearsNumber, this.forecastName)
          .subscribe(
            res => {this.mathematicalForecastTable = res, console.log('average', res)},
            error => {
              this.modalService.open(error.error.message),
                this.loading = true
            },
            () => {
              if(this.forecastModelService.ticketInformation.stepOne.newSessionId === null){
                this.forecastModelService.ticketInformation.stepOne.newSessionId = this.mathematicalForecastTable[0].session
              }
              this.forecastModelService.ticketInformation.stepOne.Session['id'] = this.mathematicalForecastTable[0].session,
                this.sessionId = this.mathematicalForecastTable[0].session,
              this.disableCorrelation = false,
                this.loading = true}
          )
        break;
        case 'averageIncreasing':
        this.calculationsService.getCalculationAverageIncreasing(this.sessionId, this.stepOnecalcYearsNumber, this.forecastName)
          .subscribe(
            res => {this.mathematicalForecastTable = res, console.log('averageIncreasing', res)},
            error => {
              this.modalService.open(error.error.message),
                this.loading = true
            },
            () => {
              if(this.forecastModelService.ticketInformation.stepOne.newSessionId === null){
                this.forecastModelService.ticketInformation.stepOne.newSessionId = this.mathematicalForecastTable[0].session
              }
              this.forecastModelService.ticketInformation.stepOne.Session['id'] = this.mathematicalForecastTable[0].session,
                this.sessionId = this.mathematicalForecastTable[0].session,
                this.disableCorrelation = false,
                this.loading = true}
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
        console.log('this.sessionId', this.sessionId)
        this.calculationsService.getCorrelation(this.sessionId, 'LESS_SQUARE')
          .subscribe(
            res => {this.mathematicalForecastTable = res},
            error => {
              this.modalService.open(error.error.message),
                this.loading = true
            },
            () => this.loading = true
          )
        break;
      case 'fiscal':
        this.calculationsService.getCorrelation(this.sessionId, 'FISCAL_YEAR')
          .subscribe(
            res => {this.mathematicalForecastTable = res},
            error => {
              this.modalService.open(error.error.message),
                this.loading = true
            },
            () => this.loading = true
          )
        break;
      case 'fixed':
        this.calculationsService.getCorrelation(this.sessionId, 'TENDENCY_FIXED_DELTA')
          .subscribe(
            res => {this.mathematicalForecastTable = res},
            error => {
              this.modalService.open(error.error.message),
                this.loading = true
            },
            () => this.loading = true
          )
        break;
      case 'increasing':
        this.calculationsService.getCorrelation(this.sessionId, 'TENDENCY_INCREASING_DELTA')
          .subscribe(
            res => {this.mathematicalForecastTable = res},
            error => {
              this.modalService.open(error.error.message),
                this.loading = true
            },
            () => this.loading = true
          )
        break;
      case 'average':
        this.calculationsService.getCorrelation(this.sessionId, 'AVERAGE_FIXED_INTERVAL')
          .subscribe(
            res => {this.mathematicalForecastTable = res},
            error => {
              this.modalService.open(error.error.message),
                this.loading = true
            },
            () => this.loading = true
          )
        break;
        case 'averageIncreasing':
        this.calculationsService.getCorrelation(this.sessionId, 'AVERAGE_INCREASING_INTERVAL')
          .subscribe(
            res => {this.mathematicalForecastTable = res},
            error => {
              this.modalService.open(error.error.message),
                this.loading = true
            },
            () => this.loading = true
          )
        break;
      default:
        break;
    }
  }

  corresponTie() {
      this.loading = false;
      if(this.forecastModelService.ticketInformation.stepOne.metallurgy !== null){
        this.urlPerspective += 'iasMetalForecastId=' + this.forecastModelService.ticketInformation.stepOne.metallurgy['id'].toString() + '&';
      }
      if(this.forecastModelService.ticketInformation.stepOne.oilCargo !== null){
        this.urlPerspective += 'iasOilForecastId=' + this.forecastModelService.ticketInformation.stepOne.oilCargo['id'].toString() + '&';
      }
      if(this.forecastModelService.ticketInformation.stepOne.ore !== null){
        this.urlPerspective += 'iasRudaForecastId=' + this.forecastModelService.ticketInformation.stepOne.ore['id'].toString() + '&';
      }
      if(this.forecastModelService.ticketInformation.stepOne.correspondenceSession !== null){
        this.urlPerspective += 'perspectiveSessionId=' + this.forecastModelService.ticketInformation.stepOne.correspondenceSession['id'].toString() + '&';
      }
      this.urlPerspective += 'sessionId=' + this.sessionId;
      console.log(this.urlPerspective)
      this.calculationsService.getPerspective(this.urlPerspective )
        .subscribe(
          res => {this.mathematicalForecastTable = res, console.log(res)},
          error => {
            this.modalService.open(error.error.message),
              this.loading = true
          },
          () => {
            this.loading = true;
            this.disableCorrelation = !this.disableCorrelation;
          }
        )
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
        error => {
          this.modalService.open(error.error.message),
            this.loading = true
        },
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
      error => {
        this.modalService.open(error.error.message),
          this.loading = true
      },
      () => this.loading = true
    )
  }
  nextPage() {
    this.shipmentsService.putTransformFile(this.sessionId, true).subscribe(
      res => console.log(),
      error => {
        this.modalService.open(error.error.message),
          this.loading = true
      },
      () => {
        this.forecastModelService.ticketInformation.stepThree.forecastingStrategy = this.stepThree.forecastingStrategy;
        this.router.navigate(['steps/payment']);
      }
    )
  }

}
