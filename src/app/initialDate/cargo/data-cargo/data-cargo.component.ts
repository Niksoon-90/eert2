import { Component, OnInit } from '@angular/core';
import {ISession, IShipment} from "../../../models/shipmenst.model";
import {ShipmentsService} from "../../../services/shipments.service";
import {ModalService} from "../../../services/modal.service";

@Component({
  selector: 'app-data-cargo',
  templateUrl: './data-cargo.component.html',
  styleUrls: ['./data-cargo.component.scss']
})
export class DataCargoComponent implements OnInit {
  cargoSession: ISession[];
  first = 0;
  rows = 25;
  loading: boolean = true;
  checkTypeCargo: boolean = true;
  mathematicalForecastTable: IShipment[];
  dialogVisible: boolean;
  carrgoTypes: string;

  constructor(
    private shipmentsService: ShipmentsService,
    private modalService: ModalService
  ) { }

  ngOnInit(): void {
    this.chekedCargoType()
  }
  next() {
    this.first = this.first + this.rows;
  }

  reset() {
    this.first = 0;
    this.chekedCargoType();
  }


  getCargoSessionSession(type: string) {
    this.loading = true;
    this.shipmentsService.getClaimSession(type).subscribe(
      res => {this.cargoSession = res; console.log('res', res)},
      error => this.modalService.open(error.message),
      () =>  this.loading = false
    )
  }

  chekedCargoType() {
    if(this.checkTypeCargo === true){
      this.getCargoSessionSession('SENDER_CLAIMS')
      this.carrgoTypes = 'sender';
    }else if(this.checkTypeCargo === false){
      this.getCargoSessionSession('RECEIVER_CLAIMS')
      this.carrgoTypes = 'receiver';
    }
  }

  openShipItemSession(id: any) {
    this.loading = true
    this.shipmentsService.getShipments(id).subscribe(
      res => this.mathematicalForecastTable = res,
      error => {
        this.modalService.open(error.error.message);
        this.loading = false;
      },
      () => {
        this.showDialog();

      }
    )
  }
  showDialog() {
    this.dialogVisible = true;
    this.loading = false;
  }
  loadingChange(event) {
    this.loading = event;
  }

  CloseModalChange(event: boolean) {
    this.dialogVisible = event;
  }

  removeShipSession(id: any) {
    this.loading = true
    this.shipmentsService.deleteShipSession(id).subscribe(
      () =>  this.chekedCargoType(),
      error => {
        this.modalService.open(error.error.message);
        this.loading = false;
      },
      () => this.loading = false
    )
  }
}
