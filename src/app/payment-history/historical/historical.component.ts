import { Component, OnInit } from '@angular/core';
import {ISession} from "../../models/shipmenst.model";
import {ModalService} from "../../services/modal.service";
import {ShipmentsService} from "../../services/shipments.service";
import {Router} from "@angular/router";
import {ForecastingModelService} from "../../services/forecasting-model.service";


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
  constructor(
    private modalService: ModalService,
    private shipmentsService: ShipmentsService,
    private router: Router,
    private forecastModelService: ForecastingModelService,
  ) { }

  ngOnInit(): void {
    this.openShipItemSession()
  }

  openShipItemSession() {
    this.loading = true
    this.shipmentsService.getHistoricalForcaste().subscribe(
      res => {
        this.historical = res,
          console.log(res)
      },
      error => this.modalService.open(error.error.message),
      () => {
        this.dialogVisible = true,
          this.loading = false
      }
    )
  }

  openThreeStep(id: number, name: string, historicalYears: any) {
    this.forecastModelService.ticketInformation.history.historicalYears = historicalYears;
    this.router.navigate(['payments/match/', id, name]);
  }
}
