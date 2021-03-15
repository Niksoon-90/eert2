import {Component, Input, OnInit} from '@angular/core';
import {IAuthModel} from "../../../../models/auth.model";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {
  ICorrespondencesIiasForecast,
  IForecastIASModel,
  IForecastIASModelId, IForecastIASModelIdResult, IForecastIASModelIdResults,
  IPathRequest
} from "../../../../models/forecastIAS.model";
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthenticationService} from "../../../../services/authentication.service";
import {ForecastingModelService} from "../../../../services/forecasting-model.service";
import {CalculationsService} from "../../../../services/calculations.service";
import {ModalService} from "../../../../services/modal.service";
import {UploadFileService} from "../../../../services/upload-file.service";
import {ShipmentsService} from "../../../../services/shipments.service";
import {HttpResponse} from "@angular/common/http";
import {ExportExcelService} from "../../../../services/export-excel.service";

@Component({
  selector: 'app-payment-historical-ias',
  templateUrl: './payment-historical-ias.component.html',
  styleUrls: ['./payment-historical-ias.component.scss']
})
export class PaymentHistoricalIasComponent implements OnInit {

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
  downloadTotalSmallIasLoading: boolean = false;
  headerYears: any[]
  resultTwoTable: any[] = []
  pathRequestItem: IForecastIASModelIdResults
  pathRequestItemFin: IForecastIASModelIdResult
  private subscription: Subscription;
  nameSession: string
  yearsHohoho = []
  formIs: boolean = false
  test: any
  downloadIasLoadingCorrespondences: boolean = false;
  footersumYearsTwoTable = []
  dataForExcel = [];

  constructor(
    private router: Router,
    public ete: ExportExcelService,
    public authenticationService: AuthenticationService,
    private forecastModelService: ForecastingModelService,
    private calculationsService: CalculationsService,
    private modalService: ModalService,
    private uploadFileService: UploadFileService,
    private activateRoute: ActivatedRoute,
    private shipmentsService: ShipmentsService,
  ) {
    this.subscription = activateRoute.params.subscribe(params => {
      this.sessionId = params['id'], this.nameSession = params['name']
    });
    this.user = this.authenticationService.userValue;
  }


  ngOnInit(): void {
    this.createForm()
    this.forecastListIas();
    if (this.forecastModelService.getTicketInformation().stepThree.mathematicalForecastTable !== null) {
      this.headerYears = this.forecastModelService.getTicketInformation().stepThree.mathematicalForecastTable
      if (this.headerYears.length !== 0) {
        for (let i = 0; this.headerYears.length < 15; i++) {
          this.headerYears.push(Math.max(...this.headerYears) + 1)
        }
      }
      if (this.headerYears.length > 15) {
        this.headerYears = this.headerYears.slice(0, 15);
      }

    } else {
      this.headerYears = ['Прогнозный год - 1', 'Прогнозный год - 2', 'Прогнозный год - 3', 'Прогнозный год - 4', 'Прогнозный год - 5', 'Прогнозный год - 6', 'Прогнозный год - 7', 'Прогнозный год - 8', 'Прогнозный год - 9', 'Прогнозный год - 10', 'Прогнозный год - 11', 'Прогнозный год - 12', 'Прогнозный год - 13', 'Прогнозный год - 14', 'Прогнозный год - 15']
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

    this.selectedPrimery = this.primeryBolChange;

    this.columnS = [
      { field: 'orderNum', header: 'Порядковый номер', width: '100px', keyS: false},
      { field: 'len', header: 'Длина', width: '100px', keyS: false},
      { field: 'stationName', header: 'Станция', width: '100px', keyS: false},
      { field: 'stationCode', header: 'Код станции', width: '100px', keyS: false},
      { field: 'stationNameGS', header: 'Станция (ГС)', width: '100px', keyS: false},
      { field: 'dorName', header: 'Дорога', width: '100px', keyS: false},
    ]
  }
  exportToExcel(id: number) {
    let resultIas = []
    this.dataForExcel = []
    let mass = []
    this.calculationsService.getPathRequest(this.form.controls.forecastCorrespondence.value.var_id, id).subscribe(
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
      })
  }

