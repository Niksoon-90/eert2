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
  loading: boolean = true;
  checkTypeCargo: boolean = true;


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
    }else if(this.checkTypeCargo === false){
      this.getCargoSessionSession('RECEIVER_CLAIMS')
    }
  }

  test(id: number) {
    console.log(id)
  }
}
