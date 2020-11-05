import {Component, OnInit, ViewChild} from '@angular/core';
import {ShipmentsService} from "../../../services/shipments.service";
import {ISession, IShipment} from "../../../models/shipmenst.model";
import {Table} from "primeng/table";

@Component({
  selector: 'app-data-shipments',
  templateUrl: './data-shipments.component.html',
  styleUrls: ['./data-shipments.component.scss']
})
export class DataShipmentsComponent implements OnInit {
  @ViewChild('dt') table: Table;

  shipmentsSession: ISession[];
  customers: any[];
  shipmentsListSessionId: IShipment[];
  first = 0;
  rows = 25;
  error: '';
  dialogVisible: boolean;

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
      res => {this.shipmentsListSessionId = res;},
      err => console.log('HTTP Error', err.message),
      () => this.showDialog()
    )
  }
  showDialog() {
    this.dialogVisible = true;
  }
}
