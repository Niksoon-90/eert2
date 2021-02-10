import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {
  ICargoGroupNci,
  ICargoNci,
  IDorogyNci,
  IShipmentTypNci,
  IStationNci,
} from "../../../models/calculations.model";
import {ModalService} from "../../../services/modal.service";
import {ShipmentsService} from "../../../services/shipments.service";
import {CalculationsService} from "../../../services/calculations.service";
import {IShipment} from "../../../models/shipmenst.model";
import {TestService} from "../../../services/test.service";

@Component({
  selector: 'app-create-row-shipment',
  templateUrl: './create-row-shipment.component.html',
  styleUrls: ['./create-row-shipment.component.scss']
})
export class CreateRowShipmentComponent implements OnInit {

  @Input() displayModal

  @Input() sessionId

  @Input() mathematicalForecastContent

  @Output() displayModalRowClose: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output() updateListShipmentTable: EventEmitter<boolean> = new EventEmitter<boolean>();

  test: any
  createdNewRow: boolean = false
  dynamicForm: FormGroup;
  cargoGroupNci: ICargoGroupNci[];
  shipmentTypNci: IShipmentTypNci[];
  dorogyNci: IDorogyNci[];
  cargoNci: ICargoNci[];
  stationNci: IStationNci[];
  fromstationNci: IStationNci[];
  tostationNci: IStationNci[];
  primary = [ { label: 'Да', dt: true },{ label: 'Нет', dt: false }]

  constructor(
    private formBuilder: FormBuilder,
    private modalService: ModalService,
    private shipmentsService: ShipmentsService,
    private calculationsService: CalculationsService,
    private testService: TestService
  ) {

  }

  ngOnInit(): void {
    this.testService.getValueShipmentInfo().subscribe(res => this.test = res)
    this.formApi()
    this.createForm()
    this.onChangeTickets();
  }

  get f() { return this.dynamicForm.controls; }
  get t() { return this.f.shipmentYearValuePairs as FormArray; }

  onChangeTickets() {
    console.log('this.mathematicalForecastTable', this.mathematicalForecastContent)
    if (this.t.length < this.mathematicalForecastContent[0].shipmentYearValuePairs.length) {
      for (let i = this.t.length; i < this.mathematicalForecastContent[0].shipmentYearValuePairs.length; i++) {
        this.t.push(this.formBuilder.group({
          value: ['', Validators.required],
          year: this.mathematicalForecastContent[0].shipmentYearValuePairs[i].year,
          calculated: this.mathematicalForecastContent[0].shipmentYearValuePairs[i].calculated
        }));
      }
    }
  }

  createForm(){
    this.dynamicForm = this.formBuilder.group({
      cargoGroup:  ['', Validators.required],
      cargoSubGroup: [''],
      fromRoad:  ['', Validators.required],
      fromStation:  ['',  Validators.required],
      primary:  ['', Validators.required],
      receiverName:  ['', Validators.required],
      senderName:  ['', Validators.required],
      shipmentType:  ['', Validators.required],
      toRoad:  ['', Validators.required],
      toStation:  ['', Validators.required],
      shipmentYearValuePairs: new FormArray([])
    });
  }
  formApi(){
    this.getDictionaryCargo();
    this.getShipmentTypNci();
    this.getDorogyNci();
    this.getCargoNci();
    this.getStationNci();
  }
  getDictionaryCargo(){
    this.shipmentsService.getDictionaryCargo().subscribe(
      res =>  this.cargoGroupNci =res,
      error => this.modalService.open(error.error.message),
    )
  }
  getShipmentTypNci() {
    this.shipmentsService.getDictionaryShipmenttype().subscribe(
      res =>  this.shipmentTypNci =res,
      error => this.modalService.open(error.error.message),
    )
  }
  getDorogyNci() {
    this.shipmentsService.getDictionaryDictionaryRailway().subscribe(
      res =>  this.dorogyNci =res,
      error => this.modalService.open(error.error.message),
    )
  }
  getCargoNci(){
    this.calculationsService.getAllCargoNci().subscribe(
      res => this.cargoNci = res,
      error => this.modalService.open(error.error.message),
    )
  }
  getStationNci() {
    this.shipmentsService.getDictionaryDictionaryStation().subscribe(
      res =>  this.stationNci =res,
      error => this.modalService.open(error.error.message),
    )
  }
  fromRoad() {
    this.dynamicForm.controls.fromStation.reset()
    this.fromstationNci = this.stationNci.filter(station => (station.road === this.dynamicForm.controls.fromRoad.value.shortname))
    if(this.fromstationNci.length === 0){
      this.modalService.open(`В справочнике нет станции с признаком Дорога: ${this.dynamicForm.controls.fromRoad.value.name}`)
    }
  }


  toRoad() {
    this.dynamicForm.controls.toStation.reset()
    this.tostationNci = this.stationNci.filter(station => (station.road === this.dynamicForm.controls.toRoad.value.shortname))
    if(this.tostationNci.length === 0){
      this.modalService.open(`В справочнике нет станции с признаком Дорога: ${this.dynamicForm.controls.toRoad.value.name}`)
    }
  }

  createNewRowShip() {
    if (this.dynamicForm.invalid) {
      return;
    }
    const shipment: IShipment = {
      cargoGroup:	this.dynamicForm.controls.cargoGroup.value.name,
      cargoSubGroup: this.dynamicForm.controls.cargoSubGroup.value,
      fromRoad:	this.dynamicForm.controls.fromRoad.value.shortname,
      fromStation:	this.dynamicForm.controls.fromStation.value.name,
      fromStationCode:	this.dynamicForm.controls.fromStation.value.code,
      fromSubject:	this.dynamicForm.controls.fromStation.value.subjectGvc,
      receiverName:	this.dynamicForm.controls.receiverName.value.name,
      senderName:	this.dynamicForm.controls.senderName.value.name,
      shipmentType:	this.dynamicForm.controls.shipmentType.value.name,
      shipmentYearValuePairs:	this.dynamicForm.controls.shipmentYearValuePairs.value,
      toRoad:	this.dynamicForm.controls.toRoad.value.shortname,
      toStation:	this.dynamicForm.controls.toStation.value.name,
      toStationCode: this.dynamicForm.controls.toStation.value.code,
      toSubject:	this.dynamicForm.controls.toStation.value.subjectGvc,
      primary: this.dynamicForm.controls.primary.value.dt,
    }
    console.log(JSON.stringify(shipment, null, 4));
    this.shipmentsService.postCreateRowShip(this.sessionId, shipment).subscribe(
      res => console.log(),
      error => this.modalService.open(error.error.message),
      () => {
        this.clearFormNewRowShip()
        this.createdNewRow = true
        this.closeCreateRowDialog()
        // this.changesNewRow.emit(this.sessionId);
      }
    )
  }

  clearFormNewRowShip() {
    this.dynamicForm.reset()
    this.t.clear();
    this.onChangeTickets()
  }

  closeCreateRowDialog() {
    this.updateListShipmentTable.emit(this.createdNewRow)
    this.displayModalRowClose.emit(false)
    this.createdNewRow = false
  }
}
