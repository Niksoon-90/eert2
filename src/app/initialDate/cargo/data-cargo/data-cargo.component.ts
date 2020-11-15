import { Component, OnInit } from '@angular/core';
import {ISession} from "../../../models/shipmenst.model";
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
  customers: any;
  typeCargo: any[];

  constructor(
    private shipmentsService: ShipmentsService,
    private modalService: ModalService
  ) { }

  ngOnInit(): void {
    this.typeCargo = [
      {id:1, name:'Грузоотправитель', type: 'SENDER_CLAIMS'},
      {id:2, name:'Грузополучатель', type: 'RECEIVER_CLAIMS'}
    ]
    this.getCargoSessionSession()
  }
  next() {
    this.first = this.first + this.rows;
  }

  prev() {
    this.first = this.first - this.rows;
  }

  reset() {
    this.first = 0;
    this.getCargoSessionSession();
  }
  isLastPage(): boolean {
    return this.customers ? this.first === (this.customers.length - this.rows): true;
  }

  isFirstPage(): boolean {
    return this.customers ? this.first === 0 : true;
  }

  getCargoSessionSession() {
    this.shipmentsService.getClaimSession().subscribe(
      res => {this.cargoSession = res; console.log(res)},
      err => this.modalService.open(err.message)),
      () => console.log('HTTP request completed.')
  }

}
