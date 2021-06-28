import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {IAuthModel} from "../../../models/auth.model";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {
  ICorrespondencesIiasForecast,
  IForecastIASModel,
  IForecastIASModelId, IForecastIASModelIdResult, IForecastIASModelIdResults,
  IPathRequest
} from "../../../models/forecastIAS.model";
import {Router} from "@angular/router";
import {AuthenticationService} from "../../../services/authentication.service";
import {ForecastingModelService} from "../../../services/forecasting-model.service";
import {CalculationsService} from "../../../services/calculations.service";
import {ModalService} from "../../../services/modal.service";
import {UploadFileService} from "../../../services/upload-file.service";
import {ShipmentsService} from "../../../services/shipments.service";
import {HttpResponse} from "@angular/common/http";
import {PaymantIasService} from "../../../services/paymant-ias.service";
import {ExportExcelService} from "../../../services/export-excel.service";
import {Subscription} from "rxjs";
import {IIasForecast} from "../../../models/calculations.model";

@Component({
  selector: 'app-ias-route',
  templateUrl: './ias-route.component.html',
  styleUrls: ['./ias-route.component.scss']
})
export class IasRouteComponent implements OnInit, OnDestroy {

  @Input() primeryBolChange

  user: IAuthModel
  sessionId: number
  form: FormGroup;
  formTwo: FormGroup
  selectedPrimery: any
  forecastCorrespondence: IForecastIASModel[];
  smallCorrespondence: IForecastIASModel[];
  correspondencesIiasForecast: ICorrespondencesIiasForecast[]
  loadingOne: boolean = false;
  loadingTwo: boolean = false;
  productDialog: boolean;
  cols: any
  pathRequest: IPathRequest[];
  forecastIASModelId: IForecastIASModelId[]
  columnS: any
  columnF: any
  loading: boolean = true;
  downloadIasLoading: boolean = false
  downloadTotalIasLoading: boolean = false;
  downloadIasLoadingCorrespondences: boolean = false;
  downloadTotalSmallIasLoading: boolean = false;
  headerYears: any[]
  resultTwoTable: any[] = []
  pathRequestItem: IForecastIASModelIdResults
  pathRequestItemFin: IForecastIASModelIdResult
  yearsHohoho = []
  footersumYearsTwoTable = []
  dataForExcel = [];
  subscriptions: Subscription = new Subscription();
  dataForExcelTwo: IIasForecast[]
  dataForExcelTwoMain: IIasForecast[]
  dataForExcelTwoSmall: IIasForecast[]
  indexCoeff: {}

  constructor(
    public ete: ExportExcelService,
    private router: Router,
    public authenticationService: AuthenticationService,
    private forecastModelService: ForecastingModelService,
    private calculationsService: CalculationsService,
    private modalService: ModalService,
    private uploadFileService: UploadFileService,
    private shipmentsService: ShipmentsService,
    private paymantIasService: PaymantIasService
  ) {
    this.user = this.authenticationService.userValue;
  }

