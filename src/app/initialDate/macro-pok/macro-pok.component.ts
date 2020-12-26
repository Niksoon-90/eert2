import { Component, OnInit } from '@angular/core';
import {ShipmentsService} from "../../services/shipments.service";
import {IMacroPokModel} from "../../models/macroPok.model";
import {MessageService} from "primeng/api";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ModalService} from "../../services/modal.service";
import {AuthenticationService} from "../../services/authentication.service";
import {IAuthModel} from "../../models/auth.model";
import {ICargoGroupNci, IShipmentTypNci} from "../../models/calculations.model";

@Component({
  selector: 'app-macro-pok',
  templateUrl: './macro-pok.component.html',
  styleUrls: ['./macro-pok.component.scss'],
  providers: [MessageService]
})
export class MacroPokComponent implements OnInit {
  loading: boolean = true;
  user: IAuthModel
  cargoGroups: ICargoGroupNci[]
  shipmentTypes: IShipmentTypNci[]
  constructor(
    private shipmentsService: ShipmentsService,
    private modalService:ModalService,
    private authenticationService: AuthenticationService
  ) {
    this.user = this.authenticationService.userValue;
  }

  macroPokList: IMacroPokModel[];
  form: FormGroup
  years = [];


  ngOnInit(): void {
    this.getMacroPok()
    this.getCargoGroupNci();
    this.getShipmentTypNci()
    this.createForm()
    this.years = [];
    for (let i = 15; i <= 99; i++) {
      this.years.push({name: `20`+i});
    }
  }
  getCargoGroupNci() {
    this.shipmentsService.getDictionaryCargo().subscribe(
      res =>  this.cargoGroups =res,
      error => this.modalService.open(error.error.message),
    )
  }
  getShipmentTypNci() {
    this.shipmentsService.getDictionaryShipmenttype().subscribe(
      res =>  this.shipmentTypes =res,
      error => this.modalService.open(error.error.message),
    )
  }
  createForm(){
    this.form = new FormGroup({
      cargoGroup: new FormControl('',[Validators.required]),
      shipmentType: new FormControl('', [Validators.required]),
      year: new FormControl('', [Validators.required]),
      macroIndex: new FormControl('', [Validators.required]),
      pissyValueMacro: new FormControl('', [Validators.required]),
      optimisticValueMacro: new FormControl('', [Validators.required]),
      basicValueMacro: new FormControl('', [Validators.required]),
    })
  }
  resetForm(){
    this.form.reset({
      cargoGroup: '',
      shipmentType: '',
      year: '',
      macroIndex: '',
      pissyValueMacro: '',
      optimisticValueMacro: '',
      basicValueMacro: ''
    })
  }

  getMacroPok(){
    this.loading = true;
    this.shipmentsService.getMacroPok().subscribe(
      res => {
        this.macroPokList = res,
          this.macroPokList = this.macroPokList.sort((a, b) => a.id < b.id ? 1 : -1)
      },
      error => this.modalService.open(error.error.message),
      () => this.loading = false
    )
  }

  saveNewMacroPok(value) {
     const macroPok: IMacroPokModel = {
       cargoGroup:	value.cargoGroup['name'],
       macroIndex:	value.macroIndex,
       shipmentType:	value.shipmentType['name'],
       valueLow: value.pissyValueMacro,
       valueHigh: value.optimisticValueMacro,
       valueMedium: value.basicValueMacro,
       year: value.year['name']
     }
     console.log(macroPok)
     this.shipmentsService.postMacroPok(macroPok).subscribe(
       res => {
         this.getMacroPok();
         this.resetForm();
       }
     )
  }

  onRowEditInit(macroPok: any) {
    console.log(macroPok)
  }

  onRowEditSave(macroPok: any) {
    console.log(JSON.stringify(macroPok))
    this.shipmentsService.putMacroPok(macroPok).subscribe(
      res => console.log(),
      error => this.modalService.open(error.error.message),
      () => this.getMacroPok()
    )
  }

  onRowEditCancel(macroPok: any, ri) {
    console.log(macroPok)
  }

  mackPokDel(id: number) {
    this.shipmentsService.deleteMackPok(id).subscribe(
      res => {
        this.getMacroPok();
        this.resetForm();
      },
      error => this.modalService.open(error.error.message),
      () => console.log('HTTP request completed.')
    )
  }
}
