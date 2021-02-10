import {Component, OnChanges, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {ForecastingModelService} from "../../services/forecasting-model.service";
import {CalculationsService} from "../../services/calculations.service";
import {ICalculatingPredictiveRegression} from "../../models/calculations.model";
import {ModalService} from "../../services/modal.service";
import {map} from "rxjs/operators";
import {IAuthModel} from "../../models/auth.model";
import {AuthenticationService} from "../../services/authentication.service";
import {IMacroPokModel, IMultipleMakpok} from "../../models/macroPok.model";
import {HttpResponse} from "@angular/common/http";



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
  macroPokListReg: IMultipleMakpok[]
  selectedMacro: any[] = [];
  macroPokListUpdate: any[];
  tbViewRegressionMultiMetrics: boolean = true
  historycalYears: number = 0
  checkedAutoRegression: boolean = false;

  constructor(
    private router: Router,
    public forecastModelService: ForecastingModelService,
    private calculationsService: CalculationsService,
    private modalService: ModalService,
    private authenticationService: AuthenticationService,
  ) {
    this.user = this.authenticationService.userValue;
  }

  ngOnChanges() {
    this.calculateLastTotal();
  }

  ngOnInit(): void {
    this.historycalYears = this.forecastModelService.getTicketInformation().stepOne.calcYearsNumber['name']
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
        () => {
          this.calculateLastTotal()
          this.regressionMultiMetrics()
        }
      )

  }
  regressionMultiMetrics(){
    this.calculationsService.getRegressionMetrics(this.forecastModelService.getTicketInformation().stepOne.Session['id'])
      .subscribe(
        res => {
          this.macroPokListReg = res
          console.log('2323',res)
        },
        error => this.modalService.open(error.error.message),
        () => this.tbViewRegressionMultiMetrics = false
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
    console.log(this.checkedAutoRegression)
    console.log(this.selectedMacro.length)
    console.log(this.selectedMacro.length !== 0 && this.checkedAutoRegression === true)
    let macPokId = []
    if(this.selectedMacro.length !== 0 && this.checkedAutoRegression === true) {
      this.macroPokListUpdate = this.macroPokList.filter(val => this.selectedMacro.includes(val));
      if(this.macroPokListUpdate.length !== 0){
        for(let item of this.macroPokListUpdate){
          macPokId.push(item.id)
        }
      }
    }
    if(this.checkedAutoRegression === false && this.selectedMacro.length === 0){
      this.modalService.open('Выберите  показатель или разрешите авторегрессию!')
    }else {
      this.createTable(macPokId);
       console.log(macPokId)
    }
  }




  multipleDownload() {
    this.calculationsService.getDownloadMultiple(this.forecastModelService.getTicketInformation().stepOne.Session['id']).subscribe(
      (response: HttpResponse<Blob>) => {
        console.log(response)
        let filename: string = 'multiple_regression_report.xlsx'
        let binaryData = [];
        binaryData.push(response.body);
        let downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: 'blob' }));
        downloadLink.setAttribute('download', filename);
        document.body.appendChild(downloadLink);
        downloadLink.click();
      },
      error => {
        this.modalService.open(error.error.message)
      }
    )
  }
}
