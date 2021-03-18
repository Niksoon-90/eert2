import {Component, OnDestroy, OnInit} from '@angular/core';
import {IInfluenceNci} from "../../models/calculations.model";
import {ModalService} from "../../services/modal.service";
import {CalculationsService} from "../../services/calculations.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthenticationService} from "../../services/authentication.service";
import {IAuthModel} from "../../models/auth.model";
import {ConfirmationService} from "primeng/api";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-influence-factor',
  templateUrl: './influence-factor.component.html',
  styleUrls: ['./influence-factor.component.scss']
})
export class InfluenceFactorComponent implements OnInit, OnDestroy {
  cols: any[];
  totalRecords: any;
  influenceNci: IInfluenceNci[];
  form: FormGroup;
  user: IAuthModel;
  subscriptions: Subscription = new Subscription();

  constructor(
    private modalService: ModalService,
    private calculationsService: CalculationsService,
    public authenticationService: AuthenticationService,
    private confirmationService: ConfirmationService,
  ) {
    this.user = this.authenticationService.userValue;
  }

  ngOnInit(): void {
    this.getInfluenceNci();
    this.createForm();
    this.cols = [
      { field: 'id', header: 'id', width: '120px',  isStatic :true},
      { field: 'name', header: 'Наименование', width: 'auto', },
      { field: 'weight', header: 'Коэффициент ', width: '150px', }
    ]
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  createForm(){
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      weight: new FormControl('', [Validators.required])
    })
  }

  getInfluenceNci(){
    this.subscriptions.add(this.calculationsService.getInfluenceNci().subscribe(
      res => this.influenceNci = res,
      error => this.modalService.open(error.error.message),
    ))
  }

  creategetInfluenceNci() {
    const createInfluence:IInfluenceNci  = {
      name: this.form.controls.name.value,
      weight: Number(this.form.controls.weight.value)
    }
    this.subscriptions.add(this.calculationsService.postInfluenceNci(createInfluence).subscribe(
      () => console.log(),
      error => this.modalService.open(error.error.message),
      () => this.getInfluenceNci()
    ))
  }

  deleteInfluenceNci(id: number, name: string) {
    this.confirmationService.confirm({
      message: `Вы уверенны, что хотите удалить фактор: ${name}?`,
      header: 'Удаление фактора',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.subscriptions.add(this.calculationsService.deleteInfluenceNci(id).subscribe(
          () => console.log(),
          error => this.modalService.open(error.error.message),
          () => this.getInfluenceNci()
        ))
      }
    });
  }

  onRowEditInit() {

  }
  onRowEditCancel() {

  }

  onRowEditSave(rowData) {
    const influenceItemNci: IInfluenceNci = {
      id: rowData.id,
      name: rowData.name,
      weight: rowData.weight
    }
    this.subscriptions.add(this.calculationsService.putInfluenceNci(influenceItemNci).subscribe(
      () => console.log(),
      error => this.modalService.open(error.error.message),
    ))
  }
}
