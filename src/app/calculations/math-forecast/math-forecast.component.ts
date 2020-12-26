import {Component, OnChanges, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {ForecastingModelService} from "../../services/forecasting-model.service";
import {CalculationsService} from "../../services/calculations.service";
import {ICalculatingPredictiveRegression, IfFrecastValues} from "../../models/calculations.model";
import {ModalService} from "../../services/modal.service";
import {map} from "rxjs/operators";
import {IAuthModel} from "../../models/auth.model";
import {AuthenticationService} from "../../services/authentication.service";
import {IMacroPokModel} from "../../models/macroPok.model";


@Component({
  selector: 'app-math-forecast',
  templateUrl: './math-forecast.component.html',
  styleUrls: ['./math-forecast.component.scss']
})
export class MathForecastComponent implements OnInit, OnChanges {
  mathematicalForecastTable: ICalculatingPredictiveRegression[];
  lastCalculatedVolumesTotal: number[];
  lastGroupVolumesByYearsTotal: number[];
  user: IAuthModel
  macroPokList: IMacroPokModel[]
  selectedMacro: any[];
  macroPokListUpdate: any[];

  constructor(
    private router: Router,
    public forecastModelService: ForecastingModelService,
    private calculationsService: CalculationsService,
    private modalService: ModalService,
    private authenticationService: AuthenticationService
  ) {
    this.user = this.authenticationService.userValue;
  }

  ngOnChanges() {
    this.calculateLastTotal();
  }

  ngOnInit(): void {
    this.getMacroPokList();
  }

  getMacroPokList(){
    this.calculationsService.getMacroPokList(this.forecastModelService.getTicketInformation().stepOne.Session['id'], this.forecastModelService.getTicketInformation().stepOne.calcYearsNumber['name'] )
      .subscribe(
      res => {
        this.macroPokList = res
        console.log(res)
      },
        error => this.modalService.open(error.error.message)
    )
  }

  createTable(macPokId){
    console.log(macPokId)
    console.log(this.forecastModelService.getTicketInformation().stepOne.Session['id'])
    console.log(this.forecastModelService.getTicketInformation().stepOne.calcYearsNumber['name'])
    console.log(this.forecastModelService.getTicketInformation().stepOne.nameNewShip)
    this.calculationsService.getCalculationMultiple(this.forecastModelService.getTicketInformation().stepOne.Session['id'], this.forecastModelService.getTicketInformation().stepOne.calcYearsNumber['name'],this.forecastModelService.getTicketInformation().stepOne.scenarioMacro['type'], macPokId )
      .pipe(
        map(data => {
          const transformedData = Object.keys(data).map(key => Object.assign(data[key], {id: Math.random() * 1000000}));
          return transformedData;
        })
      )
      .subscribe(
        res => { console.log('res',res); this.mathematicalForecastTable = res},
        error => this.modalService.open(error.error.message),
        () => this.calculateLastTotal()
      )

  }


  calculateLastTotal() {
    this.lastCalculatedVolumesTotal=[]
    this.lastGroupVolumesByYearsTotal=[]
    for(let a = 0; a < Object.values(this.mathematicalForecastTable[0].groupVolumesByYears).length; a++){
      let summColumn = 0
      for(let i = 0; i< this.mathematicalForecastTable.length; i++){
        summColumn += Number(Object.values(this.mathematicalForecastTable[i].groupVolumesByYears)[a])
      }
      this.lastGroupVolumesByYearsTotal.push(summColumn)
    }
    for(let a = 0; a < Object.values(this.mathematicalForecastTable[0].forecastValues).length; a++){
      let summColumn = 0
      for(let i = 0; i< this.mathematicalForecastTable.length; i++){
        summColumn += Number(Object.values(this.mathematicalForecastTable[i].forecastValues)[a].value)
      }
     this.lastCalculatedVolumesTotal.push(summColumn)
    }
    console.log(this.lastCalculatedVolumesTotal)
    console.log(this.lastGroupVolumesByYearsTotal)
  }

  onRowEditInit(item) {
    console.log(item)
  }

  onRowEditSave(item) {
    for(let i of item.forecastValues){
      this.calculationsService.putUpdateMacroForecast(i.id, i.value).subscribe(
        res => console.log(),
        error => this.modalService.open(error.error.message),
        () => this.calculateLastTotal()
      )
    }
  }
  nextPage() {
    if(this.forecastModelService.ticketInformation.stepOne.newSessionId !== null){
      this.forecastModelService.ticketInformation.stepOne.Session['id'] = this.forecastModelService.ticketInformation.stepOne.newSessionId
    }
    this.router.navigate(['steps/forecast']);
  }

  prevPage() {
    this.router.navigate(['steps/import']);
  }

  test() {
    let macPokId = []
    console.log(this.selectedMacro !== undefined)
    console.log(typeof this.selectedMacro)
    if(this.selectedMacro !== undefined) {
      this.macroPokListUpdate = this.macroPokList.filter(val => this.selectedMacro.includes(val));
      if(this.macroPokListUpdate.length !== 0){
        for(let item of this.macroPokListUpdate){
          macPokId.push(item.id)
        }
      }
    }
    this.createTable(macPokId);
    console.log(macPokId)
  }
}
