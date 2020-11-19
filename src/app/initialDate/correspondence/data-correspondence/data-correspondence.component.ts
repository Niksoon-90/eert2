import { Component, OnInit } from '@angular/core';
import {ShipmentsService} from "../../../services/shipments.service";
import {ModalService} from "../../../services/modal.service";
import {ISession} from "../../../models/shipmenst.model";

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

}
