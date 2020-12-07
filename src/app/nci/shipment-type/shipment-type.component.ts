import { Component, OnInit } from '@angular/core';
import {IShipmentTypNci} from "../../models/calculations.model";
import {IAuthModel} from "../../models/auth.model";
import {AuthenticationService} from "../../services/authentication.service";
import {ModalService} from "../../services/modal.service";

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
  ) {
    this.user = this.authenticationService.userValue;
  }

  ngOnInit(): void {
    this.getShipmentTypNci();
    this.cols = [
      { field: 'name', header: 'Вид сообщения', width: '70%', isStatic :true}
    ]
  }

  createShipmentTypNci() {
    if(this.nameNewShipmentTypeNci !== ''){
      const newShipmentTypNci: IShipmentTypNci = {
        id: Math.random(),
        name: this.nameNewShipmentTypeNci
      }
      this.shipmentTypNci.push(newShipmentTypNci)
    }else{
      this.modalService.open('Укажите наименование группы грузов!')
    }
  }

  private getShipmentTypNci() {
    this.shipmentTypNci = [
      {id: 1, name: 'Внутр. перевозки'},
      {id: 2, name: 'Импорт'},
      {id: 3, name: 'Транзит'},
      {id: 4, name: 'Экспорт'}
    ]
  }

  onRowEditInit() {

  }

  onRowEditSave(rowData) {
    let item = this.shipmentTypNci.find(x => x.id === rowData.id);
    item.name = rowData.name;
  }

  onRowEditCancel() {

  }

  deleteItemCargoNci(id: any) {
    this.shipmentTypNci = this.shipmentTypNci.filter( data => data.id !== id);
  }
}
