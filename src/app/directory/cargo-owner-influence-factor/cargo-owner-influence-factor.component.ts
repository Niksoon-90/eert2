import { Component, OnInit } from '@angular/core';
import {CalculationsService} from "../../services/calculations.service";
import {ModalService} from "../../services/modal.service";
import {ICargoNci, ICargoOwnerInfluenceFactor, IInfluenceNci} from "../../models/calculations.model";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthenticationService} from "../../services/authentication.service";
import {IAuthModel} from "../../models/auth.model";

@Component({
  selector: 'app-cargo-owner-influence-factor',
  templateUrl: './cargo-owner-influence-factor.component.html',
  styleUrls: ['./cargo-owner-influence-factor.component.scss']
})
export class CargoOwnerInfluenceFactorComponent implements OnInit {
  cargoOwnerInfluenceFactor: ICargoOwnerInfluenceFactor[];
  cols: any[];
  form: FormGroup;
  cargoNci:ICargoNci[];
  influenceNci: IInfluenceNci[];
  user: IAuthModel

  constructor(
    private calculationsService: CalculationsService,
    private modalService: ModalService,
    public authenticationService: AuthenticationService
  ) {
    this.user = this.authenticationService.userValue;
  }

  ngOnInit(): void {
    this.getAllCargoOwnerInfluenceFactor();
    this.getCargoNci();
    this.createForm();
    this.getInfluenceNci();
    this.cols = [
      { field: 'id', header: 'id', width: '120px', isStatic :true},
      { field: 'cargoOwnerName', header: 'Грузовладельцев', width: 'auto', },
      { field: 'influenceFactorName', header: 'Фактора влияния ', width: 'auto'},
      { field: 'koef', header: 'Коэффициент', width: '150px'}
    ]
  }
  createForm() {
    this.form = new FormGroup({
      cargoOwnerId: new FormControl('', [Validators.required]),
      influenceFactorId: new FormControl('', [Validators.required]),
      koef: new FormControl('', [Validators.required, Validators.min(0), Validators.max(1)]),
    })
  }
  getCargoNci(){
    this.calculationsService.getAllCargoNci().subscribe(
      res => this.cargoNci = res,
      error => this.modalService.open(error.error.message),
    )
  }
  getInfluenceNci(){
    this.calculationsService.getInfluenceNci().subscribe(
      res => {this.influenceNci = res; console.log('1', res)},
      error => this.modalService.open(error.error.message),
    )
  }
  getAllCargoOwnerInfluenceFactor(){
    this.calculationsService.getAllCargoOwnerInfluenceFactor().subscribe(
      res => {this.cargoOwnerInfluenceFactor = res; console.log(res)},
      error => this.modalService.open(error.error.message)
    )
  }

  deleteCargoOwnerInfluenceFactor(id: number) {
    console.log(id)
    this.calculationsService.deleteCargoOwnerInfluenceFactorId(id).subscribe(
      res => console.log(),
      error => this.modalService.open(error.error.message),
      () => this.getAllCargoOwnerInfluenceFactor()
    )
  }

  onRowEditSave(rowData) {
    console.log(rowData)
    const cargoOwnerInfluenceFactor: ICargoOwnerInfluenceFactor = {
      id: rowData.id,
      cargoOwnerId: rowData.cargoOwnerId,
      influenceFactorId: rowData.influenceFactorId,
      koef: rowData.koef
    }
    console.log('cargoOwnerInfluenceFactor', cargoOwnerInfluenceFactor)
    this.calculationsService.putCargoOwnerInfluenceFactor(cargoOwnerInfluenceFactor).subscribe(
      res => console.log(),
      error => this.modalService.open(error.error.message),
      () => this.getAllCargoOwnerInfluenceFactor()
    )
  }

  createcargoOwnerInfluenceFactor() {
    const cargoOwnerInfluenceFactor: ICargoOwnerInfluenceFactor = {
      cargoOwnerId: this.form.controls.cargoOwnerId.value.id,
      influenceFactorId: this.form.controls.influenceFactorId.value.id,
      koef: this.form.controls.koef.value
    }
    console.log('cargoOwnerInfluenceFactor', cargoOwnerInfluenceFactor)
    this.calculationsService.postCargoOwnerInfluenceFactor(cargoOwnerInfluenceFactor).subscribe(
      res => console.log(),
      error => this.modalService.open(error.error.message),
      () => this.getAllCargoOwnerInfluenceFactor()
    )
  }
}
