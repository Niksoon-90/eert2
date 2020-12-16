import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {IAuthModel} from "../../models/auth.model";
import {AuthenticationService} from "../../services/authentication.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ForecastingModelService} from "../../services/forecasting-model.service";
import {
  ICorrespondencesIiasForecast,
  IForecastIASModel,
  IForecastIASModelId, IForecastIASModelIdResult,
  IPathRequest
} from "../../models/forecastIAS.model";
import {CalculationsService} from "../../services/calculations.service";
import {ModalService} from "../../services/modal.service";
import {HttpResponse} from "@angular/common/http";
import {UploadFileService} from "../../services/upload-file.service";

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
  headerYears: number[]
  resultTwoTable: any[] = []
  pathRequestItem: IForecastIASModelIdResult
  yearsHeaderTwoTable = []

  constructor(
    private router: Router,
    public authenticationService: AuthenticationService,
    private forecastModelService: ForecastingModelService,
    private calculationsService: CalculationsService,
    private modalService: ModalService,
    private uploadFileService: UploadFileService,
  ) {
    this.user = this.authenticationService.userValue;
  }

  ngOnInit(): void {
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
      this.calculationsService.getIasForecastId(this.form.controls.forecastCorrespondence.value.var_id).subscribe(
        res => {
          this.correspondencesIiasForecast = res
        },
        error => this.modalService.open(error.error.message),
        () => this.loadingOne = false
      )
      this.calculationsService.getForcastIasId(this.form.controls.forecastCorrespondence.value.var_id).subscribe(
        res => this.forecastIASModelId = res,
        error => this.modalService.open(error.error.message),
        () => {
          this.headerYearsTable(this.forecastIASModelId)
        }
      )
  }


  headerYearsTable(forecastIASModelId: IForecastIASModelId[]){
    this.yearsHeaderTwoTable = []
    let numbers = 0
    this.resultTwoTable = []
    this.columnF = [
      { field: 'dor_name', header: 'Дорога', width: '100px', keyS: false},
      { field: 'st1_u_name', header: 'Начальная станция участка', width: '100px', keyS: false},
      { field: 'st1_u', header: 'Единая сетевая разметка начальной станции', width: '100px', keyS: false},
      { field: 'st2_u_name', header: 'Конечная станция участка', width: '100px', keyS: false},
      { field: 'st2_u', header: 'Единая сетевая разметка конечной станции', width: '100px', keyS: false},
      { field: 'len', header: 'км', width: '100px', keyS: false},
    ]
    for(let i = 0; i<forecastIASModelId.length; i++){
      if(i === 0){
        this.yearsHeaderTwoTable.push(forecastIASModelId[i].year)
      }
      if(i !== 0  && forecastIASModelId[i].dor_name === forecastIASModelId[0].dor_name && forecastIASModelId[i].st1_u_name === forecastIASModelId[0].st1_u_name && forecastIASModelId[i].st2_u_name === forecastIASModelId[0].st2_u_name && forecastIASModelId[i].len === forecastIASModelId[0].len){
        this.yearsHeaderTwoTable.push(forecastIASModelId[i].year)
      }
    }

    for(let i = 0; i<forecastIASModelId.length; i++){
      if(i === 0){
        this.pathRequestItem = {
          dor_name: forecastIASModelId[i].dor_name,
          st1_u_name: forecastIASModelId[i].st1_u_name,
          st1_u: forecastIASModelId[i].st1_u,
          st2_u_name: forecastIASModelId[i].st2_u_name,
          st2_u: forecastIASModelId[i].st2_u,
          len: forecastIASModelId[i].len,
          ntuda: [
            {ntuda: forecastIASModelId[i].ntuda === null ? 0 :forecastIASModelId[i].ntuda, year: forecastIASModelId[i].year}
          ],
          nobratno:  [
            {nobratno: forecastIASModelId[i].nobratno === null ? 0 : forecastIASModelId[i].nobratno, year: forecastIASModelId[i].year}
          ]
        }
      }
      else if(i !== 0  && forecastIASModelId[i].dor_name === forecastIASModelId[numbers].dor_name && forecastIASModelId[i].st1_u_name === forecastIASModelId[numbers].st1_u_name && forecastIASModelId[i].st2_u_name === forecastIASModelId[numbers].st2_u_name && forecastIASModelId[i].len === forecastIASModelId[numbers].len){
        this.pathRequestItem.ntuda.push({ntuda: forecastIASModelId[i].ntuda === null ? 0 :forecastIASModelId[i].ntuda, year: forecastIASModelId[i].year})
        this.pathRequestItem.nobratno.push({nobratno: forecastIASModelId[i].nobratno === null ? 0 : forecastIASModelId[i].nobratno, year: forecastIASModelId[i].year})
      }else{
        if(this.pathRequestItem.ntuda.length < this.yearsHeaderTwoTable.length) {
          for (let i = this.pathRequestItem.ntuda.length; i < this.yearsHeaderTwoTable.length; i++) {
            console.log(this.pathRequestItem.ntuda.length)
            this.pathRequestItem.ntuda.push({ntuda: 0, year: forecastIASModelId[i].year})
          }
        }
          if(this.pathRequestItem.nobratno.length < this.yearsHeaderTwoTable.length){
            for(let i = this.pathRequestItem.nobratno.length; i < this.yearsHeaderTwoTable.length; i++){
              console.log(this.pathRequestItem.nobratno.length)
              this.pathRequestItem.nobratno.push({nobratno: 0, year: forecastIASModelId[i].year})
            }
        }
        this.resultTwoTable.push(this.pathRequestItem)
        numbers = i;
        this.pathRequestItem = {
          dor_name: forecastIASModelId[i].dor_name,
          st1_u_name: forecastIASModelId[i].st1_u_name,
          st1_u: forecastIASModelId[i].st1_u,
          st2_u_name: forecastIASModelId[i].st2_u_name,
          st2_u: forecastIASModelId[i].st2_u,
          len: forecastIASModelId[i].len,
          ntuda: [
            {ntuda: forecastIASModelId[i].ntuda === null ? 0 :forecastIASModelId[i].ntuda, year: forecastIASModelId[i].year}
          ],
          nobratno:  [
            {nobratno: forecastIASModelId[i].nobratno === null ? 0 : forecastIASModelId[i].nobratno, year: forecastIASModelId[i].year}
          ]
        }
      }
    }
    for(let i=0; i< this.yearsHeaderTwoTable.length ; i++){
      this.columnF.push({field: `ntuda.${i}.ntuda`, header: this.resultTwoTable[0].ntuda[i].year, width: '100px', keyS: false})
    }
    for(let i=0; i< this.yearsHeaderTwoTable.length ; i++){
      this.columnF.push({field: `nobratno.${i}.nobratno`, header: this.resultTwoTable[0].nobratno[i].year, width: '100px', keyS: false})
    }
    console.log('RESULTAT2!', this.resultTwoTable)
    this.loadingTwo = false
  };



  createForm() {
    this.sessionId = this.forecastModelService.getTicketInformation().stepOne.Session['id']
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

  // nextPage() {
  //   this.router.navigate(['steps/export'])
  // }

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
