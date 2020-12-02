import {Component, OnChanges, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {ForecastingModelService} from "../../services/forecasting-model.service";
import {CalculationsService} from "../../services/calculations.service";
import {ICalculatingPredictiveRegression, IfFrecastValues} from "../../models/calculations.model";
import {ModalService} from "../../services/modal.service";
import {map} from "rxjs/operators";
import {IAuthModel} from "../../models/auth.model";
import {AuthenticationService} from "../../services/authentication.service";

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
    this.createTable()
  }
  createTable(){
    console.log(this.forecastModelService.getTicketInformation().stepOne.Session['id'])
    console.log(this.forecastModelService.getTicketInformation().stepOne.calcYearsNumber['name'])
    this.calculationsService.getCalculationMultiple(this.forecastModelService.getTicketInformation().stepOne.Session['id'], this.forecastModelService.getTicketInformation().stepOne.calcYearsNumber['name'],this.forecastModelService.getTicketInformation().stepOne.scenarioMacro['type'] )
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

  nextPage() {
    this.router.navigate(['steps/forecast']);
  }

  prevPage() {
    this.router.navigate(['steps/import']);
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
}
