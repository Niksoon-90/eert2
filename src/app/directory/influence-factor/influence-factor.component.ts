import { Component, OnInit } from '@angular/core';
import {IInfluenceNci} from "../../models/calculations.model";
import {ModalService} from "../../services/modal.service";
import {CalculationsService} from "../../services/calculations.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthenticationService} from "../../services/authentication.service";

@Component({
  selector: 'app-influence-factor',
  templateUrl: './influence-factor.component.html',
  styleUrls: ['./influence-factor.component.scss']
})
export class InfluenceFactorComponent implements OnInit {
  cols: any[];
  totalRecords: any;
  influenceNci: IInfluenceNci[];
  form: FormGroup;
  constructor(
    private modalService: ModalService,
    private calculationsService: CalculationsService,
    public authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.getInfluenceNci();
    this.createForm();
    this.cols = [
      { field: 'id', header: 'id', width: '15px',  isStatic :true},
      { field: 'name', header: 'Наименование', width: '100px', },
      { field: 'weight', header: 'Коэффициент ', width: '15px', }
    ]
  }
  createForm(){
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      weight: new FormControl('', [Validators.required])
    })
  }

  getInfluenceNci(){
    this.calculationsService.getInfluenceNci().subscribe(
      res => this.influenceNci = res,
      error => this.modalService.open(error.error.message),
    )
  }

  creategetInfluenceNci() {
    const createInfluence:IInfluenceNci  = {
      name: this.form.controls.name.value,
      weight: Number(this.form.controls.weight.value)
    }
    this.calculationsService.postInfluenceNci(createInfluence).subscribe(
      res => console.log(),
      error => this.modalService.open(error.error.message),
      () => this.getInfluenceNci()
    )
  }

  deleteInfluenceNci(id: number) {
    this.calculationsService.deleteInfluenceNci(id).subscribe(
      res => console.log(),
      error => this.modalService.open(error.error.message),
      () => this.getInfluenceNci()
    )
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
    this.calculationsService.putInfluenceNci(influenceItemNci).subscribe(
      res => console.log(),
      error => this.modalService.open(error.error.message),
    )
  }


}