  exportToExcelOne() {
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
          this.correspondencesIiasForecast[i].n1 !== null ? Number(this.correspondencesIiasForecast[i].n1) : 0,
          this.correspondencesIiasForecast[i].n2 !== null ? Number(this.correspondencesIiasForecast[i].n2) : 0,
          this.correspondencesIiasForecast[i].n3 !== null ? Number(this.correspondencesIiasForecast[i].n3) : 0,
          this.correspondencesIiasForecast[i].n4 !== null ? Number(this.correspondencesIiasForecast[i].n4) : 0,
          this.correspondencesIiasForecast[i].n5 !== null ? Number(this.correspondencesIiasForecast[i].n5) : 0,
          this.correspondencesIiasForecast[i].n6 !== null ? Number(this.correspondencesIiasForecast[i].n6) : 0,
          this.correspondencesIiasForecast[i].n7 !== null ? Number(this.correspondencesIiasForecast[i].n7) : 0,
          this.correspondencesIiasForecast[i].n8 !== null ? Number(this.correspondencesIiasForecast[i].n8) : 0,
          this.correspondencesIiasForecast[i].n9 !== null ? Number(this.correspondencesIiasForecast[i].n9) : 0,
          this.correspondencesIiasForecast[i].n10 !== null ? Number(this.correspondencesIiasForecast[i].n10) : 0,
          this.correspondencesIiasForecast[i].n11 !== null ? Number(this.correspondencesIiasForecast[i].n11) : 0,
          this.correspondencesIiasForecast[i].n12 !== null ? Number(this.correspondencesIiasForecast[i].n12) : 0,
          this.correspondencesIiasForecast[i].n13 !== null ? Number(this.correspondencesIiasForecast[i].n13) : 0,
          this.correspondencesIiasForecast[i].n14 !== null ? Number(this.correspondencesIiasForecast[i].n14) : 0,
          this.correspondencesIiasForecast[i].n15 !== null ? Number(this.correspondencesIiasForecast[i].n15) : 0,
        )
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
      this.ete.exportExcelOne(reportData);
    }
  }


  // corresIiasForecast() {
  //   this.loadingOne = true;
  //   this.loadingTwo = true;
  //   this.loading = false;
  //   this.shipmentsService.putIasSaveId(
  //     this.sessionId,
  //     0,
  //     this.form.controls.forecastCorrespondence.value.var_id,
  //     this.form.controls.smallCorrespondence.value !== '' ? this.form.controls.smallCorrespondence.value.var_id : 0,
  //   ).subscribe(
  //     res => console.log(res),
  //     error => this.modalService.open(error.error.message)
  //   )
  //   this.calculationsService.getIasForecastId(this.form.controls.forecastCorrespondence.value.var_id).subscribe(
  //     res => {
  //       this.correspondencesIiasForecast = res
  //     },
  //     error => this.modalService.open(error.error.message),
  //     () => this.loadingOne = false
  //   )
  //   this.calculationsService.getForcastIasId(this.form.controls.forecastCorrespondence.value.var_id).subscribe(
  //     res => {
  //       this.forecastIASModelId = res
  //     },
  //     error => this.modalService.open(error.error.message),
  //     () => {
  //       if (this.forecastIASModelId.length !== 0) {
  //         this.headerYearsTable(this.forecastIASModelId)
  //       } else {
  //         this.resultTwoTable = []
  //         this.loadingTwo = false
  //       }
  //     }
  //   )
  // }
  corresIiasForecast() {
    this.loadingOne = true;
    this.loadingTwo = true;
    this.loading = false;
    if (this.selectedPrimery === true) {
      this.shipmentsService.putIasSaveId(
        this.sessionId,
        this.forecastModelService.getTicketInformation().history.allCorrespondensRouteId === 0 || this.forecastModelService.getTicketInformation().history.allCorrespondensRouteId === null ? 0 : this.forecastModelService.getTicketInformation().history.allCorrespondensRouteId,
        this.form.controls.forecastCorrespondence.value.var_id,
        this.form.controls.smallCorrespondence.value !== '' ? this.form.controls.smallCorrespondence.value.var_id : 0,
      ).subscribe(
        res => console.log(res),
        error => this.modalService.open(error.error.message),
        () => {
          this.forecastModelService.ticketInformation.history.firstRouteId = this.form.controls.forecastCorrespondence.value.var_id
          this.forecastModelService.ticketInformation.history.secondRouteId = this.form.controls.smallCorrespondence.value !== '' ? this.form.controls.smallCorrespondence.value.var_id : 0
        }
      )
    } else if (this.selectedPrimery === false) {
      this.shipmentsService.putIasSaveId(
        this.sessionId,
        this.form.controls.forecastCorrespondence.value !== '' ? this.form.controls.forecastCorrespondence.value.var_id : 0,
        this.forecastModelService.getTicketInformation().history.firstRouteId === 0 || this.forecastModelService.getTicketInformation().history.firstRouteId === null ? 0 : this.forecastModelService.getTicketInformation().history.firstRouteId,
        this.forecastModelService.getTicketInformation().history.secondRouteId === 0 || this.forecastModelService.getTicketInformation().history.secondRouteId === null ? 0 : this.forecastModelService.getTicketInformation().history.secondRouteId
      ).subscribe(
        res => console.log(res),
        error => this.modalService.open(error.error.message),
        () => {
          this.forecastModelService.ticketInformation.history.allCorrespondensRouteId = this.form.controls.forecastCorrespondence.value !== '' ? this.form.controls.forecastCorrespondence.value.var_id : 0
        }
      )
    }
    this.calculationsService.getIasForecastId(this.form.controls.forecastCorrespondence.value.var_id).subscribe(
      res => {
        this.correspondencesIiasForecast = res
      },
      error => this.modalService.open(error.error.message),
      () => this.loadingOne = false
    )
    this.calculationsService.getForcastIasId(this.form.controls.forecastCorrespondence.value.var_id).subscribe(
      res => {
        this.forecastIASModelId = res
      },
      error => this.modalService.open(error.error.message),
      () => {
        if (this.forecastIASModelId.length !== 0) {
          this.headerYearsTable(this.forecastIASModelId)
        } else {
          this.resultTwoTable = []
          this.loadingTwo = false
        }
      }
    )
  }

  correspondenceIAS(id: number) {
    this.loadingOne = true;
    this.loadingTwo = true;
    this.loading = false;
    this.calculationsService.getIasForecastId(id).subscribe(
      res => {
        this.correspondencesIiasForecast = res
      },
      error => this.modalService.open(error.error.message),
      () => this.loadingOne = false
    )
    this.calculationsService.getForcastIasId(id).subscribe(
      res => {
        this.forecastIASModelId = res
      },
      error => this.modalService.open(error.error.message),
      () => {
        if (this.forecastIASModelId.length !== 0) {
          this.headerYearsTable(this.forecastIASModelId)
        } else {
          this.resultTwoTable = []
          this.loadingTwo = false
        }
      }
    )
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
      }
      else if (i !== 0 && oldMass.includes(forecastIASModelId[i])) {
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
    console.log(this.yearsHohoho)
    console.log(resultse)
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
    //this.resultTwoTable = resultse
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

  footerSumTwoTable(resultTwoTable: any[]){
    this.footersumYearsTwoTable = []
    let resultNtuda = []
    let resultNobratno = []
    for (let i = 0; i < resultTwoTable[0].ntuda.length; i++){
      let ntuda = 0
      let nobratno = 0
      for (let x = 0; x < resultTwoTable.length; x++){
        ntuda += resultTwoTable[x].ntuda[i].ntuda
        nobratno += resultTwoTable[x].nobratno[i].nobratno
      }
      resultNtuda.push(ntuda)
      resultNobratno.push(nobratno)
    }
    this.footersumYearsTwoTable = resultNtuda.concat(resultNobratno)
    this.loadingTwo = false
  }



  forecastListIas() {
    this.calculationsService.getForcastIas().subscribe(
      res => {
        this.forecastCorrespondence = res;
        this.smallCorrespondence = res;
      },
      error => this.modalService.open(error.error.message),
      () => {
        this.formIs = false
        let forecastCorrespondenceDefault
        let smallCorrespondenceDefault
        let allCorrespondensRouteId
        if (this.primeryBolChange === true) {
          (this.forecastModelService.getTicketInformation().history.firstRouteId === 0 || this.forecastModelService.getTicketInformation().history.firstRouteId === null) ? forecastCorrespondenceDefault = '' : (forecastCorrespondenceDefault = this.forecastCorrespondence.find(el => el.var_id === this.forecastModelService.getTicketInformation().history.firstRouteId), this.formIs = true);
          (this.forecastModelService.getTicketInformation().history.secondRouteId === 0 || this.forecastModelService.getTicketInformation().history.secondRouteId === null) ? smallCorrespondenceDefault = '' : (smallCorrespondenceDefault = this.smallCorrespondence.find(el => el.var_id === this.forecastModelService.getTicketInformation().history.secondRouteId), this.formIs = true);
          this.form.controls['forecastCorrespondence'].setValue(forecastCorrespondenceDefault);
          this.form.controls['smallCorrespondence'].setValue(smallCorrespondenceDefault);
          if (this.forecastModelService.getTicketInformation().history.firstRouteId !== null && this.forecastModelService.getTicketInformation().history.firstRouteId !== 0) {
            this.correspondenceIAS(this.form.controls.forecastCorrespondence.value.var_id)
          }
        } else if (this.primeryBolChange === false) {
          (this.forecastModelService.getTicketInformation().history.allCorrespondensRouteId === 0 || this.forecastModelService.getTicketInformation().history.allCorrespondensRouteId === null) ? allCorrespondensRouteId = '' : (allCorrespondensRouteId = this.forecastCorrespondence.find(el => el.var_id === this.forecastModelService.getTicketInformation().history.allCorrespondensRouteId), this.formIs = true);
          this.form.controls['forecastCorrespondence'].setValue(allCorrespondensRouteId);
          if (this.forecastModelService.getTicketInformation().history.allCorrespondensRouteId !== null && this.forecastModelService.getTicketInformation().history.allCorrespondensRouteId !== 0) {
            this.correspondenceIAS(this.form.controls.forecastCorrespondence.value.var_id)
          }
        }

      }
    )
  }


  prevPage() {
    this.router.navigate(['payments/match/', this.sessionId, this.nameSession]);
    this.forecastModelService.ticketInformation.history.primeryBolChange = false;
    this.form.reset()
  }


  searchInIAS(rowData) {
    console.log('iasForecastId', this.form.controls.forecastCorrespondence.value.var_id)
    console.log('iasCorrespondenceId', rowData.corr_id)
    this.loadingOne = true;
    this.calculationsService.getPathRequest(this.form.controls.forecastCorrespondence.value.var_id, rowData.corr_id).subscribe(
      res => {
        this.pathRequest = res,
          console.log('Ias', res)
      },
      error => this.modalService.open(error.error.message),
      () => {
        this.loadingOne = false;
        this.productDialog = true;
      }
    )
  }

  closeModalTable() {
    this.productDialog = false;
  }

  downloadIas() {
    if (this.form.controls.forecastCorrespondence.valid) {
      this.downloadIasLoading = true;
      this.uploadFileService.getDownload(this.form.controls.forecastCorrespondence.value.var_id, 'IAS_ROUTES').subscribe(
        (response: HttpResponse<Blob>) => {
          console.log(response)
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
      )
    } else {
      this.modalService.open('Укажите Маршрут')
    }
  }

  downTotalloadIas() {
    console.log('Id прогноза из ИАС Маршруты (основные): ', this.form.controls.forecastCorrespondence.value.var_id)
    console.log('Id прогноза из ИАС Маршруты (мелкие): ', this.form.controls.smallCorrespondence.value.var_id)
    console.log('Id сессии загрузки исторических данных: ', this.sessionId)
    if (this.form.valid) {
      this.downloadTotalIasLoading = true;
      this.uploadFileService.getDownloadTotal(this.sessionId, this.form.controls.forecastCorrespondence.value.var_id, this.form.controls.smallCorrespondence.value.var_id).subscribe(
        (response: HttpResponse<Blob>) => {
          console.log(response)
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
      )
    } else {
      this.modalService.open('Заполните все поля!')
    }
  }

  downTotalSmallloadIas() {
    this.downloadTotalSmallIasLoading = true;
    this.uploadFileService.getDownload(this.form.controls.smallCorrespondence.value.var_id, 'IAS_ROUTES').subscribe(
      (response: HttpResponse<Blob>) => {
        console.log(response)
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
    )
  }

  createForm() {
    this.form = new FormGroup({
      forecastCorrespondence: new FormControl('', [Validators.required]),
      smallCorrespondence: new FormControl('', [Validators.required])
    })
    this.formTwo = new FormGroup({
      name: new FormControl('', [Validators.required])
    })
  }

  downloadIasCorrespondences() {
    this.downloadIasLoadingCorrespondences = true;
    this.uploadFileService.getDownloadIasCalc(this.sessionId, this.form.controls.forecastCorrespondence.value.var_id, 'IAS_CORRESPONDENCES').subscribe(
      (response: HttpResponse<Blob>) => {
        console.log(response)
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
    )
  }

  loadCustomers(event: any) {
    //  this.resultTwoTable = event.filteredValue
    this.footerSumTwoTable(event.filteredValue)
  }
}
