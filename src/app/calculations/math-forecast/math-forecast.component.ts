import {Component, OnChanges, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {ForecastingModelService} from "../../services/forecasting-model.service";
import {CalculationsService} from "../../services/calculations.service";
import {ICalculatingPredictiveRegression} from "../../models/calculations.model";
import {ModalService} from "../../services/modal.service";

@Component({
  selector: 'app-math-forecast',
  templateUrl: './math-forecast.component.html',
  styleUrls: ['./math-forecast.component.scss']
})
export class MathForecastComponent implements OnInit, OnChanges {
  mathematicalForecastTable: ICalculatingPredictiveRegression[];
  lastCalculatedVolumesTotal: number[];
  lastGroupVolumesByYearsTotal: number[];

  constructor(
    private router: Router,
    public forecastModelService: ForecastingModelService,
    private calculationsService: CalculationsService,
    private modalService: ModalService
  ) { }

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
      .subscribe(
        res => {this.mathematicalForecastTable = res; console.log(this.mathematicalForecastTable)},
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
    for(let a = 0; a < Object.values(this.mathematicalForecastTable[0].calculatedVolumes).length; a++){
      let summColumn = 0
      for(let i = 0; i< this.mathematicalForecastTable.length; i++){
        summColumn += Number(Object.values(this.mathematicalForecastTable[i].calculatedVolumes)[a])
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
      console.log(item)
  }
}
