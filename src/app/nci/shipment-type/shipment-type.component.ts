import { Component, OnInit } from '@angular/core';
import {IShipmentTypNci} from "../../models/calculations.model";
import {IAuthModel} from "../../models/auth.model";
import {AuthenticationService} from "../../services/authentication.service";
import {ModalService} from "../../services/modal.service";
import {ShipmentsService} from "../../services/shipments.service";

@Component({
  selector: 'app-shipment-type',
  templateUrl: './shipment-type.component.html',
  styleUrls: ['./shipment-type.component.scss']
})
export class ShipmentTypeComponent implements OnInit {
  cols: any[];
  totalRecords: any;
  shipmentTypNci: IShipmentTypNci[]
  nameNewShipmentTypeNci: string = '';
  user: IAuthModel

  constructor(
    public authenticationService: AuthenticationService,
    private modalService: ModalService,
    private shipmentsService: ShipmentsService
  ) {
    this.user = this.authenticationService.userValue;
  }

  ngOnInit(): void {
    this.getShipmentTypNci();
    this.cols = [
      { field: 'name', header: 'Вид сообщения', width: 'auto', isStatic :true}
    ]
  }

  createShipmentTypNci() {
    if(this.nameNewShipmentTypeNci !== ''){
      this.shipmentsService.postDictionaryShipmenttype(this.nameNewShipmentTypeNci).subscribe(
        res => console.log(),
        error => this.modalService.open(error.error.message),
        () => {
          this.nameNewShipmentTypeNci = '',
            this.getShipmentTypNci()
        }
      )
    }else{
      this.modalService.open('Укажите вид сообщения!')
    }
  }

  private getShipmentTypNci() {
    this.shipmentsService.getDictionaryShipmenttype().subscribe(
      res =>  this.shipmentTypNci =res,
      error => this.modalService.open(error.error.message),
    )
  }

  onRowEditInit() {

  }

  onRowEditSave(rowData) {
    const dictionaryShipmenttype: IShipmentTypNci = {
      id: rowData.id,
      name: rowData.name
    }
  this.shipmentsService.putDictionaryShipmenttype(dictionaryShipmenttype).subscribe(
    res => console.log(),
    error => this.modalService.open(error.error.message),
  )
  }

  onRowEditCancel() {

  }

  deleteItemCargoNci(id: any) {
    this.shipmentsService.deleteDictionaryShipmenttype(id).subscribe(
      res => console.log(),
      error => this.modalService.open(error.error.message),
      () => this.getShipmentTypNci()
    )
  }
}
