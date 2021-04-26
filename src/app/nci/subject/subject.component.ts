import {Component, OnDestroy, OnInit} from '@angular/core';
import {ISubjectNci} from "../../models/calculations.model";
import {IAuthModel} from "../../models/auth.model";
import {AuthenticationService} from "../../services/authentication.service";
import {ModalService} from "../../services/modal.service";
import {ShipmentsService} from "../../services/shipments.service";
import {ConfirmationService} from "primeng/api";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.scss']
})
export class SubjectComponent implements OnInit, OnDestroy {
  cols: any[];
  totalRecords: any;
  subjectNci: ISubjectNci[]
  nameNewSubjectNci: string = '';
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
    this.getSubjectNci();
    this.cols = [
      {field: 'name', header: 'Субъект РФ', width: 'auto', isStatic: true}
    ]
  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  getSubjectNci() {
    this.subscriptions.add(this.shipmentsService.getSubject().subscribe(
      res => this.subjectNci = res,
      error => this.modalService.open(error.error.message)
    ))
  }

  onRowEditInit() {

  }

  deleteItemSubjectNci(id: any, name: string) {
    this.confirmationService.confirm({
      message: `Вы уверенны, что хотите удалить субъект: ${name}?`,
      header: 'Удаление субъекта',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.subscriptions.add(this.shipmentsService.deleteSubject(id).subscribe(
          () => console.log(),
          error => this.modalService.open(error.error.message),
          () => this.subjectNci = this.subjectNci.filter(subjectNci => subjectNci.id !== id)
        ))
      }
    });
  }

  onRowEditSave(rowData) {
    const subjectNci: ISubjectNci = {
      id: rowData.id,
      name: rowData.name.replace(/\s+/g, ' ').trim()
    }
    this.subscriptions.add(this.shipmentsService.putSubject(subjectNci).subscribe(
      () => console.log(),
      error => this.modalService.open(error.error.message),
      () => this.getSubjectNci()
    ))
  }

  onRowEditCancel() {

  }

  createsubjectNci() {
    console.log(this.nameNewSubjectNci)
    if (this.nameNewSubjectNci !== '') {
      const item: ISubjectNci = {
        id: null,
        name: this.nameNewSubjectNci.replace(/\s+/g, ' ').trim()
      }
      this.subscriptions.add(this.shipmentsService.postCreateSubject(item).subscribe(
        () => console.log(),
        error => this.modalService.open(error.error.message),
        () => {
          this.nameNewSubjectNci = '',
            this.getSubjectNci()
        }
      ))
    } else {
      this.modalService.open('Укажите наименование Субъекта!')
    }
  }
}
