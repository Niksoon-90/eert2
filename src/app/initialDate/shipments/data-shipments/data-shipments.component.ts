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
  massSummYears: any[];
  summYears: 0;
  typePrimary: any;

  constructor(
    private shipmentsService: ShipmentsService
  ) { }

  ngOnInit(): void {
    this.typePrimary = [
      {id: 1, name: 'да', type: true},
      {id: 2, name: 'нет', type: false}
    ]
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
      res => {this.shipmentsSession = res; console.log(res)},
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
    console.log(id)
    this.shipmentsService.getShipments(id).subscribe(
      res => {this.shipmentsListSessionId = res; console.log('23', res); this.test()},
      err => console.log('HTTP Error', err.message),
      () => this.showDialog()
    )
  }
  showDialog() {
    this.dialogVisible = true;
  }

  test() {
    this.massSummYears = [ ]
    for (let i = 0; i < this.shipmentsListSessionId[0].shipmentYearValuePairs.length ; i++){
      this.summYears = 0;
      for (let x = 0; x < this.shipmentsListSessionId.length; x++){
        console.log(this.shipmentsListSessionId[x])
        console.log(i)
        console.log(this.shipmentsListSessionId[x].shipmentYearValuePairs[i])
        this.summYears += this.shipmentsListSessionId[x].shipmentYearValuePairs[i].value;
      }
      console.log(this.summYears)
      this.massSummYears.push(this.summYears);
    }
  }

  test2(i: number) {
    console.log(i)
  }
}
