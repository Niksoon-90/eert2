import {Component, OnDestroy, OnInit} from '@angular/core';
import {IShipmentTypNci} from "../../models/calculations.model";
import {IAuthModel} from "../../models/auth.model";
import {AuthenticationService} from "../../services/authentication.service";
import {ModalService} from "../../services/modal.service";
import {ShipmentsService} from "../../services/shipments.service";
import {ConfirmationService} from "primeng/api";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-shipment-type',
  templateUrl: './shipment-type.component.html',
  styleUrls: ['./shipment-type.component.scss']
})
export class ShipmentTypeComponent implements OnInit, OnDestroy {
  cols: any[];
  totalRecords: any;
  shipmentTypNci: IShipmentTypNci[]
  nameNewShipmentTypeNci: string = '';
  user: IAuthModel
  subscriptions: Subscription = new Subscription();

  constructor(
    public authenticationService: AuthenticationService,
    private modalService: ModalService,
    private shipmentsService: ShipmentsService,
    private confirmationService: ConfirmationService,
  ) {
    this.user = this.authenticationService.userValue;
  }

  ngOnInit(): void {
    this.getShipmentTypNci();
    this.cols = [
      {field: 'name', header: 'Вид сообщения', width: 'auto', isStatic: true}
    ]
  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  createShipmentTypNci() {
    if (this.nameNewShipmentTypeNci !== '') {
      this.subscriptions.add(this.shipmentsService.postDictionaryShipmenttype(this.nameNewShipmentTypeNci.replace(/\s+/g, ' ').trim()).subscribe(
        () => console.log(),
        error => this.modalService.open(error.error.message),
        () => {
          this.nameNewShipmentTypeNci = '',
            this.getShipmentTypNci()
        }
      ))
    } else {
      this.modalService.open('Укажите вид сообщения!')
    }
  }

  private getShipmentTypNci() {
    this.subscriptions.add(this.shipmentsService.getDictionaryShipmenttype().subscribe(
      res => this.shipmentTypNci = res,
      error => this.modalService.open(error.error.message),
    ))
  }

  onRowEditInit() {

  }

  onRowEditSave(rowData) {
    const dictionaryShipmenttype: IShipmentTypNci = {
      id: rowData.id,
      name: rowData.name.replace(/\s+/g, ' ').trim()
    }
    this.subscriptions.add(this.shipmentsService.putDictionaryShipmenttype(dictionaryShipmenttype).subscribe(
      () => console.log(),
      error => this.modalService.open(error.error.message),
    ))
  }

  onRowEditCancel() {

  }

  deleteItemCargoNci(id: any, name: string) {
    this.confirmationService.confirm({
      message: `Вы уверенны, что хотите удалить вид сообщения: ${name}?`,
      header: 'Удаление вида сообщения',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.subscriptions.add(this.shipmentsService.deleteDictionaryShipmenttype(id).subscribe(
          () => console.log(),
          error => this.modalService.open(error.error.message),
          () => this.shipmentTypNci = this.shipmentTypNci.filter(shipmentTypNci => shipmentTypNci.id !== id)
        ))
      }
    });
  }
}
