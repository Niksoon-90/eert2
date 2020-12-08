import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {IAuthModel} from "../../models/auth.model";
import {AuthenticationService} from "../../services/authentication.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ForecastingModelService} from "../../services/forecasting-model.service";
import {
  ICorrespondencesIiasForecast,
  IForecastIASModel,
  IForecastIASModelId,
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
  correspondencesIiasForecastsTwo: ICorrespondencesIiasForecast[]
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
  headerYears: number[]
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
    console.log('correspondencesIiasForecast', this.correspondencesIiasForecast)
    this.headerYears = this.forecastModelService.ticketInformation.stepOne.Session['year']
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
    // this.cols = [
    //   { field: 'cargo_group', header: 'Группа груза', width: '100px', keyS: false},
    //   { field: 'from_station', header: 'Станция отправления РФ', width: '100px', keyS: false },
    //   { field: 'from_station_code', header: 'Код станции отправления РФ', width: '100px', keyS: false },
    //   { field: 'to_station', header: 'Станция назначения РФ', width: '100px', keyS: false },
    //   { field: 'to_station_code', header: 'Код станции назначения РФ', width: '100px', keyS: false },
    //   { field: 'n1', header: 'Год 1', width: '100px', keyS: false },
    //   { field: 'n2', header: 'Год 2', width: '100px', keyS: false },
    //   { field: 'n3', header: 'Год 3', width: '100px', keyS: false },
    //   { field: 'n4', header: 'Год 4', width: '100px', keyS: false },
    //   { field: 'n5', header: 'Год 5', width: '100px', keyS: false },
    //   { field: 'n6', header: 'Год 6', width: '100px', keyS: false },
    //   { field: 'n7', header: 'Год 7', width: '100px', keyS: false },
    //   { field: 'n8', header: 'Год 8', width: '100px', keyS: false },
    //   { field: 'n9', header: 'Год 9', width: '100px', keyS: false },
    //   { field: 'n10', header: 'Год 10', width: '100px', keyS: false }
    // ];
    this.columnF = [
      { field: 'dor_name', header: 'Дорога', width: '100px', keyS: false},
      { field: 'st1_name', header: 'st1_name', width: '100px', keyS: false},
      { field: 'st1_p', header: 'st1_p', width: '100px', keyS: false},
      { field: 'st2_name', header: 'st2_name', width: '100px', keyS: false},
      { field: 'st2_p', header: 'st2_p', width: '100px', keyS: false},
      { field: 'len', header: 'Длинна', width: '100px', keyS: false},
      { field: 'ntuda', header: 'ntuda', width: '100px', keyS: false},
      { field: 'nobratno', header: 'nobratno', width: '100px', keyS: false},
      { field: 'p_name', header: 'p_name', width: '100px', keyS: false},
      { field: 'year', header: 'year', width: '100px', keyS: false}
    ]
    this.columnS = [
      { field: 'num', header: 'Порядковый номер', width: '100px', keyS: false},
      { field: 'len', header: 'Длина', width: '100px', keyS: false},
      { field: 'st_name', header: 'Наименование станции', width: '100px', keyS: false},
      { field: 'st', header: 'Код станции', width: '100px', keyS: false}
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
        () => this.loadingTwo = false
      )

  }
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

  nextPage() {
    this.router.navigate(['steps/export'])
  }


  searchInIAS(rowData) {
    console.log('iasForecastId', this.form.controls.forecastCorrespondence.value.var_id)
    console.log('iasCorrespondenceId', rowData.corr_id)
    this.loadingOne = true;
    this.loadingTwo = true;
    this.calculationsService.getPathRequest(this.form.controls.forecastCorrespondence.value.var_id, rowData.corr_id).subscribe(
      res => {
          this.pathRequest = res,
          console.log('Ias',res)
      },
      error => this.modalService.open(error.error.message),
      () => {
        this.loadingOne = false;
        this.loadingTwo = false;
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
        error => this.modalService.open(error.error.message),
        () => this.downloadIasLoading = false
      )
    }else{
      this.modalService.open('Укажите Маршрут')
    }
  }
}
