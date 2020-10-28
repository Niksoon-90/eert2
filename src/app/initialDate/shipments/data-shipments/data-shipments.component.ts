import { Component, OnInit } from '@angular/core';
import {ShipmentsService} from "../../../services/shipments.service";
import {ISession} from "../../../models/shipmenst.model";

@Component({
  selector: 'app-data-shipments',
  templateUrl: './data-shipments.component.html',
  styleUrls: ['./data-shipments.component.scss']
})
export class DataShipmentsComponent implements OnInit {
  shipmentsSession: ISession[];
  customers: any[];
  first = 0;
  rows = 25;
  error: '';
  constructor(
    private shipmentsService: ShipmentsService
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
    this.shipmentsService.getShipSession().subscribe(
      res => this.shipmentsSession = res,
      err => console.log('HTTP Error', err.message),
      () => console.log('HTTP request completed.')
  )
  }

  removeShipSession(id: number) {
    this.shipmentsService.deleteShipSession(id).subscribe(
      res => {console.log('ShipSession Del', res), this.getShipmentsSession();},
      err => console.log('HTTP Error', err.message),
      () => console.log('HTTP request completed.')
    )
  }

  openShipItemSession(id: number) {
    this.shipmentsService.getShipments(id).subscribe(
      res => {console.log('res', res)},
      err => console.log('HTTP Error', err.message),
      () => console.log('HTTP request completed.')
    )
  }
}
