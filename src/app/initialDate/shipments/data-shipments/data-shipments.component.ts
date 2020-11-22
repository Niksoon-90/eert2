import {Component,  OnInit, } from '@angular/core';
import {ShipmentsService} from "../../../services/shipments.service";
import {ISession, IShipment} from "../../../models/shipmenst.model";

import {ModalService} from "../../../services/modal.service";


@Component({
  selector: 'app-data-shipments',
  templateUrl: './data-shipments.component.html',
  styleUrls: ['./data-shipments.component.scss']
})
export class DataShipmentsComponent implements OnInit {

  shipmentsSession: ISession[];
  customers: any[];
  mathematicalForecastTable: IShipment[];
  loading: boolean = true;
  first = 0;
  rows = 25;
  dialogVisible: boolean;


  constructor(
    private shipmentsService: ShipmentsService,
    private modalService: ModalService
  ) { }


  ngOnInit(): void {

    this.getShipmentsSession();
  }

  next() {
    this.first = this.first + this.rows;
  }

  prev() {
    this.first = this.first - this.rows;
  }

  reset() {
    this.first = 0;
    this.getShipmentsSession();
  }

  isLastPage(): boolean {
    return this.customers ? this.first === (this.customers.length - this.rows): true;
  }

  isFirstPage(): boolean {
    return this.customers ? this.first === 0 : true;
  }

  getShipmentsSession() {
    this.loading = true
    this.shipmentsService.getShipSession().subscribe(
      res => {this.shipmentsSession = res; console.log(res)},
      error => this.modalService.open(error.error.message),
      () => this.loading = false,
    )
  }

  removeShipSession(id: number) {
    this.loading = true
    this.shipmentsService.deleteShipSession(id).subscribe(
      () =>  this.getShipmentsSession(),
      error => {
        this.modalService.open(error.error.message);
        this.loading = false;
      },
      () => this.loading = false
    )
  }

  openShipItemSession(id: number) {
    this.loading = true
    this.shipmentsService.getShipments(id).subscribe(
      res => {
        this.mathematicalForecastTable = res;
        this.showDialog();
        },
          error => {
            this.modalService.open(error.error.message);
            this.loading = false;
          },
      () => {
        console.log('sdsds')
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
}
