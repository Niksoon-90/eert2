import { Component, OnInit } from '@angular/core';
import {ICargoGroupNci, IDorogyNci} from "../../models/calculations.model";
import {IAuthModel} from "../../models/auth.model";
import {AuthenticationService} from "../../services/authentication.service";
import {ModalService} from "../../services/modal.service";
import {ShipmentsService} from "../../services/shipments.service";

@Component({
  selector: 'app-cargo-group',
  templateUrl: './cargo-group.component.html',
  styleUrls: ['./cargo-group.component.scss']
})
export class CargoGroupComponent implements OnInit {

  cols: any[];
  totalRecords: any;
  cargoGroupNci: ICargoGroupNci[]
  nameNewCargoGroupNci: string = '';
  user: IAuthModel

  constructor(
    public authenticationService: AuthenticationService,
    private modalService: ModalService,
    private shipmentsService: ShipmentsService
  ) {
    this.user = this.authenticationService.userValue;
  }
  ngOnInit(): void {
    this.getCargoGroupNci();
    this.cols = [
      { field: 'name', header: 'Группа грузов', width: 'auto', isStatic :true}
    ]
  }

  createCargoGroupNci() {
    if(this.nameNewCargoGroupNci !== ''){
      this.shipmentsService.postDictionaryCargo(this.nameNewCargoGroupNci).subscribe(
        res => console.log(),
        error => this.modalService.open(error.error.message),
        () => {
          this.nameNewCargoGroupNci = '',
          this.getCargoGroupNci()
        }
      )
    }else{
      this.modalService.open('Укажите наименование группы грузов!')
    }
  }
  getCargoGroupNci() {
    this.shipmentsService.getDictionaryCargo().subscribe(
      res =>  this.cargoGroupNci =res,
      error => this.modalService.open(error.error.message),
    )
  }

  onRowEditInit() {

  }

  onRowEditSave(rowData) {
    const cargoGroupNci: ICargoGroupNci = {
     id: rowData.id,
     name: rowData.name
    }
    this.shipmentsService.putDictionaryCargo(cargoGroupNci).subscribe(
      res => console.log(),
      error => this.modalService.open(error.error.message),
    )
  }

  onRowEditCancel() {

  }

  deleteItemCargoNci(id: any) {
    this.shipmentsService.deleteDictionaryCargo(id).subscribe(
      res => console.log(),
      error => this.modalService.open(error.error.message),
      () => this.getCargoGroupNci()
    )
  }
}
