import { Component, OnInit } from '@angular/core';
import {IAuthModel} from "../../models/auth.model";
import {AuthenticationService} from "../../services/authentication.service";
import { IStationNci} from "../../models/calculations.model";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-station',
  templateUrl: './station.component.html',
  styleUrls: ['./station.component.scss']
})
export class StationComponent implements OnInit {
  user: IAuthModel
  cols: any
  stationNci: IStationNci[];
  form: FormGroup

  constructor(
    public authenticationService: AuthenticationService
  ) {
    this.user = this.authenticationService.userValue;
  }

  ngOnInit(): void {
    this.getStationNci();
    this.createForm();
    this.cols = [
      { field: 'name', header: 'Название станции ', width: '50%'},
      { field: 'code', header: 'Код станции', width: '20%' }
    ]
  }
  createForm(){
    this.form = new FormGroup({
      nameStation: new FormControl('', [Validators.required]),
      code: new FormControl('', [Validators.required])
    })
  }

  onRowEditInit() {

  }

  onRowEditSave(rowData) {
    let item = this.stationNci.find(x => x.id === rowData.id);
    item.name = rowData.name;
    item.code = rowData.code;
  }

  onRowEditCancel() {

  }

  deleteItemCargoNci(id: any) {
    this.stationNci = this.stationNci.filter( data => data.id !== id);
  }

  createStatioNci() {
    const createStation:IStationNci  = {
      id: Math.random(),
      name: this.form.controls.nameStation.value,
      code: Number(this.form.controls.code.value)
    }
    this.stationNci.push(createStation)
  }

 getStationNci() {
    this.stationNci = [
      {id: 1, name: 'ИКАБЬЯ', code: 90450},
      {id: 2, name: 'КУАНДА', code: 90650},
      {id: 3, name: 'НОВАЯ ЧАРА', code: 90430},
      {id: 4, name: 'АЗЕЙ', code: 92220},
      {id: 5, name: 'АЛЗАМАЙ', code: 92070},
    ]
  }
}
