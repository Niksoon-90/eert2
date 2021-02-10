import {Component, Input, OnInit} from '@angular/core';
import {MonoCargoSystemsModel} from "../../../models/mono-cargo-systems.model";
import {CalculationsService} from "../../../services/calculations.service";
import {ModalService} from "../../../services/modal.service";


@Component({
  selector: 'app-mono-cargo',
  templateUrl: './mono-cargo.component.html',
  styleUrls: ['./mono-cargo.component.scss']
})
export class MonoCargoComponent implements OnInit {

  @Input() sessionId

  oil: MonoCargoSystemsModel[];
  ore: MonoCargoSystemsModel[];
  metallurgy: MonoCargoSystemsModel[];
  oilMonoCargoSystems: any
  oreMonoCargoSystems: any
  metallurgyMonoCargoSystems: any
  oilInputName = '';
  oreInputName = '';
  metallurgyInputName = '';
  oilNote = '';
  oreNote = '';
  metallurgyNote = '';

  constructor(
    private calculationsService: CalculationsService,
    private modalService: ModalService,
  ) { }

  ngOnInit(): void {
    console.log(this.sessionId)
    this.getOil();
    this.getOre();
    this.getMetallurgy();
  }


  getOil(){
    this.calculationsService.getOil().subscribe(
      res => {this.oil = res; console.log('res', res)},
      error => this.modalService.open(error.message),
      () =>  console.log()
    )
  }
  getOre(){
    this.calculationsService.getOre().subscribe(
      res => {this.ore = res; console.log('res', res)},
      error => this.modalService.open(error.message),
      () =>  console.log()
    )
  }
  getMetallurgy() {
    this.calculationsService.getMetallurgy().subscribe(
      res => {
        this.metallurgy = res;
        console.log('res', res)
      },
      error => this.modalService.open(error.message),
      () => console.log()
    )
  }

  monoCargiOutput() {
    this.modalService.open('Ошибка при обращении к системе "ИАС Моногрузы".')
    // if(this.oilMonoCargoSystems){
    //   console.log(this.oilMonoCargoSystems.id, this.oilInputName, this.oilNote)
    //   this.calculationsService.postExternalForecast('oil', this.oilNote,  this.oilMonoCargoSystems.id, this.sessionId).subscribe(
    //     res => console.log(),
    //     error => this.modalService.open(error.error.message)
    //   )
    // }
    // if(this.oreMonoCargoSystems){
    //   console.log(this.oreMonoCargoSystems.id, this.oreInputName, this.oreNote, )
    //   this.calculationsService.postExternalForecast('ruda', this.oreNote,  this.oreMonoCargoSystems.id, this.sessionId).subscribe(
    //     res => console.log(),
    //     error => this.modalService.open(error.error.message)
    //   )
    // }
    // if (this.metallurgyMonoCargoSystems) {
    //   console.log(this.metallurgyMonoCargoSystems.id, this.metallurgyInputName, this.metallurgyNote, )
    //   this.calculationsService.postExternalForecast('metal', this.metallurgyNote,  this.metallurgyMonoCargoSystems.id, this.sessionId).subscribe(
    //     res => console.log(),
    //     error => this.modalService.open(error.error.message)
    //   )
    // }
  }
}
