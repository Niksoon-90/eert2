import { Component, OnInit } from '@angular/core';
import { ISubjectNci} from "../../models/calculations.model";
import {IAuthModel} from "../../models/auth.model";
import {AuthenticationService} from "../../services/authentication.service";
import {ModalService} from "../../services/modal.service";
import {ShipmentsService} from "../../services/shipments.service";
import {ConfirmationService} from "primeng/api";

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.scss']
})
export class SubjectComponent implements OnInit {
  cols: any[];
  totalRecords: any;
  subjectNci: ISubjectNci[]
  nameNewSubjectNci: string = '';
  user: IAuthModel

  constructor(
    public authenticationService: AuthenticationService,
    private modalService: ModalService,
    private shipmentsService: ShipmentsService,
    private confirmationService: ConfirmationService,
  ) {
    this.user = this.authenticationService.userValue;
  }
  ngOnInit(): void {
    this.getSubjectNci();
    this.cols = [
      { field: 'name', header: 'Субъект РФ', width: 'auto', isStatic :true}
    ]
  }

  getSubjectNci() {
    this.shipmentsService.getSubject().subscribe(
      res => this.subjectNci = res,
      error => this.modalService.open(error.error.message)
    )
  }

  onRowEditInit() {

  }

  deleteItemSubjectNci(id: any, name: string) {
    this.confirmationService.confirm({
      message: `Вы уверенны, что хотите удалить субъект: ${name}?`,
      header: 'Удаление субъекта',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.shipmentsService.deleteSubject(id).subscribe(
          res => console.log(),
          error => this.modalService.open(error.error.message),
          () =>  this.getSubjectNci()
        )
      }
    });


  }

  onRowEditSave(rowData) {
    const subjectNci: ISubjectNci = {
      id: rowData.id,
      name: rowData.name
    }
    this.shipmentsService.putSubject(subjectNci).subscribe(
      res => console.log(),
      error => this.modalService.open(error.error.message),
      () => this.getSubjectNci()
    )
  }

  onRowEditCancel() {

  }

  createsubjectNci() {
    console.log(this.nameNewSubjectNci)
    if(this.nameNewSubjectNci !== ''){
      const item: ISubjectNci = {
        id: null,
        name: this.nameNewSubjectNci
      }
      this.shipmentsService.postCreateSubject(item).subscribe(
        res => console.log(),
        error => this.modalService.open(error.error.message),
        () => {
          this.nameNewSubjectNci = '',
            this.getSubjectNci()
        }
      )

    }else{
      this.modalService.open('Укажите наименование Субъекта!')
    }
  }
}
