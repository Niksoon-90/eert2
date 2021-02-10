import { Component, OnInit } from '@angular/core';
import {IDorogyNci} from "../../models/calculations.model";
import {IAuthModel} from "../../models/auth.model";
import {ModalService} from "../../services/modal.service";
import {AuthenticationService} from "../../services/authentication.service";
import {ShipmentsService} from "../../services/shipments.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ConfirmationService} from "primeng/api";

@Component({
  selector: 'app-dorogy',
  templateUrl: './dorogy.component.html',
  styleUrls: ['./dorogy.component.scss']
})
export class DorogyComponent implements OnInit {

  cols: any[];
  totalRecords: any;
  dorogyNci: IDorogyNci[]
  user: IAuthModel
  form: FormGroup

  constructor(
    public authenticationService: AuthenticationService,
    private modalService: ModalService,
    private shipmentsService: ShipmentsService,
    private confirmationService: ConfirmationService,
  ) {
    this.user = this.authenticationService.userValue;
  }

  ngOnInit(): void {
    this.getDorogyNci();
    this.createForm();
    this.cols = [
      { field: 'name', header: 'Наименование железных дорог', width: 'auto'},
      { field: 'shortname', header: 'Сокращенное наименование дороги', width: 'auto'},
      { field: 'code', header: 'Код', width: 'auto', isStatic :true}
    ]
  }

  createForm() {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      code: new FormControl('', [Validators.required]),
      shortname: new FormControl('', [Validators.required]),
    })
  }

  createDorogyNci() {
    if(this.form.valid){
      const neDor: IDorogyNci = {
        name: this.form.controls.name.value,
        code: this.form.controls.code.value,
        shortname: this.form.controls.shortname.value
      }
      this.shipmentsService.postDictionaryRailway(neDor).subscribe(
        res => console.log(),
        error => this.modalService.open(error.error.message),
        () => {
            this.getDorogyNci()
        }
      )
    }else{
      this.modalService.open('Не все поля заполнены!')
    }
  }

  onRowEditInit() {
  }

  onRowEditSave(rowData) {
    const dorogyNci: IDorogyNci =  {
      id: rowData.id,
      name: rowData.name,
      code: rowData.code,
      shortname: rowData.shortname
    }
    this.shipmentsService.putDictionaryRailway(dorogyNci).subscribe(
      res => console.log(),
      error => this.modalService.open(error.error.message),
      () => this.getDorogyNci()
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

  deleteItemCargoNci(id: any, name: string) {
    this.confirmationService.confirm({
      message: `Вы уверенны, что хотите удалить дорогу: ${name}?`,
      header: 'Удаление дороги',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.shipmentsService.deleteDictionaryRailway(id).subscribe(
          res => console.log(),
          error => this.modalService.open(error.error.message),
          () => this.getDorogyNci()
        )
      }
    });
  }
}
