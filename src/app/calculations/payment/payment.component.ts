import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {IAuthModel} from "../../models/auth.model";
import {AuthenticationService} from "../../services/authentication.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ForecastingModelService} from "../../services/forecasting-model.service";
import {
  ICorrespondencesIiasForecast,
  IForecastIASModel,
  IForecastIASModelId, IForecastIASModelIdResult, IForecastIASModelIdResults,
  IPathRequest
} from "../../models/forecastIAS.model";
import {CalculationsService} from "../../services/calculations.service";
import {ModalService} from "../../services/modal.service";
import {HttpResponse} from "@angular/common/http";
import {UploadFileService} from "../../services/upload-file.service";
import {ShipmentsService} from "../../services/shipments.service";

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
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
  downloadSmallIasLoading: boolean = false;
  downloadTotalSmallIasLoading: boolean = false;
  headerYears: any[]
  resultTwoTable: any[] = []
  pathRequestItem: IForecastIASModelIdResults
  pathRequestItemFin: IForecastIASModelIdResult
  yearsHohoho = []

  constructor(
    private router: Router,
    public authenticationService: AuthenticationService,
    private forecastModelService: ForecastingModelService,
    private calculationsService: CalculationsService,
    private modalService: ModalService,
    private uploadFileService: UploadFileService,
    private shipmentsService: ShipmentsService
  ) {
    this.user = this.authenticationService.userValue;
  }

  ngOnInit(): void {
    if(this.forecastModelService.getTicketInformation().stepOne.Session !== null){
      this.headerYears = this.forecastModelService.ticketInformation.stepOne.Session['historicalYears'].split(',')
      if(this.headerYears.length < 10){
        let lenghtMas: number = 10 - this.headerYears.length;
        const maxItem: number = Math.max(...this.headerYears);
        for(let a=1; a <= lenghtMas; a++){
          this.headerYears.push(maxItem + a)
        }
        if(this.headerYears.length > 10){
          this.headerYears = this.headerYears.slice(0, 10);
        }
      }
    }else{
        this.headerYears = ['Прогнозный год - 1', 'Прогнозный год - 2', 'Прогнозный год - 3', 'Прогнозный год - 4','Прогнозный год - 5','Прогнозный год - 6','Прогнозный год - 7','Прогнозный год - 8','Прогнозный год - 9','Прогнозный год - 10']
    }

    this.cols = [
      { field: 'cargo_group', header: 'Группа груза', width: '100px', keyS: false},
      { field: 'from_station', header: 'Станция отправления РФ', width: '100px', keyS: false },
      { field: 'from_station_code', header: 'Код станции отправления РФ', width: '100px', keyS: false },
      { field: 'to_station', header: 'Станция назначения РФ', width: '100px', keyS: false },
      { field: 'to_station_code', header: 'Код станции назначения РФ', width: '100px', keyS: false },
    ];
    for(let i=0; i < this.headerYears.length; i++){
      this.cols.push({ field: 'n'+ (i+1), header: this.headerYears[i], width: '100px', keyS: false })
    }
    this.createForm();
    this.forecastListIas();
    this.selectedPrimery = this.forecastModelService.ticketInformation.stepThree.primeryBolChange;
    this.columnS = [
      { field: 'orderNum', header: 'Порядковый номер', width: '100px', keyS: false},
      { field: 'len', header: 'Длина', width: '100px', keyS: false},
      { field: 'stationName', header: 'Наименование станции', width: '100px', keyS: false},
      { field: 'stationCode', header: 'Код станции', width: '100px', keyS: false}
    ]
  }

  corresIiasForecast(){
    this.loadingOne = true;
    this.loadingTwo = true;
    this.loading = false;
    console.log(this.form.controls.forecastCorrespondence.value.var_id)
    console.log(this.form.controls.smallCorrespondence)
    this.shipmentsService.putIasSaveId(
      this.sessionId,
      this.form.controls.forecastCorrespondence.value.var_id,
      this.selectedPrimery === true ? this.form.controls.smallCorrespondence.value.var_id : 0,
    ).subscribe(
      res => console.log(res),
      error => this.modalService.open(error.error.message)
    )
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
          if(this.forecastIASModelId.length !== 0){
            this.headerYearsTable(this.forecastIASModelId)
          }else{
            this.resultTwoTable = []
            this.loadingTwo = false
          }
        }
      )
  }


  headerYearsTable(forecastIASModelId: IForecastIASModelId[]){
    this.loadingTwo = true
    this.resultTwoTable = []
    this.columnF = [
      { field: 'dor_name', header: 'Дорога', width: '100px', keyS: false},
      { field: 'st1_u_name', header: 'Начальная станция участка', width: '100px', keyS: false},
      { field: 'st1_u', header: 'Единая сетевая разметка начальной станции', width: '100px', keyS: false},
      { field: 'st2_u_name', header: 'Конечная станция участка', width: '100px', keyS: false},
      { field: 'st2_u', header: 'Единая сетевая разметка конечной станции', width: '100px', keyS: false},
      { field: 'len', header: 'км', width: '100px', keyS: false},
    ]
    let oldMass = [];
    let newMassiv = [];
    const fin3 = []
    let fin4 = []
    let resultse = []
    for(let i = 0; i<forecastIASModelId.length; i++) {
      if (i === 0) {
        oldMass = forecastIASModelId.filter(data => data.st1_u_name === forecastIASModelId[i].st1_u_name && data.st2_u_name === forecastIASModelId[i].st2_u_name && data.dor_name === forecastIASModelId[i].dor_name)
        oldMass.sort((a, b) => a.year > b.year ? 1 : -1);
        console.log('oldMass', oldMass)
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
        console.log('fin3', fin3)
        console.log('resultse', resultse)
        resultse.push(fin3)
      }
      if (i !== 0 && oldMass.includes(forecastIASModelId[i])) {
        continue
      } else {
        fin4 = []
        newMassiv = forecastIASModelId.filter(data => data.st1_u_name === forecastIASModelId[i].st1_u_name && data.st2_u_name === forecastIASModelId[i].st2_u_name && data.dor_name === forecastIASModelId[i].dor_name)
        newMassiv.sort((a, b) => a.year > b.year ? 1 : -1);
        console.log('newMassiv', newMassiv)
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
        console.log('fin4', fin4)
        console.log('resultse', resultse)
        resultse.push(fin4)
        oldMass = newMassiv
      }
    }
    for(let item of resultse){
      for(let x= 0; x < item.length; x++){
        if(!this.yearsHohoho.includes(item[x].year, 0))
          this.yearsHohoho.push(item[x].year)
      }
    }
    this.yearsHohoho.sort(function(a, b){return a - b});
    for(let item of resultse){
      if(item.length < this.yearsHohoho.length){
        for(let years of this.yearsHohoho){
          const checkObj = obj => obj.year === years;
          if(!item.some(checkObj)){
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
    console.log('2',this.yearsHohoho)
    console.log(resultse)
    for(let item of resultse){
      this.pathRequestItemFin = {
        dor_name: item[0].dor_name,
        st1_u_name: item[0].st1_u_name,
        st1_u: item[0].st1_u,
        st2_u_name: item[0].st2_u_name,
        st2_u: item[0].st2_u,
        len: item[0].len,
        ntuda: [],
        nobratno:  []
      }
      for(let i = 0; i < item.length; i++){
        this.pathRequestItemFin.ntuda.push({ntuda: item[i].ntuda === null ? 0 :item[i].ntuda, year: item[i].year})
        this.pathRequestItemFin.nobratno.push({nobratno: item[i].nobratno === null ? 0 :item[i].nobratno, year: item[i].year})
      }
      this.resultTwoTable.push(this.pathRequestItemFin)
    }
    //this.resultTwoTable = resultse
    for(let i =0; i < this.yearsHohoho.length; i++){
      this.columnF.push({field: `ntuda.${i}.ntuda`, header: this.resultTwoTable[0].ntuda[i].year, width: '100px', keyS: false})
    }
    for(let i =0; i < this.yearsHohoho.length; i++){
      this.columnF.push({field: `nobratno.${i}.nobratno`, header: this.resultTwoTable[0].nobratno[i].year, width: '100px', keyS: false})
    }
    this.loadingTwo = false
  }



  createForm() {
    if(this.forecastModelService.getTicketInformation().stepOne.Session !== null){
      this.sessionId = this.forecastModelService.getTicketInformation().stepOne.Session['id']
    }else{
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
  forecastListIas(){
    this.calculationsService.getForcastIas().subscribe(
      res => {
        this.forecastCorrespondence = res;
        this.smallCorrespondence = res;
      },
      error => this.modalService.open(error.error.message)
    )
  }

  prevPage() {
    this.router.navigate(['steps/forecast']);
    this.forecastModelService.ticketInformation.stepThree.primeryBolChange = false;
  }


  searchInIAS(rowData) {
    console.log('iasForecastId', this.form.controls.forecastCorrespondence.value.var_id)
    console.log('iasCorrespondenceId', rowData.corr_id)
    this.loadingOne = true;
    this.calculationsService.getPathRequest(this.form.controls.forecastCorrespondence.value.var_id, rowData.corr_id).subscribe(
      res => {
          this.pathRequest = res,
          console.log('Ias',res)
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
    if(this.form.controls.forecastCorrespondence.valid){
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
        error => {
            this.modalService.open(error.error.message),
            this.downloadIasLoading = false
        },
        () => this.downloadIasLoading = false
      )
    }else{
      this.modalService.open('Укажите Маршрут')
    }
  }

  downTotalloadIas() {
    console.log('Id прогноза из ИАС Маршруты (основные): ', this.form.controls.forecastCorrespondence.value.var_id)
    console.log('Id прогноза из ИАС Маршруты (мелкие): ', this.form.controls.smallCorrespondence.value.var_id)
    console.log('Id сессии загрузки исторических данных: ', this.sessionId)
    if(this.form.valid){
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
        error => {
          this.modalService.open(error.error.message),
            this.downloadTotalIasLoading = false
        },
        () => this.downloadTotalIasLoading = false
      )
    }else{
      this.modalService.open('Заполните все поля!')
    }
  }

  downSmallloadIas() {
    // this.downloadSmallIasLoading = true;
    // this.uploadFileService.getDownload(this.form.controls.smallCorrespondence.value.var_id, 'IAS_ROUTES').subscribe(
    //   (response: HttpResponse<Blob>) => {
    //     console.log(response)
    //     let filename: string = 'total_ias_routes.xlsx'
    //     let binaryData = [];
    //     binaryData.push(response.body);
    //     let downloadLink = document.createElement('a');
    //     downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: 'blob'}));
    //     downloadLink.setAttribute('download', filename);
    //     document.body.appendChild(downloadLink);
    //     downloadLink.click();
    //   },
    //   error => this.modalService.open(error.error.message),
    //   () => this.downloadSmallIasLoading = false
    // )
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
      error => {
        this.modalService.open(error.error.message),
          this.downloadTotalSmallIasLoading = false
      },
      () => this.downloadTotalSmallIasLoading = false
    )
  }
}
