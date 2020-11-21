import { Component, OnInit } from '@angular/core';
import {ShipmentsService} from "../../../services/shipments.service";
import {ModalService} from "../../../services/modal.service";
import {ISession, IShipment} from "../../../models/shipmenst.model";

@Component({
  selector: 'app-data-correspondence',
  templateUrl: './data-correspondence.component.html',
  styleUrls: ['./data-correspondence.component.scss']
})
export class DataCorrespondenceComponent implements OnInit {
  correspondenceSession: ISession[];
  first = 0;
  rows = 25;
  customers: any;
  loading: boolean = true;

  mathematicalForecastTable: IShipment[];
  dialogVisible: boolean;

  constructor(
    private shipmentsService: ShipmentsService,
    private modalService: ModalService
  ) { }

  ngOnInit(): void {
  this.getCorrespondenceSession()
  }
  next() {
    this.first = this.first + this.rows;
  }

  prev() {
    this.first = this.first - this.rows;
  }

  reset() {
    this.first = 0;
    this.getCorrespondenceSession();
  }
  isLastPage(): boolean {
    return this.customers ? this.first === (this.customers.length - this.rows): true;
  }

  isFirstPage(): boolean {
    return this.customers ? this.first === 0 : true;
  }

  getCorrespondenceSession() {
    this.loading = true;
    this.shipmentsService.getCorrespondenceSession().subscribe(
      res => {this.correspondenceSession = res; console.log(res)},
      error => this.modalService.open(error.message),
      () => this.loading = false
    )
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

  removeShipSession(id: number) {
    this.loading = true
    this.shipmentsService.deleteShipSession(id).subscribe(
      () =>  this.getCorrespondenceSession(),
      error => {
        this.modalService.open(error.error.message);
        this.loading = false;
      },
      () => this.loading = false
    )
  }
}