  ngOnInit(): void {
    if (this.forecastModelService.getTicketInformation().stepThree.mathematicalForecastTable !== null) {
      this.headerYears = this.forecastModelService.getTicketInformation().stepThree.mathematicalForecastTable
      if (this.headerYears.length !== 0) {
        for (let i = 0; this.headerYears.length < this.forecastModelService.getTicketInformation().stepOne.calcYearsNumber['name']; i++) {
          this.headerYears.push(Math.max(...this.headerYears) + 1)
        }
      }
      if (this.headerYears.length > this.forecastModelService.getTicketInformation().stepOne.calcYearsNumber['name']) {
        this.headerYears = this.headerYears.slice(0, this.forecastModelService.getTicketInformation().stepOne.calcYearsNumber['name']);
      }
    } else {
      this.headerYears = []
      for (let i = 0; i < this.forecastModelService.getTicketInformation().stepOne.calcYearsNumber['name']; i++){
        this.headerYears.push(`Прогнозный год - ${i+1}`)
      }
     // this.headerYears = ['Прогнозный год - 1', 'Прогнозный год - 2', 'Прогнозный год - 3', 'Прогнозный год - 4', 'Прогнозный год - 5', 'Прогнозный год - 6', 'Прогнозный год - 7', 'Прогнозный год - 8', 'Прогнозный год - 9', 'Прогнозный год - 10', 'Прогнозный год - 11', 'Прогнозный год - 12', 'Прогнозный год - 13', 'Прогнозный год - 14', 'Прогнозный год - 15']
    }
    this.cols = [
      {field: 'cargo_group', header: 'Группа груза', width: '100px', keyS: false},
      {field: 'from_station', header: 'Станция отправления РФ', width: '100px', keyS: false},
      {field: 'from_station_code', header: 'Код станции отправления РФ', width: '100px', keyS: false},
      {field: 'to_station', header: 'Станция назначения РФ', width: '100px', keyS: false},
      {field: 'to_station_code', header: 'Код станции назначения РФ', width: '100px', keyS: false},
    ];
    for (let i = 0; i < this.headerYears.length; i++) {
      this.cols.push({field: 'n' + (i + 1), header: this.headerYears[i], width: '100px', keyS: false})
    }
    this.createForm();
    this.forecastListIas();
    this.selectedPrimery = this.primeryBolChange;
    this.columnS = [
      {field: 'orderNum', header: 'Порядковый номер', width: '100px', keyS: false},
      {field: 'len', header: 'Длинна', width: '100px', keyS: false},
      {field: 'stationName', header: 'Станция', width: '100px', keyS: false},
      {field: 'stationCode', header: 'Код станции', width: '100px', keyS: false},
      {field: 'stationNameGS', header: 'Станция (ГС)', width: '100px', keyS: false},
      {field: 'dorName', header: 'Дорога', width: '100px', keyS: false},
    ]
    this.subscriptions.add(this.calculationsService.getIasForecasCleartIdCoeff(this.sessionId).subscribe(
      res => this.indexCoeff = res,
      error => {
        this.modalService.open(error.error.message)
        this.downloadTotalIasLoading = false
      }))
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  exportToExcel(id: number) {
    let resultIas = []
    this.dataForExcel = []
    let mass = []
    this.subscriptions.add(this.calculationsService.getPathRequest(this.form.controls.forecastCorrespondence.value.var_id, id).subscribe(
      res => {
        res.length !== 0 ? resultIas = res : resultIas = []
      },
      error => this.modalService.open(error.error.message),
      () => {
        for (let item of resultIas) {
          mass = []
          mass.push(item['orderNum'], item['len'], item['stationName'], item['stationCode'], item['stationNameGS'], item['dorName'])
          this.dataForExcel.push(mass)
        }
        let reportData = {
          title: `forecast-${id}`,
          data: this.dataForExcel,
          headers: ['Порядковый номер', 'Длинна', 'Станция', 'Код станции', 'Станция (ГС)', 'Дорога']
        }
        this.ete.exportExcel(reportData);

      }))
  }

  exportToExcelOne() {
    this.downloadIasLoadingCorrespondences = true
    let headersTable = []
    this.dataForExcel = []
    let yearSumm = []
    let mass = []
    let itemYearsSumm = 0
    if (this.correspondencesIiasForecast) {
      for (let item of this.cols) {
        headersTable.push(item.header)
      }
      headersTable.unshift('Порядковый номер')

      for (let i = 0; i < this.correspondencesIiasForecast.length; i++) {
        mass = []
        mass.push(
          i + 1,
          this.correspondencesIiasForecast[i].cargo_group,
          this.correspondencesIiasForecast[i].from_station,
          this.correspondencesIiasForecast[i].from_station_code,
          this.correspondencesIiasForecast[i].to_station,
          this.correspondencesIiasForecast[i].to_station_code,
        )
        for(let z = 0;  z < this.forecastModelService.getTicketInformation().stepOne.calcYearsNumber['name']; z ++){
          mass.push(
            this.correspondencesIiasForecast[i][`n${z+1}`] !== null ? Number(this.correspondencesIiasForecast[i][`n${z+1}`]) : 0,
          )
        }
        this.dataForExcel.push(mass)
      }
      for (let x = 1; x < 16; x++) {
        itemYearsSumm = 0
        for (let i = 0; i < this.correspondencesIiasForecast.length; i++) {
          itemYearsSumm += this.correspondencesIiasForecast[i][`n${x}`] !== null ? Number(this.correspondencesIiasForecast[i][`n${x}`]) : 0
        }
        yearSumm.push(itemYearsSumm)
      }
      let reportData = {
        title: `oneTable`,
        data: this.dataForExcel,
        headers: headersTable,
        yearSumm: yearSumm,
      }
      this.downloadIasLoadingCorrespondences = this.ete.exportExcelOne(reportData);
    }
  }

  testex() {
    let testdata
    this.subscriptions.add(this.calculationsService.getIasForecasCleartIdAnton(this.form.controls.forecastCorrespondence.value.var_id).subscribe(
      res => testdata = res,
      error => this.modalService.open(error.error.message),
      () => this.ete.testex(testdata),
    ))
  }

  exportToExcelTwo(id: number, name: string, type: string) {
    if(type === 'downloadIasLoading'){
      this.downloadIasLoading = true
    } else if(type === 'downloadTotalSmallIasLoading'){
      this.downloadTotalSmallIasLoading = true
    }
    this.subscriptions.add(this.calculationsService.getIasForecasCleartId(id).subscribe(
      res => this.dataForExcelTwo = res,
      error => {
        if(type === 'downloadIasLoading'){
          this.downloadIasLoading = false
        } else if(type === 'downloadTotalSmallIasLoading'){
          this.downloadTotalSmallIasLoading = false
        }
        this.modalService.open(error.error.message)
      },
      () => {
        //Верхняя часть таблицы
        let topHeaderInfo = `Поучастковая загрузка сети - ${name} - Расчет выполнен ${new Date()}`
        let headersTable = ''
        //Заголовки группы груза (нач участка, конец)
        let headerRodGr = []
        //Id для проверки на совпадение
        let rodGrId = []
        this.dataForExcelTwo.filter(el => el.rod_gr !== null && rodGrId.includes(el.rod_gr) === false ? (rodGrId.push(el.rod_gr), headerRodGr.push(el.rod_gr_name)) : null)

        let reportData = {
          title: `oneTable`,
          data: this.dataForExcelTwo,
          headers: headersTable,
          topHeaderInfo: topHeaderInfo,
          headerRodGr: headerRodGr
        }
        if(type === 'downloadIasLoading'){
          rodGrId.length !== 0 ? this.downloadIasLoading = this.ete.exportExcelTwo(reportData): (this.downloadIasLoading = false, this.modalService.open('Проверьте выполнен ли расчет в поездоучастков на стороне ИАС Маршрут'))
        } else if(type === 'downloadTotalSmallIasLoading'){
          rodGrId.length !== 0 ? this.downloadTotalSmallIasLoading = this.ete.exportExcelTwo(reportData): (this.downloadTotalSmallIasLoading = false, this.modalService.open('Проверьте выполнен ли расчет в поездоучастков на стороне ИАС Маршрут'))
        }
      }
    ))
  }

  mainSmall() {
    this.downloadTotalIasLoading = true
    this.subscriptions.add(this.calculationsService.getIasForTest(this.sessionId).subscribe(
      res => {
        this.dataForExcelTwoMain = res
      },
      error => {
        this.modalService.open(error.error.message)
        this.downloadTotalIasLoading = false
      },
      () => {
        //Верхняя часть таблицы
        let topHeaderInfo = `Поучастковая загрузка сети - ${this.form.controls.forecastCorrespondence.value.descr} - Расчет выполнен ${new Date()}`
        let headersTable = ''
        //Заголовки группы груза (нач участка, конец)
        let headerRodGr = []
        //Id для проверки на совпадение
        let rodGrId = []
        this.dataForExcelTwoMain.filter(el => el.rod_gr !== null && rodGrId.includes(el.rod_gr) === false ? (rodGrId.push(el.rod_gr), headerRodGr.push(el.rod_gr_name)) : null)


        let reportData = {
          title: `oneTable`,
          data: this.dataForExcelTwoMain,
          headers: headersTable,
          topHeaderInfo: topHeaderInfo,
          headerRodGr: headerRodGr
        }
        rodGrId.length !== 0 ? this.downloadTotalIasLoading = this.ete.exportExcelTwo(reportData) : (this.downloadTotalIasLoading = false, this.modalService.open('Проверьте выполнен ли расчет в поездоучастков на стороне ИАС Маршрут'))
      }
    ))
  }

  testttt2() {
    this.downloadTotalIasLoading = true
    this.subscriptions.add(this.calculationsService.getIasForecasCleartId(this.form.controls.forecastCorrespondence.value.var_id).subscribe(
      res => this.dataForExcelTwoMain = res,
      error => {
        this.modalService.open(error.error.message)
        this.downloadTotalIasLoading = false
      },
      () => {
        this.subscriptions.add(this.calculationsService.getIasForecasCleartId(this.form.controls.smallCorrespondence.value.var_id).subscribe(
          res => this.dataForExcelTwoSmall = res,
          error => {
            this.modalService.open(error.error.message)
            this.downloadTotalIasLoading = false
          },
          () => {
            this.exportSmallMain(this.dataForExcelTwoMain, this.dataForExcelTwoSmall)
          }
          )
        )
      }
      )
    )
  }

  exportSmallMain(main: IIasForecast[], small: IIasForecast[]) {

    let indexCoeff = {}
    this.subscriptions.add(this.calculationsService.getIasForecasCleartIdCoeff(this.sessionId).subscribe(
      res => indexCoeff = res,
      error => {
        this.modalService.open(error.error.message)
        this.downloadTotalIasLoading = false
      },
      () =>{
        let yearTrainRow = []
        //добавление годов из массива
        main.filter(el => yearTrainRow.includes(el.year) === false ? yearTrainRow.push(el.year) : null)
        //получение коээфициента
        for (let i = 0; i < small.length; i++) {
          let newNt = 0
          let newNo = 0

          small[i].nt !== null ? newNt = small[i].nt : newNt = 0
          small[i].no !== null ? newNo = small[i].no : newNo = 0

          let prop = 0
          for (let x = 0; x < main.length; x++) {
            let coeff = indexCoeff[`${main[x].year}`]
            if (main[x].dor_kod === small[i].dor_kod && main[x].st1_u === small[i].st1_u && main[x].st2_u === small[i].st2_u && main[x].st1_p === small[i].st1_p && main[x].st2_p === small[i].st2_p) {
              main[x].nt === null ? main[x].nt = newNt * coeff : main[x].nt += newNt * coeff;
              main[x].no === null ? main[x].no = newNo * coeff : main[x].no += newNo * coeff;
              prop += 1
            } else if(x === main.length - 1 && prop !== yearTrainRow.length){
              //добавить если не нашел в массиве совпадение
              for (let z = 0; z < yearTrainRow.length; z++) {
                let item: IIasForecast = {
                  dor_kod: small[i].dor_kod,
                  dor_name: small[i].dor_name,
                  len: small[i].len,
                  napr: small[i].napr,
                  no: small[i].no *  indexCoeff[`${yearTrainRow[z]}`],
                  nt: small[i].nt *  indexCoeff[`${yearTrainRow[z]}`],
                  num: small[i].num,
                  num_p: small[i].num_p,
                  rod_gr: small[i].rod_gr,
                  rod_gr_name: small[i].rod_gr_name,
                  st1_p: small[i].st1_p,
                  st1_p_name: small[i].st1_p_name,
                  st1_u: small[i].st1_u,
                  st1_u_namev: small[i].st1_u_namev,
                  st2_p: small[i].st2_p,
                  st2_p_name: small[i].st2_p_name,
                  st2_u: small[i].st2_u,
                  st2_u_namev: small[i].st2_u_namev,
                  year: yearTrainRow[z],
                }
                main.push(item)
              }
            }
          }
        }

        //Верхняя часть таблицы
        let topHeaderInfo = `Поучастковая загрузка сети - ${this.form.controls.forecastCorrespondence.value.descr} - Расчет выполнен ${new Date()}`
        let headersTable = ''
        //Заголовки группы груза (нач участка, конец)
        let headerRodGr = []
        //Id для проверки на совпадение
        let rodGrId = []
        main.filter(el => el.rod_gr !== null && rodGrId.includes(el.rod_gr) === false ? (rodGrId.push(el.rod_gr), headerRodGr.push(el.rod_gr_name)) : null)

        const fieldSorter = (fields) => (a, b) => fields.map(o => {
          let dir = 1;
          if (o[0] === '-') { dir = -1; o=o.substring(1); }
          return a[o] > b[o] ? dir : a[o] < b[o] ? -(dir) : 0;
        }).reduce((p, n) => p ? p : n, 0);

        main.sort(fieldSorter(['dor_kod', 'num', 'num_p', 'st1_p_name', 'st2_p_name', 'year']));

        let reportData = {
          title: `oneTable`,
          data: main,
          headers: headersTable,
          topHeaderInfo: topHeaderInfo,
          headerRodGr: headerRodGr
        }
        rodGrId.length !== 0 ? this.downloadTotalIasLoading = this.ete.exportExcelTwo(reportData): (this.downloadTotalIasLoading = false, this.modalService.open('Проверьте выполнен ли расчет в поездоучастков на стороне ИАС Маршрут'))
      }
    ))
  }


  corresIiasForecast() {
    this.loadingOne = true;
    this.loadingTwo = true;
    this.loading = false;
    if (this.selectedPrimery === true) {
      this.subscriptions.add(this.shipmentsService.putIasSaveId(
        this.sessionId,
        this.paymantIasService.getPaymentInformation().allCorrespondensRouteId === 0 ? 0 : this.paymantIasService.getPaymentInformation().allCorrespondensRouteId,
        this.form.controls.forecastCorrespondence.value.var_id,
        this.form.controls.smallCorrespondence.value !== '' ? this.form.controls.smallCorrespondence.value.var_id : 0,
      ).subscribe(
        () => console.log(),
        error => this.modalService.open(error.error.message),
        () => {
          this.paymantIasService.settPaymentForecastCorrespondence(this.form.controls.forecastCorrespondence.value.var_id)
          this.paymantIasService.settPaymentSmallCorrespondence(this.form.controls.smallCorrespondence.value !== '' ? this.form.controls.smallCorrespondence.value.var_id : 0)
        }
      ))
    } else if (this.selectedPrimery === false) {
      this.subscriptions.add(this.shipmentsService.putIasSaveId(
        this.sessionId,
        this.form.controls.forecastCorrespondence.value !== '' ? this.form.controls.forecastCorrespondence.value.var_id : 0,
        this.paymantIasService.getPaymentInformation().forecastCorrespondence,
        this.paymantIasService.getPaymentInformation().smallCorrespondence
      ).subscribe(
        () => console.log(),
        error => this.modalService.open(error.error.message),
        () => {
          this.paymantIasService.settPaymentAllCorrespondensRouteId(this.form.controls.forecastCorrespondence.value !== '' ? this.form.controls.forecastCorrespondence.value.var_id : 0)
        }
      ))
    }
    this.subscriptions.add(this.calculationsService.getIasForecastId(this.form.controls.forecastCorrespondence.value.var_id).subscribe(
      res => {
        this.correspondencesIiasForecast = res
      },
      error => this.modalService.open(error.error.message),
      () => this.loadingOne = false
    ))
    this.subscriptions.add(this.calculationsService.getForcastIasId(this.form.controls.forecastCorrespondence.value.var_id).subscribe(
      res => this.forecastIASModelId = res,
      error => this.modalService.open(error.error.message),
      () => {
        if (this.forecastIASModelId.length !== 0) {
          this.headerYearsTable(this.forecastIASModelId)
        } else {
          this.resultTwoTable = []
          this.loadingTwo = false
        }
      }
    ))
  }


  headerYearsTable(forecastIASModelId: IForecastIASModelId[]) {
    this.loadingTwo = true
    this.resultTwoTable = []
    this.columnF = [
      {field: 'dor_name', header: 'Дорога', width: '100px', keyS: false},
      {field: 'st1_u_name', header: 'Начальная станция участка', width: '100px', keyS: false},
      {field: 'st1_u', header: 'Единая сетевая разметка начальной станции', width: '100px', keyS: false},
      {field: 'st2_u_name', header: 'Конечная станция участка', width: '100px', keyS: false},
      {field: 'st2_u', header: 'Единая сетевая разметка конечной станции', width: '100px', keyS: false},
      {field: 'len', header: 'км', width: '100px', keyS: false},
    ]
    let oldMass = [];
    let newMassiv = [];
    const fin3 = []
    let fin4 = []
    let resultse = []
    for (let i = 0; i < forecastIASModelId.length; i++) {
      if (i === 0) {
        oldMass = forecastIASModelId.filter(data => data.st1_u_name === forecastIASModelId[i].st1_u_name && data.st2_u_name === forecastIASModelId[i].st2_u_name && data.dor_name === forecastIASModelId[i].dor_name)
        oldMass.sort((a, b) => a.year > b.year ? 1 : -1);
        for (let a = 0; a < oldMass.length; a++) {
          if (a === 0) {
            this.pathRequestItem = {
              dor_name: oldMass[a].dor_name,
              st1_u_name: oldMass[a].st1_u_name,
              st1_u: oldMass[a].st1_u,
              st2_u_name: oldMass[a].st2_u_name,
              st2_u: oldMass[a].st2_u,
              len: oldMass[a].len,
              ntuda: oldMass[a].ntuda === null ? 0 : oldMass[a].ntuda,
              nobratno: oldMass[a].nobratno === null ? 0 : oldMass[a].nobratno,
              year: oldMass[a].year
            }
            fin3.push(this.pathRequestItem)
          }
          if (a !== 0 && fin3[fin3.length - 1].year === oldMass[a].year) {
            fin3[fin3.length - 1].ntuda += oldMass[a]['ntuda']
            fin3[fin3.length - 1].nobratno += oldMass[a]['nobratno']
          } else if (a !== 0) {
            this.pathRequestItem = {
              dor_name: oldMass[a].dor_name,
              st1_u_name: oldMass[a].st1_u_name,
              st1_u: oldMass[a].st1_u,
              st2_u_name: oldMass[a].st2_u_name,
              st2_u: oldMass[a].st2_u,
              len: oldMass[a].len,
              ntuda: oldMass[a].ntuda === null ? 0 : oldMass[a].ntuda,
              nobratno: oldMass[a].nobratno === null ? 0 : oldMass[a].nobratno,
              year: oldMass[a].year
            }
            fin3.push(this.pathRequestItem)
          }
        }
        resultse.push(fin3)

      } else if (i !== 0 && oldMass.includes(forecastIASModelId[i])) {
        continue
      } else {
        fin4 = []
        newMassiv = forecastIASModelId.filter(data => data.st1_u_name === forecastIASModelId[i].st1_u_name && data.st2_u_name === forecastIASModelId[i].st2_u_name && data.dor_name === forecastIASModelId[i].dor_name)
        newMassiv.sort((a, b) => a.year > b.year ? 1 : -1);
        for (let a = 0; a < newMassiv.length; a++) {
          if (a === 0) {
            this.pathRequestItem = {
              dor_name: newMassiv[a].dor_name,
              st1_u_name: newMassiv[a].st1_u_name,
              st1_u: newMassiv[a].st1_u,
              st2_u_name: newMassiv[a].st2_u_name,
              st2_u: newMassiv[a].st2_u,
              len: newMassiv[a].len,
              ntuda: newMassiv[a].ntuda === null ? 0 : newMassiv[a].ntuda,
              nobratno: newMassiv[a].nobratno === null ? 0 : newMassiv[a].nobratno,
              year: newMassiv[a].year
            }
            fin4.push(this.pathRequestItem)
          }
          if (a !== 0 && fin4[fin4.length - 1].year === newMassiv[a].year) {
            fin4[fin4.length - 1].ntuda += newMassiv[a]['ntuda']
            fin4[fin4.length - 1].nobratno += newMassiv[a]['nobratno']
          } else if (a !== 0) {
            this.pathRequestItem = {
              dor_name: newMassiv[a].dor_name,
              st1_u_name: newMassiv[a].st1_u_name,
              st1_u: newMassiv[a].st1_u,
              st2_u_name: newMassiv[a].st2_u_name,
              st2_u: newMassiv[a].st2_u,
              len: newMassiv[a].len,
              ntuda: newMassiv[a].ntuda === null ? 0 : newMassiv[a].ntuda,
              nobratno: newMassiv[a].nobratno === null ? 0 : newMassiv[a].nobratno,
              year: newMassiv[a].year
            }
            fin4.push(this.pathRequestItem)
          }
        }
        resultse.push(fin4)
        oldMass = newMassiv
      }
    }
    for (let item of resultse) {
      for (let x = 0; x < item.length; x++) {
        if (!this.yearsHohoho.includes(item[x].year, 0))
          this.yearsHohoho.push(item[x].year)
      }
    }
    this.yearsHohoho.sort(function (a, b) {
      return a - b
    });
    for (let item of resultse) {
      if (item.length < this.yearsHohoho.length) {
        for (let years of this.yearsHohoho) {
          const checkObj = obj => obj.year === years;
          if (!item.some(checkObj)) {
            this.pathRequestItem = {
              dor_name: item[0].dor_name,
              st1_u_name: item[0].st1_u_name,
              st1_u: item[0].st1_u,
              st2_u_name: item[0].st2_u_name,
              st2_u: item[0].st2_u,
              len: item[0].len,
              ntuda: 0,
              nobratno: 0,
              year: years
            }
            item.push(this.pathRequestItem)
          }
          item = item.sort((a, b) => a.year > b.year ? 1 : -1);
        }
      }
    }
    for (let item of resultse) {
      this.pathRequestItemFin = {
        dor_name: item[0].dor_name,
        st1_u_name: item[0].st1_u_name,
        st1_u: item[0].st1_u,
        st2_u_name: item[0].st2_u_name,
        st2_u: item[0].st2_u,
        len: item[0].len,
        ntuda: [],
        nobratno: []
      }
      for (let i = 0; i < item.length; i++) {
        this.pathRequestItemFin.ntuda.push({ntuda: item[i].ntuda === null ? 0 : item[i].ntuda, year: item[i].year})
        this.pathRequestItemFin.nobratno.push({
          nobratno: item[i].nobratno === null ? 0 : item[i].nobratno,
          year: item[i].year
        })
      }
      this.resultTwoTable.push(this.pathRequestItemFin)
    }
    for (let i = 0; i < this.yearsHohoho.length; i++) {
      this.columnF.push({
        field: `ntuda.${i}.ntuda`,
        header: this.resultTwoTable[0].ntuda[i].year,
        width: '100px',
        keyS: false
      })
    }
    for (let i = 0; i < this.yearsHohoho.length; i++) {
      this.columnF.push({
        field: `nobratno.${i}.nobratno`,
        header: this.resultTwoTable[0].nobratno[i].year,
        width: '100px',
        keyS: false
      })
    }
    this.footerSumTwoTable(this.resultTwoTable)
  }

  footerSumTwoTable(resultTwoTable: any[]) {
    this.footersumYearsTwoTable = []
    let resultNtuda = []
    let resultNobratno = []
    for (let i = 0; i < resultTwoTable[0].ntuda.length; i++) {
      let ntuda = 0
      let nobratno = 0
      for (let x = 0; x < resultTwoTable.length; x++) {
        ntuda += resultTwoTable[x].ntuda[i].ntuda
        nobratno += resultTwoTable[x].nobratno[i].nobratno
      }
      resultNtuda.push(ntuda)
      resultNobratno.push(nobratno)
    }
    this.footersumYearsTwoTable = resultNtuda.concat(resultNobratno)
    this.loadingTwo = false
  }

  createForm() {
    if (this.forecastModelService.getTicketInformation().stepOne.Session !== null) {
      this.sessionId = this.forecastModelService.getTicketInformation().stepOne.Session['id']
    } else {
      this.sessionId = this.forecastModelService.getTicketInformation().stepThree.sessionId;
    }
    this.form = new FormGroup({
      forecastCorrespondence: new FormControl('', [Validators.required]),
      smallCorrespondence: new FormControl('', [Validators.required])
    })
    this.formTwo = new FormGroup({
      name: new FormControl('', [Validators.required])
    })
  }

  forecastListIas() {
    this.subscriptions.add(this.calculationsService.getForcastIas().subscribe(
      res => {
        this.forecastCorrespondence = res;
        this.smallCorrespondence = res;
      },
      error => this.modalService.open(error.error.message)
    ))
  }


  searchInIAS(rowData) {
    this.loadingOne = true;
    this.subscriptions.add(this.calculationsService.getPathRequest(this.form.controls.forecastCorrespondence.value.var_id, rowData.corr_id).subscribe(
      res => this.pathRequest = res,
      error => this.modalService.open(error.error.message),
      () => {
        this.loadingOne = false;
        this.productDialog = true;
      }
    ))
  }

  closeModalTable() {
    this.productDialog = false;
  }

  downloadIas() {
    if (this.form.controls.forecastCorrespondence.valid) {
      this.downloadIasLoading = true;
      this.subscriptions.add(this.uploadFileService.getDownload(this.form.controls.forecastCorrespondence.value.var_id, 'IAS_ROUTES').subscribe(
        (response: HttpResponse<Blob>) => {
          let filename: string = 'ias_routes.xlsx'
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
          this.downloadIasLoading = false
        },
        () => this.downloadIasLoading = false
      ))
    } else {
      this.modalService.open('Укажите Маршрут')
    }
  }

  downTotalloadIas() {
    if (this.form.valid) {
      this.downloadTotalIasLoading = true;
      this.subscriptions.add(this.uploadFileService.getDownloadTotal(this.sessionId, this.form.controls.forecastCorrespondence.value.var_id, this.form.controls.smallCorrespondence.value.var_id).subscribe(
        (response: HttpResponse<Blob>) => {
          let filename: string = 'total_ias_routes.xlsx'
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
          this.downloadTotalIasLoading = false
        },
        () => this.downloadTotalIasLoading = false
      ))
    } else {
      this.modalService.open('Заполните все поля!')
    }
  }

  downTotalSmallloadIas() {
    this.downloadTotalSmallIasLoading = true;
    this.subscriptions.add(this.uploadFileService.getDownload(this.form.controls.smallCorrespondence.value.var_id, 'IAS_ROUTES').subscribe(
      (response: HttpResponse<Blob>) => {
        let filename: string = 'smalll_ias_routes.xlsx'
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
        this.downloadTotalSmallIasLoading = false
      },
      () => this.downloadTotalSmallIasLoading = false
    ))
  }

  downloadIasCorrespondences() {
    this.downloadIasLoadingCorrespondences = true;
    this.subscriptions.add(this.uploadFileService.getDownloadIasCalc(this.sessionId, this.form.controls.forecastCorrespondence.value.var_id, 'IAS_CORRESPONDENCES').subscribe(
      (response: HttpResponse<Blob>) => {
        let filename: string = 'ias.xlsx'
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
        this.downloadIasLoadingCorrespondences = false
      },
      () => this.downloadIasLoadingCorrespondences = false
    ))
  }

  loadCustomers(event: any) {
    this.footerSumTwoTable(event.filteredValue)
  }

  deleteForecast() {
    if(this.selectedPrimery !== true){
      this.calculationsService.getDeleteForecast(this.form.controls.forecastCorrespondence.value.var_id).subscribe(
        () => console.log(),
        error => this.modalService.open(error.error.message),
        () => this.modalService.open('Буфер очищен')
      )
    }else{
      this.calculationsService.getDeleteForecast(this.form.controls.forecastCorrespondence.value.var_id).subscribe(
        () => console.log(),
        error => this.modalService.open(error.error.message),
        () => this.modalService.open('Буфер очищен')
      )
      this.calculationsService.getDeleteForecast(this.form.controls.smallCorrespondence.value.var_id).subscribe(
        () => console.log(),
        error => this.modalService.open(error.error.message),
        () => this.modalService.open('Буфер очищен')
      )
    }
  }
}
