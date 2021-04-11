import {Component, OnChanges, OnDestroy, OnInit} from '@angular/core';
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
import {Subscription} from "rxjs";


@Component({
  selector: 'app-math-forecast',
  templateUrl: './math-forecast.component.html',
  styleUrls: ['./math-forecast.component.scss']
})
export class MathForecastComponent implements OnInit, OnChanges, OnDestroy {
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
  macroIndexesIds: number[]
  filterSelectedMacroType: boolean = false
  loadingTableMacroPokList: boolean = false
  subscriptions: Subscription = new Subscription();

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

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  getMacroPokList() {
    this.loadingTableMacroPokList = true
    this.subscriptions.add(this.calculationsService.getMacroPokList(this.forecastModelService.getTicketInformation().stepOne.Session['id'], this.forecastModelService.getTicketInformation().stepOne.calcYearsNumber['name'])
      .subscribe(
        res => {
          res.length === 0 ? this.macroPokList = [] : this.macroPokList = res
        },
        error => {
          this.modalService.open(error.error.message)
          this.loadingTableMacroPokList = false
        },
        () => this.loadingTableMacroPokList = false
      ))
  }

  createTable(macPokId) {
    console.log(macPokId)
    this.subscriptions.add(this.calculationsService.getCalculationMultiple(this.forecastModelService.getTicketInformation().stepOne.Session['id'], this.forecastModelService.getTicketInformation().stepOne.calcYearsNumber['name'], this.forecastModelService.getTicketInformation().stepOne.scenarioMacro['type'], macPokId)
      .pipe(
        map(data => {
          const transformedData = Object.keys(data).map(key => Object.assign(data[key], {id: Math.random() * 1000000}));
          return transformedData;
        })
      )
      .subscribe(
        res =>  res.length === 0 ? this.mathematicalForecastTable = [] : this.mathematicalForecastTable = res,
        error => this.modalService.open(error.error.message),
        () => {
          this.calculateLastTotal()
          this.regressionMultiMetrics()
        }
      ))
  }

  regressionMultiMetrics() {
    this.subscriptions.add(this.calculationsService.getRegressionMetrics(this.forecastModelService.getTicketInformation().stepOne.Session['id'])
      .subscribe(
        res => this.macroPokListReg = res,
        error => this.modalService.open(error.error.message),
        () => this.tbViewRegressionMultiMetrics = false
      ))
  }


  calculateLastTotal() {
    this.lastCalculatedVolumesTotal = []
    this.lastGroupVolumesByYearsTotal = []
    if(this.mathematicalForecastTable.length !== 0){
      for (let a = 0; a < Object.values(this.mathematicalForecastTable[0].groupVolumesByYears).length; a++) {
        let summColumn = 0
        for (let i = 0; i < this.mathematicalForecastTable.length; i++) {
          summColumn += Number(Object.values(this.mathematicalForecastTable[i].groupVolumesByYears)[a])
        }
        this.lastGroupVolumesByYearsTotal.push(summColumn)
      }
      for (let a = 0; a < Object.values(this.mathematicalForecastTable[0].forecastValues).length; a++) {
        let summColumn = 0
        for (let i = 0; i < this.mathematicalForecastTable.length; i++) {
          summColumn += Number(Object.values(this.mathematicalForecastTable[i].forecastValues)[a].value)
        }
        this.lastCalculatedVolumesTotal.push(summColumn)
      }
    }
  }

  onRowEditInit(item) {

  }

  onRowEditSave(item) {
    for (let i of item.forecastValues) {
      this.subscriptions.add(this.calculationsService.putUpdateMacroForecast(i.id, i.value).subscribe(
        () => console.log(),
        error => this.modalService.open(error.error.message),
        () => this.calculateLastTotal()
      ))
    }
  }

  nextPage() {
    if (this.forecastModelService.ticketInformation.stepOne.newSessionId !== null) {
      this.forecastModelService.ticketInformation.stepOne.Session['id'] = this.forecastModelService.ticketInformation.stepOne.newSessionId
    }
    this.router.navigate(['steps/forecast']);
  }

  prevPage() {
    this.router.navigate(['steps/import']);
  }

  test() {
    let macPokId = []
    console.log('this.selectedMacro', this.selectedMacro)
    console.log('this.macroPokList', this.macroPokList)
    if (this.selectedMacro.length !== 0 && this.checkedAutoRegression !== true) {
    //  this.macroPokListUpdate = this.macroPokList.filter(val => this.selectedMacro.includes(val));
      for(let i = 0; i < this.selectedMacro.length; i++){
        for(let x = 0; x < this.macroPokList.length; x++){
          if(this.macroPokList[x].id === this.selectedMacro[i].id){
            macPokId.push(this.selectedMacro[i].id)
            continue
          }
        }
      }
    }
    if (this.checkedAutoRegression === false && this.selectedMacro.length === 0) {
      this.modalService.open('Выберите  показатель или разрешите авторегрессию!')
    } else {
      this.createTable(macPokId);
    }
  }


  multipleDownload() {
    this.subscriptions.add(this.calculationsService.getDownloadMultiple(this.forecastModelService.getTicketInformation().stepOne.Session['id']).subscribe(
      (response: HttpResponse<Blob>) => {
        let filename: string = 'multiple_regression_report.xlsx'
        let binaryData = [];
        binaryData.push(response.body);
        let downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: 'blob'}));
        downloadLink.setAttribute('download', filename);
        document.body.appendChild(downloadLink);
        downloadLink.click();
      },
      async (error) => {
        const message = JSON.parse(await error.error.text()).message;
        this.modalService.open(message)
      }
    ))
  }

  optionalCalculatedMakro() {
    this.loadingTableMacroPokList = true
    this.getMacroPokList()
    this.subscriptions.add(this.calculationsService.getOptimalMacro(this.forecastModelService.getTicketInformation().stepOne.Session['id'], this.forecastModelService.getTicketInformation().stepOne.scenarioMacro['type'])
      .subscribe(
        res => this.macroIndexesIds = res.macroIndexesIds,
        error => {
          this.modalService.open(error.error.message)
            this.loadingTableMacroPokList = false
        },
        () => this.searchIdMacro()
      ))
  }

  searchIdMacro() {
    this.selectedMacro = []
    if (this.macroIndexesIds.length !== 0) {
      for (let item of this.macroIndexesIds) {
        let selecterMacroItem = this.macroPokList.find(macro => macro.id === item)
        if (selecterMacroItem) {
          this.selectedMacro.push(selecterMacroItem)
        }
      }
      this.checkedAutoRegression = false
    }if(this.selectedMacro.length === 0) {
      this.checkedAutoRegression = true
    }
    this.loadingTableMacroPokList = false
  }

  filterSelectedMacro() {
    this.filterSelectedMacroType = !this.filterSelectedMacroType
    if (this.filterSelectedMacroType === true) {
      this.macroPokList = this.selectedMacro
    } else {
      this.getMacroPokList()
    }
  }

  clearfilterSelectedMacro() {
    this.selectedMacro = []
    this.getMacroPokList()
  }
}
