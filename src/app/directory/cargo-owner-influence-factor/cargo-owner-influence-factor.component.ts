import {Component, OnInit, ViewChild} from '@angular/core';
import {CalculationsService} from "../../services/calculations.service";
import {ModalService} from "../../services/modal.service";
import {ICargoNci, ICargoOwnerInfluenceFactor, IInfluenceNci} from "../../models/calculations.model";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthenticationService} from "../../services/authentication.service";
import {IAuthModel} from "../../models/auth.model";
import {MathForecastCalcService} from "../../services/math-forecast-calc.service";
import {ConfirmationService} from "primeng/api";
import {Table} from "primeng/table";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-cargo-owner-influence-factor',
  templateUrl: './cargo-owner-influence-factor.component.html',
  styleUrls: ['./cargo-owner-influence-factor.component.scss']
})
export class CargoOwnerInfluenceFactorComponent implements OnInit {

  @ViewChild(Table)

  dt: Table
  cargoOwnerInfluenceFactor: ICargoOwnerInfluenceFactor[];
  cols: any[];
  form: FormGroup;
  cargoNci:ICargoNci[];
  influenceNci: IInfluenceNci[];
  user: IAuthModel
  loading: boolean = false
  subscriptions: Subscription = new Subscription();

  constructor(
    private calculationsService: CalculationsService,
    private modalService: ModalService,
    public authenticationService: AuthenticationService,
    private mathForecastCalcService: MathForecastCalcService,
    private confirmationService: ConfirmationService,
  ) {
    this.user = this.authenticationService.userValue;
  }

  ngOnInit(): void {
    this.subscriptions.add(this.mathForecastCalcService.getValue()
      .subscribe (
        res => {
        if(res.length !== 0){
          this.cargoOwnerInfluenceFactor = res
      }
    }))
    this.getCargoNci();
    this.createForm();
    this.getInfluenceNci();
    this.cols = [
      { field: 'id', header: 'id', width: '120px', isStatic :true},
      { field: 'cargoOwnerName', header: 'Грузовладельцы', width: 'auto', },
      { field: 'influenceFactorName', header: 'Факторы влияния ', width: 'auto'},
      { field: 'koef', header: 'Коэффициент', width: '150px'}
    ]
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  createForm() {
    this.form = new FormGroup({
      cargoOwnerId: new FormControl('', [Validators.required]),
      influenceFactorId: new FormControl('', [Validators.required]),
      koef: new FormControl('', [Validators.required, Validators.min(0), Validators.max(1)]),
    })
  }
  getCargoNci(){
    this.subscriptions.add(this.calculationsService.getAllCargoNci().subscribe(
      res => this.cargoNci = res,
      error => this.modalService.open(error.error.message),
    ))
  }
  getInfluenceNci(){
    this.subscriptions.add(this.calculationsService.getInfluenceNci().subscribe(
      res => {this.influenceNci = res;},
      error => this.modalService.open(error.error.message),
    ))
  }
  getAllCargoOwnerInfluenceFactor(){
    this.loading = true;
    this.subscriptions.add(this.calculationsService.getAllCargoOwnerInfluenceFactor().subscribe(
      res => this.mathForecastCalcService.setValue(res),
      error => this.modalService.open(error.error.message),
      () => this.loading = false
    ))
  }

  deleteCargoOwnerInfluenceFactor(id: number, name: string) {
    this.confirmationService.confirm({
      message: `Вы уверенны, что хотите удалить фактор: ${name}?`,
      header: 'Удаление фактора',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.subscriptions.add(this.calculationsService.deleteCargoOwnerInfluenceFactorId(id).subscribe(
          () => this.cargoOwnerInfluenceFactor = this.cargoOwnerInfluenceFactor.filter(cargoOwnerInfluenceFactor => cargoOwnerInfluenceFactor.id !== id),
          error => this.modalService.open(error.error.message)
        ))
      }
    });
  }

  onRowEditSave(rowData) {
    const cargoOwnerInfluenceFactor: ICargoOwnerInfluenceFactor = {
      id: rowData.id,
      cargoOwnerId: rowData.cargoOwnerId,
      influenceFactorId: rowData.influenceFactorId,
      koef: rowData.koef
    }
    this.subscriptions.add(this.calculationsService.putCargoOwnerInfluenceFactor(cargoOwnerInfluenceFactor).subscribe(
      () => console.log(),
      error => {
        this.modalService.open(error.error.message),
          this.dt.isRowEditing(rowData)
      },
    ))
  }

  createcargoOwnerInfluenceFactor() {
    const cargoOwnerInfluenceFactor: ICargoOwnerInfluenceFactor = {
      cargoOwnerId: this.form.controls.cargoOwnerId.value.id,
      influenceFactorId: this.form.controls.influenceFactorId.value.id,
      koef: this.form.controls.koef.value
    }

    this.subscriptions.add(this.calculationsService.postCargoOwnerInfluenceFactor(cargoOwnerInfluenceFactor).subscribe(
      () =>  console.log(),
      error => this.modalService.open(error.error.message),
      () => this.factor(cargoOwnerInfluenceFactor.cargoOwnerId)
    ))
  }
  factor(id: number) {
    this.loading = true
    this.subscriptions.add(this.calculationsService.getAllFactorCargoId(id)
      .subscribe(
        res => this.cargoOwnerInfluenceFactor = res,
        error => this.modalService.open(error.error.message),
        () =>  this.loading = false
      ))
  }

  downAll() {
    this.getAllCargoOwnerInfluenceFactor();
  }
}
