import {Component, OnDestroy, OnInit} from '@angular/core';
import {ISession} from "../../models/shipmenst.model";
import {ModalService} from "../../services/modal.service";
import {ShipmentsService} from "../../services/shipments.service";
import {Router} from "@angular/router";
import {ForecastingModelService} from "../../services/forecasting-model.service";
import {IAuthModel} from "../../models/auth.model";
import {AuthenticationService} from "../../services/authentication.service";
import {ConfirmationService} from "primeng/api";
import {Subscription} from "rxjs";



@Component({
  selector: 'app-historical',
  templateUrl: './historical.component.html',
  styleUrls: ['./historical.component.scss']
})
export class HistoricalComponent implements OnInit, OnDestroy {
  historical: ISession[];
  dialogVisible: boolean = false
  loading: boolean = true;
  first = 0;
  rows = 25;
  user: IAuthModel;
  subscriptions: Subscription = new Subscription();

  constructor(
    private modalService: ModalService,
    private shipmentsService: ShipmentsService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private forecastModelService: ForecastingModelService,
    private confirmationService: ConfirmationService,
  ) {
    this.user = this.authenticationService.userValue;
  }

  ngOnInit(): void {
    this.openShipItemSession()
  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  openShipItemSession() {
    this.loading = true
    this.subscriptions.add(this.shipmentsService.getHistoricalForcaste().subscribe(
      res => res === null ? this.historical = [] : this.historical = res.sort((a, b) => a.id < b.id ? 1 : -1),
      error => this.modalService.open(error.error.message),
      () => {
        this.dialogVisible = true
        this.loading = false
      }
    ))
  }

  openThreeStep(id: number, name: string, historicalYears: any, forecastConfirmed: boolean, firstRouteId: number, secondRouteId: number, allCorrespondensRouteId: number) {
    this.forecastModelService.ticketInformation.history.historicalName = name;
    this.forecastModelService.ticketInformation.history.historicalYears = historicalYears;
    this.forecastModelService.ticketInformation.history.forecastConfirmed = forecastConfirmed;
    this.forecastModelService.ticketInformation.history.firstRouteId = firstRouteId
    this.forecastModelService.ticketInformation.history.secondRouteId = secondRouteId
    this.forecastModelService.ticketInformation.history.allCorrespondensRouteId = allCorrespondensRouteId
    this.router.navigate(['payments/match/', id, name]);
  }

  deletedThreeStep(id: number, name: string) {
    this.confirmationService.confirm({
      message: `???? ????????????????, ?????? ???????????? ?????????????? ????c???????????? ????????????: ${name}?`,
      header: `?????????????? ${name}?`,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.loading = true
        this.subscriptions.add(this.shipmentsService.deleteShipSession(id).subscribe(
          () => console.log(),
          error => {
            this.modalService.open(error.error.message),
              this.loading = false
          },
          () => {
            this.openShipItemSession(),
              this.loading = false
          }
        ))
      }
    });
  }

  confirmSession(id: number) {
    this.loading = true
    this.subscriptions.add(this.shipmentsService.putConfirm(id).subscribe(
      () => console.log(),
      error => {
        this.modalService.open(error.error.message),
          this.loading = false
      },
      () => {
        this.openShipItemSession(),
          this.loading = false
      }
    ))
  }
}
