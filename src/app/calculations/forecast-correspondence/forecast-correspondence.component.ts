import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {ISelectMethodUsers} from "../../models/calculations.model";
import {ForecastingModelService} from '../../services/forecasting-model.service';
import {CalculationsService} from "../../services/calculations.service";
import {ModalService} from "../../services/modal.service";
import {ISession} from "../../models/shipmenst.model";
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
  mathematicalForecastTableSession: ISession
  reportingYears = [];
  monoCargo: boolean = false;
  sessionId: number;
  stepOnecalcYearsNumber: number;
  disableCorrelation: boolean = true;
  loading: boolean = false
  user: IAuthModel
  payment: boolean = false
  forecastName: string
  settlemenType: string = '';
  calculated: boolean = false
  loadingHistoryShipment: boolean = false;

  constructor(
    private router: Router,
    public forecastModelService: ForecastingModelService,
    private calculationsService: CalculationsService,
    private modalService: ModalService,
    private authenticationService: AuthenticationService,
    private shipmentsService: ShipmentsService,
  ) {
    this.user = this.authenticationService.userValue;
    this.methodUsers = [
      {id: 1, type: 'LESS_SQUARE', name: 'Вычисление прогноза корреспонденций по методу наименьших квадратов'},
      {id: 2, type: 'FISCAL_YEAR', name: 'Вычисление прогноза корреспонденций по отчётному году'},
      {
        id: 3,
        type: 'TENDENCY_FIXED_DELTA',
        name: 'Вычисление прогноза корреспонденций по тенденции (по фиксированным промежуткам)'
      },
      {
        id: 4,
        type: 'TENDENCY_INCREASING_DELTA',
        name: 'Вычисление прогноза корреспонденций по тенденции (по увеличивающимся промежуткам)'
      },
      {
        id: 5,
        type: 'AVERAGE_FIXED_INTERVAL',
        name: 'Вычисление прогноза корреспонденций по среднему арифметическому (по фиксированным промежуткам)'
      },
      {
        id: 6,
        type: 'AVERAGE_INCREASING_INTERVAL',
        name: 'Вычисление прогноза корреспонденций по среднему арифметическому (по увеличивающимся промежуткам)'
      },
    ]
  }

  ngOnInit(): void {
    this.calculated = this.forecastModelService.getTicketInformation().stepThree.calculated
    if(this.calculated === true){
      this.loading = true
      this.disableCorrelation = false;
    }
    if (this.forecastModelService.ticketInformation.stepOne.oldSessionId === null && this.forecastModelService.getTicketInformation().stepOne.Session !== null) {
      this.forecastModelService.ticketInformation.stepOne.oldSessionId = this.forecastModelService.ticketInformation.stepOne.Session['id']
    }
    if (this.forecastModelService.ticketInformation.stepOne.newSessionId !== null && this.forecastModelService.getTicketInformation().stepOne.Session !== null) {
      this.forecastModelService.ticketInformation.stepOne.Session['id'] = this.forecastModelService.ticketInformation.stepOne.newSessionId
    }
    this.forecastName = this.forecastModelService.getTicketInformation().stepOne.nameNewShip

    if (this.forecastModelService.getTicketInformation().stepOne.Session !== null) {
      this.sessionId = this.forecastModelService.getTicketInformation().stepOne.Session['id']
      this.additionalInfo(this.forecastModelService.ticketInformation.stepOne.Session['historicalYears']);
      //TODO правки
      this.stepOnecalcYearsNumber = this.forecastModelService.getTicketInformation().stepOne.calcYearsNumber['name']
    } else {
      //TODO правки
      this.stepOnecalcYearsNumber = 0
      this.sessionId = this.forecastModelService.ticketInformation.stepThree.sessionId;
      this.calculated = true;
      this.loading = true
      this.corresponTiers()
    }
    //TODO правки
   // this.stepOnecalcYearsNumber = this.forecastModelService.getTicketInformation().stepOne.calcYearsNumber['name']
    this.stepThree = this.forecastModelService.ticketInformation.stepThree;
    this.stepThree.forecastingStrategySustainable = this.methodUsers[0]
    this.stepThree.forecastingStrategySmall = this.methodUsers[1]

  }

  //TODO FAIL!
  additionalInfo(items) {
    const res = items.split(',')
    for (let item of res) {
      this.reportingYears.push({"name": item});
    }
  }

  checkStrategyType() {
    if (this.stepThree.forecastingStrategySustainable.type === 'FISCAL_YEAR' && (this.stepThree.primaryForecastFiscalYear === null || this.stepThree.primaryForecastFiscalYear === undefined)) {
      this.modalService.open('Стратегия прогнозирования (устойчивые). Укажите год!');
      return false
    } else if (this.stepThree.forecastingStrategySmall.type === 'FISCAL_YEAR' && (this.stepThree.secondaryForecastFiscalYear === null || this.stepThree.secondaryForecastFiscalYear === undefined)) {
      this.modalService.open('Стратегия прогнозирования (мелкие). Укажите год!');
      return false
    } else {
      return true
    }
  }


  calculateForecastingStrategyAll() {
    if(this.checkStrategyType() === true){
      this.loadingHistoryShipment = true
      //this.disableCorrelation = false
      this.calculated === true
      this.loading = false;
      this.settlemenType = 'payment'
      this.calculationsService.getGeneralmethod2(this.sessionId,
        this.forecastModelService.getTicketInformation().stepOne.calcYearsNumber['name'],
        this.forecastModelService.getTicketInformation().stepOne.nameNewShip,
        this.stepThree.forecastingStrategySustainable.type,
        this.stepThree.forecastingStrategySmall.type,
        this.user.fio,
        this.user.user,
        this.stepThree.forecastingStrategySustainable.type !== 'FISCAL_YEAR' ?  null : this.stepThree.primaryForecastFiscalYear['name'],
        this.stepThree.forecastingStrategySmall.type !== 'FISCAL_YEAR' ? null : this.stepThree.secondaryForecastFiscalYear['name'],
      )
        .subscribe(
          res => {
            console.log('tyt', res)
            this.mathematicalForecastTableSession = res
          },
          error => {
            this.modalService.open(error.error.message)
            this.calculated === false
            this.loading = true
          },
          () => {
            if (this.forecastModelService.ticketInformation.stepOne.newSessionId === null) {
              this.forecastModelService.ticketInformation.stepOne.newSessionId = this.mathematicalForecastTableSession.id
            }
            this.forecastModelService.ticketInformation.stepOne.Session['id'] = this.mathematicalForecastTableSession.id
            this.sessionId = this.mathematicalForecastTableSession.id
            this.clearForecastFiscalYear();
            this.calculated = true
            this.loading = true
            this.disableCorrelation = false
            this.forecastModelService.ticketInformation.stepThree.calculated = true
          }
        )
    }
  }
  clearForecastFiscalYear(){
    this.stepThree.secondaryForecastFiscalYear = null;
    this.stepThree.primaryForecastFiscalYear = null;
  }

  correlation() {
    console.log(this.sessionId)
    this.loading = false;
    this.settlemenType = 'correlation'
    this.calculationsService.getCorrelation(this.sessionId)
      .subscribe(
        res => {
          console.log(res)
        },
        error => {
          this.modalService.open(error.error.message),
            this.loading = true
        },
        () => {
          this.loading = true
        }
      )
  }


  corresponTie() {
    this.loading = false;
    let metallurgy: null
    let oilCargo: null
    let ore: null
    let correspondenceSession: null
    this.forecastModelService.getTicketInformation().stepOne.metallurgy === null ? metallurgy = null : metallurgy = this.forecastModelService.getTicketInformation().stepOne.metallurgy['id'];
    this.forecastModelService.getTicketInformation().stepOne.oilCargo === null ? oilCargo = null : oilCargo = this.forecastModelService.getTicketInformation().stepOne.oilCargo['id'];
    this.forecastModelService.getTicketInformation().stepOne.ore === null ? ore = null : ore = this.forecastModelService.getTicketInformation().stepOne.ore['id'];
    this.forecastModelService.getTicketInformation().stepOne.correspondenceSession === null ? correspondenceSession = null : correspondenceSession = this.forecastModelService.getTicketInformation().stepOne.correspondenceSession['id'];

    this.calculationsService.getPerspective(this.sessionId, metallurgy, oilCargo, ore, correspondenceSession)
      .subscribe(
        res => {
          console.log(res)
        },
        error => {
          this.modalService.open(error.error.message),
            this.loading = true
        },
        () => {
          this.loading = true;
          this.disableCorrelation = !this.disableCorrelation
        }
      )
  }
  transferToIAS(type: string){
    let idTransferToIAS = 0;
    switch (type) {
      case 'oil':
        idTransferToIAS = this.forecastModelService.getTicketInformation().stepOne.oilCargo.id
        break;
      case 'ruda':
        idTransferToIAS = this.forecastModelService.getTicketInformation().stepOne.ore.id
        break;
      case 'metal':
        idTransferToIAS = this.forecastModelService.getTicketInformation().stepOne.metallurgy.id
        break;
      default:
        break;
    }


    this.calculationsService.postDownloadIASData(type,idTransferToIAS,  this.sessionId).subscribe(
      res => {
        console.log('из ИАС МоногрузЫ', res)
      },
      error => {
        this.modalService.open(error.error.message),
          this.loading = true
      },
      () => {
        this.loading = true;
        this.disableCorrelation = false;
      }
    )
  }
  corresponTiers() {
    let typeCargo = ''
    let stepOneTypeTransportationQuantity = 0
    this.forecastModelService.getTicketInformation().stepOne.oilCargo !== null ? (stepOneTypeTransportationQuantity++, typeCargo = 'oil') : null;
    this.forecastModelService.getTicketInformation().stepOne.ore !== null ? (stepOneTypeTransportationQuantity++, typeCargo = 'ruda') : null;
    this.forecastModelService.getTicketInformation().stepOne.metallurgy !== null ? (stepOneTypeTransportationQuantity++, typeCargo = 'metal') : null;
    if(stepOneTypeTransportationQuantity === 1){
      this.loading = false;
      this.disableCorrelation = true
      this.transferToIAS(typeCargo)
    }else{
      this.modalService.open('На первом шаге выбрано более одной перспективной корреспонденции!')
    }
  }

  cargoSessionSenders() {
    if (this.forecastModelService.ticketInformation.stepOne.cargoSessionSender === null) {
      this.modalService.open('Вы забыли выбрать на первом шаге Файл с заявками грузоотправителей!')
    } else {
      this.loading = false;
      this.calculationsService.getCargoOwnerSessionId(this.forecastModelService.ticketInformation.stepOne.cargoSessionSender['id'], this.sessionId).subscribe(
        res => {
          console.log(res)
        },
        error => {
          this.modalService.open(error.error.message),
            this.loading = true
        },
        () => {
          this.loading = true
        }
      )
    }
  }

  cargoSessionReceivers() {
    if (this.forecastModelService.ticketInformation.stepOne.cargoSessionReceiver === null) {
      this.modalService.open('Вы забыли выбрать на первом шаге Файл с заявками грузополучателей!')
    } else {
      this.loading = false;
      this.calculationsService.getCargoOwnerSessionId(this.forecastModelService.ticketInformation.stepOne.cargoSessionReceiver['id'], this.sessionId).subscribe(
        res => {
          console.log(res)
        },
        error => {
          this.modalService.open(error.error.message),
            this.loading = true
        },
        () => {
          this.loading = true
        }
      )
    }
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

  prevPage() {
    if (this.forecastModelService.getTicketInformation().stepOne.Session !== null) {
      this.forecastModelService.ticketInformation.stepOne.Session['id'] = this.forecastModelService.ticketInformation.stepOne.oldSessionId
      this.router.navigate(['steps/mathForecast']);
    } else {
      this.router.navigate(['steps/import']);
    }
  }

  monoCargoDialog() {
    let stepOneTypeTransportationQuantity = 0
    this.forecastModelService.getTicketInformation().stepOne.oilCargo !== null ? stepOneTypeTransportationQuantity++ : null;
    this.forecastModelService.getTicketInformation().stepOne.ore !== null ? stepOneTypeTransportationQuantity++ : null;
    this.forecastModelService.getTicketInformation().stepOne.metallurgy !== null ? stepOneTypeTransportationQuantity++ : null;
    if(stepOneTypeTransportationQuantity === 1){
      this.monoCargo = !this.monoCargo;
    }else{
      this.modalService.open('На первом шаге выбрано более одной перспективной корреспонденции!')
    }
  }

  toApplyOptimalShipment() {
    this.loadingHistoryShipment = true
    this.settlemenType = 'payment'
    this.shipmentsService.getCopySissionShipments(this.user.fio, this.forecastModelService.getTicketInformation().stepOne.calcYearsNumber['name'],  this.user.user,this.forecastModelService.getTicketInformation().stepOne.nameNewShip, this.sessionId ).subscribe(
      res => {
        this.sessionId = Number(res)
      }, error => {
        this.modalService.open(error.error.message)
        this.loadingHistoryShipment = false
      },
      () => {
        this.calculated = this.forecastModelService.getTicketInformation().stepThree.calculated
        this.forecastModelService.ticketInformation.stepThree.calculated = true
        this.forecastModelService.ticketInformation.stepOne.Session['id'] = this.sessionId
        this.clearForecastFiscalYear();
        this.disableCorrelation = false
        this.loadingHistoryShipment = false
        this.calculated = true
        this.loading = true
      }
    )
  }


}
