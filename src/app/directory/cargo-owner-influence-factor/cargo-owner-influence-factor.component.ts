import { Component, OnInit } from '@angular/core';
import {CalculationsService} from "../../services/calculations.service";
import {ModalService} from "../../services/modal.service";
import {ICargoOwnerInfluenceFactor} from "../../models/calculations.model";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-cargo-owner-influence-factor',
  templateUrl: './cargo-owner-influence-factor.component.html',
  styleUrls: ['./cargo-owner-influence-factor.component.scss']
})
export class CargoOwnerInfluenceFactorComponent implements OnInit {
  cargoOwnerInfluenceFactor: ICargoOwnerInfluenceFactor[];
  cols: any[];
  form: FormGroup;

  constructor(
    private calculationsService: CalculationsService,
    private modalService: ModalService
  ) { }

  ngOnInit(): void {
    this.getAllCargoOwnerInfluenceFactor();
    this.createForm()
    this.cols = [
      { field: 'id', header: 'id', width: '15px', isStatic :true},
      { field: 'cargoOwnerId', header: 'Грузовладельцы', width: '100px', },
      { field: 'influenceFactorId', header: 'Коэффициент ', width: '15px', isStatic :true},
      { field: 'koef', header: 'Коэффициент ', width: '15px', isStatic :true}
    ]
  }
  createForm() {
    this.form = new FormGroup({
      cargoOwnerId: new FormControl('', [Validators.required]),
      influenceFactorId: new FormControl('', [Validators.required]),
      koef: new FormControl('', [Validators.required])
    })
  }
  getAllCargoOwnerInfluenceFactor(){
    this.calculationsService.getAllCargoOwnerInfluenceFactor().subscribe(
      res => this.cargoOwnerInfluenceFactor = res,
      error => this.modalService.open(error.error.message)
    )
  }

  deleteCargoOwnerInfluenceFactor(id: number) {
    this.calculationsService.deleteCargoOwnerInfluenceFactorId(id).subscribe(
      res => console.log(),
      error => this.modalService.open(error.error.message)
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
    // this.calculationsService.putCargoOwnerInfluenceFactor(cargoOwnerInfluenceFactor).subscribe(
    //   res => console.log(),
    //   error => this.modalService.open(error.error.message),
    //   () => this.getAllCargoOwnerInfluenceFactor()
    // )
  }

  createcargoOwnerInfluenceFactor() {
    const cargoOwnerInfluenceFactor: ICargoOwnerInfluenceFactor = {
      cargoOwnerId: this.form.controls.cargoOwnerId.value,
      influenceFactorId: this.form.controls.influenceFactorId.value,
      koef: this.form.controls.koef.value
    }
    console.log('cargoOwnerInfluenceFactor', cargoOwnerInfluenceFactor)
    // this.calculationsService.postCargoOwnerInfluenceFactor(cargoOwnerInfluenceFactor).subscribe(
    //   res => console.log(),
    //   error => this.modalService.open(error.error.message),
    //   () => this.getAllCargoOwnerInfluenceFactor()
    // )
  }
}
