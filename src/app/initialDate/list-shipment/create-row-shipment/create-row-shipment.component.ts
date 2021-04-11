import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
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
import {Subscription} from "rxjs";

@Component({
  selector: 'app-create-row-shipment',
  templateUrl: './create-row-shipment.component.html',
  styleUrls: ['./create-row-shipment.component.scss']
})
export class CreateRowShipmentComponent implements OnInit, OnDestroy {

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
  primary = [{label: 'Да', dt: true}, {label: 'Нет', dt: false}]
  subscriptions: Subscription = new Subscription();
  optimalProgressBar: boolean = true
  infoBarProgress: any[] = []
  loadingNci = 0

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
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  get f() {
    return this.dynamicForm.controls;
  }

  get t() {
    return this.f.shipmentYearValuePairs as FormArray;
  }
//TODO Validators (min 0)
  onChangeTickets() {
    if (this.t.length < this.mathematicalForecastContent[0].shipmentYearValuePairs.length) {
      for (let i = this.t.length; i < this.mathematicalForecastContent[0].shipmentYearValuePairs.length; i++) {
        this.t.push(this.formBuilder.group({
          value: ['', [Validators.required, Validators.min(0)]],
          year: this.mathematicalForecastContent[0].shipmentYearValuePairs[i].year,
          calculated: this.mathematicalForecastContent[0].shipmentYearValuePairs[i].calculated
        }));
      }
    }
  }

  createForm() {
    this.dynamicForm = this.formBuilder.group({
      cargoGroup: ['', Validators.required],
      cargoSubGroup: [''],
      fromRoad: ['', Validators.required],
      fromStation: ['', Validators.required],
      primary: ['', Validators.required],
      receiverName: ['', Validators.required],
      senderName: ['', Validators.required],
      shipmentType: ['', Validators.required],
      toRoad: ['', Validators.required],
      toStation: ['', Validators.required],
      shipmentYearValuePairs: new FormArray([])
    });
  }

  formApi() {
    this.getDictionaryCargo();
    this.getShipmentTypNci();
    this.getDorogyNci();
    this.getCargoNci();
    this.getStationNci();
  }
  loadingData(){
    this.loadingNci += 1
    if(this.loadingNci === 5){
      this.optimalProgressBar = false
    }
  }

  getDictionaryCargo() {
    this.subscriptions.add(this.shipmentsService.getDictionaryCargo().subscribe(
      res => this.cargoGroupNci = res,
      error => this.modalService.open(error.error.message),
      () => {
        this.infoBarProgress.push(`Группы грузов загружены`)
        this.loadingData()
      },
    ))
  }

  getShipmentTypNci() {
    this.subscriptions.add(this.shipmentsService.getDictionaryShipmenttype().subscribe(
      res => this.shipmentTypNci = res,
      error => this.modalService.open(error.error.message),
      () => {
        this.infoBarProgress.push('Виды перевозок загружены')
        this.loadingData()
      },
    ))
  }

  getDorogyNci() {
    this.subscriptions.add(this.shipmentsService.getDictionaryDictionaryRailway().subscribe(
      res => this.dorogyNci = res.sort((a, b) => a.code > b.code ? 1 : -1),
      error => this.modalService.open(error.error.message),
      () => {
        this.infoBarProgress.push('Дороги загружены')
        this.loadingData()
      },
    ))
  }

  getCargoNci() {
    this.subscriptions.add(this.calculationsService.getAllCargoNci().subscribe(
      res => this.cargoNci = res.sort((a, b) => a.name > b.name ? 1 : -1),
      error => this.modalService.open(error.error.message),
      () => {
        this.infoBarProgress.push('Грузовладельцы загружены')
        this.loadingData()
      },
    ))
  }
//TODO sort station
  getStationNci() {
    this.subscriptions.add(this.shipmentsService.getDictionaryDictionaryStation().subscribe(
      res => this.stationNci = res.sort((a, b) => a.name > b.name ? 1 : -1),
      error => this.modalService.open(error.error.message),
      () => {
        this.infoBarProgress.push('Станции загружены')
        this.loadingData()
      },
    ))
  }

  fromRoad() {
    this.dynamicForm.controls.fromStation.reset()
    this.fromstationNci = this.stationNci.filter(station => (station.road === this.dynamicForm.controls.fromRoad.value.shortname))
    if (this.fromstationNci.length === 0) {
      this.modalService.open(`В справочнике нет станции с признаком Дорога: ${this.dynamicForm.controls.fromRoad.value.name}`)
    }
  }


  toRoad() {
    this.dynamicForm.controls.toStation.reset()
    this.tostationNci = this.stationNci.filter(station => (station.road === this.dynamicForm.controls.toRoad.value.shortname))
    if (this.tostationNci.length === 0) {
      this.modalService.open(`В справочнике нет станции с признаком Дорога: ${this.dynamicForm.controls.toRoad.value.name}`)
    }
  }

  createNewRowShip() {
    if (this.dynamicForm.invalid) {
      return;
    }
    const shipment: IShipment = {
      cargoGroup: this.dynamicForm.controls.cargoGroup.value.name,
      cargoSubGroup: this.dynamicForm.controls.cargoSubGroup.value,
      fromRoad: this.dynamicForm.controls.fromRoad.value.shortname,
      fromStation: this.dynamicForm.controls.fromStation.value.name,
      fromStationCode: this.dynamicForm.controls.fromStation.value.code,
      fromSubject: this.dynamicForm.controls.fromStation.value.subjectGvc,
      receiverName: this.dynamicForm.controls.receiverName.value.name,
      senderName: this.dynamicForm.controls.senderName.value.name,
      shipmentType: this.dynamicForm.controls.shipmentType.value.name,
      shipmentYearValuePairs: this.dynamicForm.controls.shipmentYearValuePairs.value,
      toRoad: this.dynamicForm.controls.toRoad.value.shortname,
      toStation: this.dynamicForm.controls.toStation.value.name,
      toStationCode: this.dynamicForm.controls.toStation.value.code,
      toSubject: this.dynamicForm.controls.toStation.value.subjectGvc,
      primary: this.dynamicForm.controls.primary.value.dt,
    }
    this.subscriptions.add(this.shipmentsService.postCreateRowShip(this.sessionId, shipment).subscribe(
      () => console.log(),
      error => this.modalService.open(error.error.message),
      () => {
        this.clearFormNewRowShip()
        this.createdNewRow = true
        this.closeCreateRowDialog()
      }
    ))
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
