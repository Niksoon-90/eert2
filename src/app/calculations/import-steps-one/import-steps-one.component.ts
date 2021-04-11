import {Component, OnInit} from '@angular/core';
import {ISession} from "../../models/shipmenst.model";
import {ShipmentsService} from "../../services/shipments.service";
import {ForecastingModelService} from "../../services/forecasting-model.service";
import {IHorizonforecast} from "../../models/calculations.model";
import {Router} from "@angular/router";
import {ModalService} from "../../services/modal.service";
import {CalculationsService} from "../../services/calculations.service";
import {MonoCargoSystemsModel} from "../../models/mono-cargo-systems.model";
import {AuthenticationService} from "../../services/authentication.service";
import {IAuthModel} from "../../models/auth.model";
import {map} from "rxjs/operators";
import {IStepInfoModel} from "../../models/stepInfo.model";
import {StepInfoService} from "../../services/step-info.service";
import {Subscription} from "rxjs";


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

  scenarioMacro = [
    {id: 1, name: 'Пессимистичное значение', type: 'PESSIMISTIC'},
    {id: 2, name: 'Базовое значение', type: 'BASE'},
    {id: 3, name: 'Оптимистичное значение', type: 'OPTIMISTIC'}
  ]
  stepOne: any;
  oilCargo: MonoCargoSystemsModel[];
  ore: MonoCargoSystemsModel[];
  metallurgy: MonoCargoSystemsModel[];
  user: IAuthModel
  subscriptions: Subscription = new Subscription();

  constructor(
    private shipmentsService: ShipmentsService,
    public forecastModelService: ForecastingModelService,
    private router: Router,
    private modalService: ModalService,
    private calculationsService: CalculationsService,
    public authenticationService: AuthenticationService,
    private stepInfoService: StepInfoService
  ) {
    this.user = this.authenticationService.userValue;
    if (this.forecastModelService.ticketInformation.stepOne.calcYearsNumber !== null) {
      this.horizonforecast = [];
      for (let i = 5; i <= 15; i++) {
        this.horizonforecast.push({name: i});
      }
    }
  }

  ngOnInit(): void {
    this.getInitialDate();
    this.getCorrespondenceSession();
    this.getCargoSessionSessionSender();
    this.getCargoSessionSessionReceiver();
    this.getOil();
    this.getOre();
    this.getMetallurgy();

    this.stepOne = this.forecastModelService.ticketInformation.stepOne;
    if (this.stepOne.scenarioMacro === null) {
      this.stepOne.scenarioMacro = this.scenarioMacro[1]
    }
    if (this.stepOne.calcYearsNumber === 0) {
      this.stepOne.calcYearsNumber = this.horizonforecast[0]
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  getInitialDate() {
    if (this.user.authorities.includes('P_P_p5') === true) {
      this.subscriptions.add(this.shipmentsService.getHistoricalSession()
        .pipe(
          map((data: ISession[]) => data.filter(p => p.fileType === "SHIPMENTS"))
        )
        .subscribe(
          res => this.initialDate = res,
          error => this.modalService.open(error.error.message),
        ))
    } else {
      this.subscriptions.add(this.shipmentsService.getShipSession()
        .pipe(
          map((data: ISession[]) => data.filter(p => p.userLogin === this.user.user))
        )
        .subscribe(
          res => this.initialDate = res,
          error => this.modalService.open(error.error.message),
        ))
    }
  }

  getCorrespondenceSession() {
    if (this.user.authorities.includes('P_P_p5') === true) {
      this.subscriptions.add(this.shipmentsService.getCorrespondenceSession().subscribe(
        res => this.correspondenceSession = res,
        error => this.modalService.open(error.error.message),
      ))
    } else {
      this.subscriptions.add(this.shipmentsService.getCorrespondenceSession()
        .pipe(
          map((data: ISession[]) => data.filter(p => p.userLogin === this.user.user))
        )
        .subscribe(
          res => this.correspondenceSession = res,
          error => this.modalService.open(error.error.message),
          () => console.log()
        ))
    }
  }

  getCargoSessionSessionSender() {
    if (this.user.authorities.includes('P_P_p5') === true) {
      this.subscriptions.add(this.shipmentsService.getClaimSession('SENDER_CLAIMS').subscribe(
        res => this.cargoSessionSender = res,
        error => this.modalService.open(error.error.message),
      ))
    } else {
      this.subscriptions.add(this.shipmentsService.getClaimSession('SENDER_CLAIMS')
        .pipe(
          map((data: ISession[]) => data.filter(p => p.userLogin === this.user.user))
        )
        .subscribe(
          res => this.cargoSessionSender = res,
          error => this.modalService.open(error.error.message),
        ))
    }
  }

  getCargoSessionSessionReceiver() {
    this.subscriptions.add(this.shipmentsService.getClaimSession('RECEIVER_CLAIMS').subscribe(
      res => this.cargoSessionReceiver = res,
      error => this.modalService.open(error.error.message),
    ))
  }

  getOil() {
    this.subscriptions.add(this.calculationsService.getOil().subscribe(
      res => this.oilCargo = res,
      error => this.modalService.open(error.error.message),
    ))
  }

  getOre() {
    this.subscriptions.add(this.calculationsService.getOre().subscribe(
      res => this.ore = res,
      error => this.modalService.open(error.error.message),
    ))
  }

  getMetallurgy() {
    this.subscriptions.add(this.calculationsService.getMetallurgy().subscribe(
      res => this.metallurgy = res,
      error => this.modalService.open(error.error.message),
    ))
  }

  postCreateEmptySession() {
    this.subscriptions.add(this.calculationsService.postCreateEmptySession(this.stepOne.nameNewShip, this.user.fio, this.user.user_name).subscribe(
      res => {
        this.forecastModelService.ticketInformation.stepThree.sessionId = Number(res)
      },
      error => this.modalService.open(error.error.message),
      () => {
        this.router.navigate(['steps/forecast']);
        this.forecastModelService.ticketInformation.stepOne.Session = null
        this.forecastModelService.ticketInformation.stepOne.nameNewShip = this.stepOne.nameNewShip;
        this.forecastModelService.ticketInformation.stepOne.calcYearsNumber = this.stepOne.calcYearsNumber;
        this.forecastModelService.ticketInformation.stepOne.correspondenceSession = this.stepOne.correspondenceSession;
        this.forecastModelService.ticketInformation.stepOne.cargoSessionSender = this.stepOne.cargoSessionSender;
        this.forecastModelService.ticketInformation.stepOne.cargoSessionReceiver = this.stepOne.cargoSessionReceiver;
        this.forecastModelService.ticketInformation.stepOne.oilCargo = this.stepOne.oilCargo;
        this.forecastModelService.ticketInformation.stepOne.ore = this.stepOne.ore;
        this.forecastModelService.ticketInformation.stepOne.metallurgy = this.stepOne.metallurgy;
        this.forecastModelService.ticketInformation.stepOne.oldSessionId = null;
        this.forecastModelService.ticketInformation.stepOne.newSessionId = null;
      }
    ))
  }

  nextPage() {
    this.stepsInfo();
    if (this.stepOne.Session !== null) {
      if (this.stepOne.calcYearsNumber !== null) {
        this.forecastModelService.ticketInformation.stepOne.Session = this.stepOne.Session;
        this.forecastModelService.ticketInformation.stepOne.nameNewShip = this.stepOne.nameNewShip;
        this.forecastModelService.ticketInformation.stepOne.calcYearsNumber = this.stepOne.calcYearsNumber;
        this.forecastModelService.ticketInformation.stepOne.scenarioMacro = this.stepOne.scenarioMacro;
        this.forecastModelService.ticketInformation.stepOne.correspondenceSession = this.stepOne.correspondenceSession;
        this.forecastModelService.ticketInformation.stepOne.cargoSessionSender = this.stepOne.cargoSessionSender;
        this.forecastModelService.ticketInformation.stepOne.cargoSessionReceiver = this.stepOne.cargoSessionReceiver;
        this.forecastModelService.ticketInformation.stepOne.oilCargo = this.stepOne.oilCargo;
        this.forecastModelService.ticketInformation.stepOne.ore = this.stepOne.ore;
        this.forecastModelService.ticketInformation.stepOne.metallurgy = this.stepOne.metallurgy;
        this.forecastModelService.ticketInformation.stepOne.oldSessionId = null;
        this.forecastModelService.ticketInformation.stepOne.newSessionId = null;
        this.router.navigate(['steps/mathForecast']);
      } else {
        this.modalService.open('Укажите горизонт прогноза!')
      }
    } else {
      if (this.stepOne.metallurgy === null && this.stepOne.ore === null && this.stepOne.oilCargo === null) {
        this.modalService.open('Укажите исходные данные или перспективные корреспонденции!')
      } else {
        this.postCreateEmptySession();
      }

    }
  }

  stepsInfo() {
    const stepInfo: IStepInfoModel = {
      calculationName: this.stepOne.nameNewShip === '' ? 'не выбран' : this.stepOne.nameNewShip,
      sessionName: this.stepOne.Session === null ? 'не выбран' : this.stepOne.Session.name,
      scenarioEconomy: this.stepOne.scenarioMacro === null ? 'не выбран' : this.stepOne.scenarioMacro['name'],
      horizont: this.stepOne.calcYearsNumber === null ? 'не выбран' : this.stepOne.calcYearsNumber['name'],
      shippersCargo: this.stepOne.cargoSessionSender === null ? 'не выбран' : this.stepOne.cargoSessionSender['name'],
      shippersConsignee: this.stepOne.cargoSessionReceiver === null ? 'не выбран' : this.stepOne.cargoSessionReceiver['name'],
      correspondence: this.stepOne.correspondenceSession === null ? 'не выбран' : this.stepOne.correspondenceSession['name'],
      oilName: this.stepOne.oilCargo === null ? 'не выбран' : this.stepOne.oilCargo['title'],
      oreName: this.stepOne.ore === null ? 'не выбран' : this.stepOne.ore['title'],
      metallurgyName: this.stepOne.metallurgy === null ? 'не выбран' : this.stepOne.metallurgy['title']
    }
    this.stepInfoService.setValue(stepInfo);
  }
}
