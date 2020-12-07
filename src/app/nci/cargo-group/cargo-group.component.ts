import { Component, OnInit } from '@angular/core';
import {ICargoGroupNci, IDorogyNci} from "../../models/calculations.model";
import {IAuthModel} from "../../models/auth.model";
import {AuthenticationService} from "../../services/authentication.service";
import {ModalService} from "../../services/modal.service";

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
  ) {
    this.user = this.authenticationService.userValue;
  }
  ngOnInit(): void {
    this.getCargoGroupNci();
    this.cols = [
      { field: 'name', header: 'Группа грузов', width: '70%', isStatic :true}
    ]
  }

  createCargoGroupNci() {
    if(this.nameNewCargoGroupNci !== ''){
      const newCargoGroupNci: ICargoGroupNci = {
        id: Math.random(),
        name: this.nameNewCargoGroupNci
      }
      this.cargoGroupNci.push(newCargoGroupNci)
    }else{
      this.modalService.open('Укажите наименование группы грузов!')
    }
  }
  getCargoGroupNci() {
    this.cargoGroupNci = [
      {id: 1, name: 'Уголь каменный'},
      {id: 2, name: 'Кокс каменноугольный'},
      {id: 3, name: 'Нефтяные грузы'},
      {id: 4, name: 'Руды всякие'},
      {id: 5, name: 'Черные металлы'},
      {id: 6, name: 'Лесные грузы'},
      {id: 7, name: 'Хлебные грузы'},
      {id: 8, name: 'Минерально-строит.'},
      {id: 9, name: 'Удобрения'},
      {id: 10, name: 'Остальные грузы'},
    ]
  }

  onRowEditInit() {

  }

  onRowEditSave(rowData) {
    let item = this.cargoGroupNci.find(x => x.id === rowData.id);
    item.name = rowData.name;
  }

  onRowEditCancel() {

  }

  deleteItemCargoNci(id: any) {
    this.cargoGroupNci = this.cargoGroupNci.filter( data => data.id !== id);
  }
}
