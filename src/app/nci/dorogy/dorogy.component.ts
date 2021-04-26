import { Component, OnInit } from '@angular/core';
import {IDorogyNci} from "../../models/calculations.model";
import {IAuthModel} from "../../models/auth.model";
import {ModalService} from "../../services/modal.service";
import {AuthenticationService} from "../../services/authentication.service";
import {ShipmentsService} from "../../services/shipments.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ConfirmationService} from "primeng/api";
import {Subscription} from "rxjs";

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
    this.getDorogyNci();
    this.createForm();
    this.cols = [
      { field: 'name', header: 'Наименование железных дорог', width: 'auto'},
      { field: 'shortname', header: 'Сокращенное наименование дороги', width: 'auto'},
      { field: 'code', header: 'Код', width: 'auto', isStatic :true}
    ]
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
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
        name: this.form.controls.name.value.replace(/\s+/g, ' ').trim(),
        code: this.form.controls.code.value.trim(),
        shortname: this.form.controls.shortname.value.replace(/\s+/g, ' ').trim()
      }
      this.subscriptions.add(this.shipmentsService.postDictionaryRailway(neDor).subscribe(
        () => console.log(),
        error => this.modalService.open(error.error.message),
        () => {
            this.getDorogyNci()
        }
      ))
    }else{
      this.modalService.open('Не все поля заполнены!')
    }
  }

  onRowEditInit() {
  }

  onRowEditSave(rowData) {
    const dorogyNci: IDorogyNci =  {
      id: rowData.id,
      name: rowData.name.replace(/\s+/g, ' ').trim(),
      code: rowData.code.trim(),
      shortname: rowData.shortname.replace(/\s+/g, ' ').trim()
    }
    this.subscriptions.add(this.shipmentsService.putDictionaryRailway(dorogyNci).subscribe(
      () => console.log(),
      error => this.modalService.open(error.error.message),
      () => this.getDorogyNci()
    ))
  }
  getDorogyNci() {
    this.subscriptions.add(this.shipmentsService.getDictionaryDictionaryRailway().subscribe(
      res =>  this.dorogyNci =res,
      error => this.modalService.open(error.error.message),
    ))
  }

  onRowEditCancel() {

  }

  deleteItemCargoNci(id: any, name: string) {
    this.confirmationService.confirm({
      message: `Вы уверенны, что хотите удалить дорогу: ${name}?`,
      header: 'Удаление дороги',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.subscriptions.add(this.shipmentsService.deleteDictionaryRailway(id).subscribe(
          () => console.log(),
          error => this.modalService.open(error.error.message),
          () => this.dorogyNci = this.dorogyNci.filter(dorogyNci => dorogyNci.id !== id)
        ))
      }
    });
  }
}
