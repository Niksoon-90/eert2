import { Component, OnInit } from '@angular/core';
import {ISession} from "../../models/shipmenst.model";
import {ModalService} from "../../services/modal.service";
import {ShipmentsService} from "../../services/shipments.service";
import {Router} from "@angular/router";
import {ForecastingModelService} from "../../services/forecasting-model.service";
import {IAuthModel} from "../../models/auth.model";
import {AuthenticationService} from "../../services/authentication.service";
import {map} from "rxjs/operators";


@Component({
  selector: 'app-historical',
  templateUrl: './historical.component.html',
  styleUrls: ['./historical.component.scss']
})
export class HistoricalComponent implements OnInit {
  historical: ISession[];
  dialogVisible: boolean = false
  loading: boolean = true;
  first = 0;
  rows = 25;
  user: IAuthModel;
  constructor(
    private modalService: ModalService,
    private shipmentsService: ShipmentsService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private forecastModelService: ForecastingModelService,
  ) {
    this.user = this.authenticationService.userValue;
  }

  ngOnInit(): void {
    this.openShipItemSession()
  }

  openShipItemSession() {
    this.loading = true
    this.shipmentsService.getHistoricalForcaste().subscribe(
      res => {
        this.historical = res,
          this.historical = this.historical.sort((a, b) => a.id < b.id ? 1 : -1)
          console.log(res)
      },
      error => this.modalService.open(error.error.message),
      () => {
        this.dialogVisible = true,
          this.loading = false
      }
    )
  }

  openThreeStep(id: number, name: string, historicalYears: any, forecastConfirmed: boolean) {
    this.forecastModelService.ticketInformation.history.historicalYears = historicalYears;
    this.forecastModelService.ticketInformation.history.forecastConfirmed = forecastConfirmed;
    this.router.navigate(['payments/match/', id, name]);
  }

  deletedThreeStep(id: number) {
    this.loading = true
    this.shipmentsService.deleteShipSession(id).subscribe(
      res => console.log(),
      error => {
        this.modalService.open(error.error.message),
          this.loading = false
      },
      () => {
        this.openShipItemSession(),
          this.loading = false
      }
    )
  }
  confirmSession(id: number){
    this.loading = true
    this.shipmentsService.putConfirm(id).subscribe(
      res => console.log(),
      error => {
        this.modalService.open(error.error.message),
          this.loading = false
      },
      () => {
        this.openShipItemSession(),
          this.loading = false
      }
    )
  }
}
