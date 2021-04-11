import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {IMongoObject, MonoCargoSystemsModel} from "../../../models/mono-cargo-systems.model";
import {CalculationsService} from "../../../services/calculations.service";
import {ModalService} from "../../../services/modal.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MessageService} from "primeng/api";
import {ForecastingModelService} from "../../../services/forecasting-model.service";
import {Subscription} from "rxjs";


@Component({
  selector: 'app-mono-cargo',
  templateUrl: './mono-cargo.component.html',
  styleUrls: ['./mono-cargo.component.scss']
})
export class MonoCargoComponent implements OnInit, OnDestroy {

  @Input() sessionId

  oil: MonoCargoSystemsModel[];
  ore: MonoCargoSystemsModel[];
  metallurgy: MonoCargoSystemsModel[];
  mongoObjectIn: IMongoObject
  formOil: FormGroup
  formOre: FormGroup
  formMetallurgy: FormGroup
  subscriptions: Subscription = new Subscription();

  constructor(
    private calculationsService: CalculationsService,
    private modalService: ModalService,
    private messageService: MessageService,
    public forecastModelService: ForecastingModelService
  ) {
  }

  ngOnInit(): void {
    this.createForm();
    if(this.forecastModelService.getTicketInformation().stepOne.oilCargo !== null) {
      this.getOil();
    }
    if(this.forecastModelService.getTicketInformation().stepOne.ore !== null){
      this.getOre();
    }
    if(this.forecastModelService.getTicketInformation().stepOne.metallurgy !== null) {
      this.getMetallurgy();
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  createForm() {
    if(this.forecastModelService.getTicketInformation().stepOne.oilCargo !== null) {
      this.formOil = new FormGroup({
        parentCalculationOil: new FormControl('', [Validators.required]),
        nameOil: new FormControl('', [Validators.required]),
        descriptionOil: new FormControl('', [Validators.maxLength(250)]),
      })
    }
    if(this.forecastModelService.getTicketInformation().stepOne.ore !== null) {
      this.formOre = new FormGroup({
        parentCalculationOre: new FormControl('', [Validators.required]),
        nameOre: new FormControl('', [Validators.required]),
        descriptionOre: new FormControl('', [Validators.maxLength(250)]),
      })
    }
    if(this.forecastModelService.getTicketInformation().stepOne.metallurgy !== null) {
      this.formMetallurgy = new FormGroup({
        parentCalculationMetallurgy: new FormControl('', [Validators.required]),
        nameMetallurgy: new FormControl('', [Validators.required]),
        descriptionMetallurgy: new FormControl('', [Validators.minLength(0), Validators.maxLength(250)]),
      })
    }
  }


  getOil() {
    this.subscriptions.add(this.calculationsService.getOil().subscribe(
      res => this.oil = res,
      error => this.modalService.open(error.message),
      () => {
        this.forecastModelService.getTicketInformation().stepOne.oilCargo !== null ? this.formOil.controls.parentCalculationOil.setValue(this.forecastModelService.getTicketInformation().stepOne.oilCargo) : this.formOil.controls.parentCalculationOil.setValue('')
      }
    ))
  }

  getOre() {
    this.subscriptions.add(this.calculationsService.getOre().subscribe(
      res => this.ore = res,
      error => this.modalService.open(error.message),
      () => {
        this.forecastModelService.getTicketInformation().stepOne.ore !== null ? this.formOre.controls.parentCalculationOre.setValue(this.forecastModelService.getTicketInformation().stepOne.ore) : this.formOil.controls.parentCalculationOre.setValue('')
      }
    ))
  }

  getMetallurgy() {
    this.subscriptions.add(this.calculationsService.getMetallurgy().subscribe(
      res => this.metallurgy = res,
      error => this.modalService.open(error.message),
      () => {
        this.forecastModelService.getTicketInformation().stepOne.metallurgy !== null ? this.formMetallurgy.controls.parentCalculationMetallurgy.setValue(this.forecastModelService.getTicketInformation().stepOne.metallurgy) : this.formOil.controls.parentCalculationMetallurgy.setValue('')
      }
    ))
  }

  monoCargiOutput(type: string) {

    if (type === 'oil') {
      this.mongoObjectIn = {
        description: this.formOil.controls.descriptionOil.value,
        name: this.formOil.controls.nameOil.value,
        parentCalculationId: this.formOil.controls.parentCalculationOil.value.id,
        sessionId: this.sessionId
      }
    } else if (type === 'ruda') {
      this.mongoObjectIn = {
        description: this.formOre.controls.descriptionOre.value,
        name: this.formOre.controls.nameOre.value,
        parentCalculationId: this.formOre.controls.parentCalculationOre.value.id,
        sessionId: this.sessionId
      }
    } else if (type === 'metal') {
      this.mongoObjectIn = {
        description: this.formMetallurgy.controls.descriptionMetallurgy.value,
        name: this.formMetallurgy.controls.nameMetallurgy.value,
        parentCalculationId: this.formMetallurgy.controls.parentCalculationMetallurgy.value.id,
        sessionId: this.sessionId
      }
    }

    this.subscriptions.add(this.calculationsService.postExternalForecast(this.mongoObjectIn, type).subscribe(
      () => console.log(),
      error => this.modalService.open(error.error.message),
      () => this.test()
    ))
  }

  test() {
    this.messageService.add({severity: 'Успех', summary: 'Успешно!', detail: 'Данные переданы.'});
  }
}
