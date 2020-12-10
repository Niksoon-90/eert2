import { Component, OnInit } from '@angular/core';
import {ICargoNci, IDorogyNci} from "../../models/calculations.model";
import {IAuthModel} from "../../models/auth.model";
import {ModalService} from "../../services/modal.service";
import {CalculationsService} from "../../services/calculations.service";
import {AuthenticationService} from "../../services/authentication.service";
import {ShipmentsService} from "../../services/shipments.service";

@Component({
  selector: 'app-dorogy',
  templateUrl: './dorogy.component.html',
  styleUrls: ['./dorogy.component.scss']
})
export class DorogyComponent implements OnInit {

  cols: any[];
  totalRecords: any;
  dorogyNci: IDorogyNci[]
  nameNewDorogyNci: string = '';
  user: IAuthModel

  constructor(
    public authenticationService: AuthenticationService,
    private modalService: ModalService,
    private shipmentsService: ShipmentsService
  ) {
    this.user = this.authenticationService.userValue;
  }

  ngOnInit(): void {
    this.getDorogyNci();
    this.cols = [
      { field: 'name', header: 'Наименование дороги', width: '70%', isStatic :true}
    ]
  }

  createDorogyNci() {
    if(this.nameNewDorogyNci !== ''){
      this.shipmentsService.postDictionaryRailway(this.nameNewDorogyNci).subscribe(
        res => console.log(),
        error => this.modalService.open(error.error.message),
        () => {
          this.nameNewDorogyNci = '',
            this.getDorogyNci()
        }
      )
    }else{
      this.modalService.open('Укажите наименование Дорги!')
    }
  }

  onRowEditInit() {

  }

  onRowEditSave(rowData) {
    const dorogyNci: IDorogyNci =  {
      name: rowData.name,
      code: rowData.name,
      shortname: rowData.name
    }
    this.shipmentsService.putDictionaryRailway(dorogyNci).subscribe(
      res => console.log(),
      error => this.modalService.open(error.error.message),
    )
  }
  getDorogyNci() {
    this.shipmentsService.getDictionaryDictionaryRailway().subscribe(
      res =>  this.dorogyNci =res,
      error => this.modalService.open(error.error.message),
    )
  }

  onRowEditCancel() {

  }

  deleteItemCargoNci(id: any) {
    this.shipmentsService.deleteDictionaryRailway(id).subscribe(
      res => console.log(),
      error => this.modalService.open(error.error.message),
      () => this.getDorogyNci()
    )
  }
}
