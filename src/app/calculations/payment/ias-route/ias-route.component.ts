import {Component, Input, OnInit} from '@angular/core';
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

@Component({
  selector: 'app-ias-route',
  templateUrl: './ias-route.component.html',
  styleUrls: ['./ias-route.component.scss']
})
export class IasRouteComponent implements OnInit {

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

  constructor(
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
    if(this.forecastModelService.getTicketInformation().stepOne.Session !== null){
      this.headerYears = this.forecastModelService.ticketInformation.stepOne.Session['historicalYears'].split(',')
      if( this.headerYears.length !== 0 ){
        const maxItems = Math.max(...this.headerYears) + 1
        this.headerYears = []
        this.headerYears.push(maxItems)
        for(let i = 1; this.headerYears.length < 10; i++){
          this.headerYears.push(maxItems + i)
        }
      }
      if(this.headerYears.length > 10){
        this.headerYears = this.headerYears.slice(0, 10);
      }

    }else{
      this.headerYears = ['Прогнозный год - 1', 'Прогнозный год - 2', 'Прогнозный год - 3', 'Прогнозный год - 4','Прогнозный год - 5','Прогнозный год - 6','Прогнозный год - 7','Прогнозный год - 8','Прогнозный год - 9','Прогнозный год - 10']
    }
    console.log(this.headerYears)
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
  //  this.selectedPrimery = this.forecastModelService.ticketInformation.stepThree.primeryBolChange;
    this.selectedPrimery = this.primeryBolChange;
    this.columnS = [
      { field: 'orderNum', header: 'Порядковый номер', width: '100px', keyS: false},
      { field: 'len', header: 'Длинна', width: '100px', keyS: false},
      { field: 'stationName', header: 'Станция', width: '100px', keyS: false},
      { field: 'stationCode', header: 'Код станции', width: '100px', keyS: false},
      { field: 'stationNameGS', header: 'Станция (ГС)', width: '100px', keyS: false},
      { field: 'dorName', header: 'Дорога', width: '100px', keyS: false},
    ]
  }

  corresIiasForecast(){
    this.loadingOne = true;
    this.loadingTwo = true;
    this.loading = false;
    if(this.selectedPrimery === true){
      this.shipmentsService.putIasSaveId(
        this.sessionId,
        this.paymantIasService.getPaymentInformation().allCorrespondensRouteId === 0 ? 0 : this.paymantIasService.getPaymentInformation().allCorrespondensRouteId,
        this.form.controls.forecastCorrespondence.value.var_id,
        this.form.controls.smallCorrespondence.value !== '' ? this.form.controls.smallCorrespondence.value.var_id : 0,
      ).subscribe(
        res => console.log(res),
        error => this.modalService.open(error.error.message),
        () => {
          this.paymantIasService.settPaymentForecastCorrespondence(this.form.controls.forecastCorrespondence.value.var_id)
          this.paymantIasService.settPaymentSmallCorrespondence(this.form.controls.smallCorrespondence.value !== '' ? this.form.controls.smallCorrespondence.value.var_id : 0)
        }
      )
    }else if(this.selectedPrimery === false){
      this.shipmentsService.putIasSaveId(
        this.sessionId,
        this.form.controls.forecastCorrespondence.value !== '' ? this.form.controls.forecastCorrespondence.value.var_id : 0,
        this.paymantIasService.getPaymentInformation().forecastCorrespondence,
        this.paymantIasService.getPaymentInformation().smallCorrespondence
      ).subscribe(
        res => console.log(res),
        error => this.modalService.open(error.error.message),
        () => {
          this.paymantIasService.settPaymentAllCorrespondensRouteId(this.form.controls.forecastCorrespondence.value !== '' ? this.form.controls.forecastCorrespondence.value.var_id : 0)
        }
      )
    }
    this.calculationsService.getIasForecastId(this.form.controls.forecastCorrespondence.value.var_id).subscribe(
      res => {
        console.log(res)
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
        // console.log('oldMass', oldMass)
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
        // console.log('fin3', fin3)
        // console.log('resultse', resultse)
        resultse.push(fin3)

      }
      // else
      else if (i !== 0 && oldMass.includes(forecastIASModelId[i])) {
        continue
      } else {
        // console.log('oldMass2[i]', oldMass2)
        // console.log('forecastIASModelId[i]', forecastIASModelId[i])
        fin4 = []
        newMassiv = forecastIASModelId.filter(data => data.st1_u_name === forecastIASModelId[i].st1_u_name && data.st2_u_name === forecastIASModelId[i].st2_u_name && data.dor_name === forecastIASModelId[i].dor_name)
        newMassiv.sort((a, b) => a.year > b.year ? 1 : -1);
        // console.log('newMassiv', newMassiv)
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
        // console.log('fin4', fin4)
        // console.log('resultse', resultse)
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
    // console.log('2',this.yearsHohoho)
    // console.log(resultse)
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
        async (error) => {
          const message = JSON.parse(await error.error.text()).message;
          this.modalService.open(message)
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
        async (error) => {
          const message = JSON.parse(await error.error.text()).message;
          this.modalService.open(message)
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
      async (error) => {
        const message = JSON.parse(await error.error.text()).message;
        this.modalService.open(message)
          this.downloadTotalSmallIasLoading = false
      },
      () => this.downloadTotalSmallIasLoading = false
    )
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
    this.footerSumTwoTable(event.filteredValue)
  }


  exportRoutesExcel() {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.book_new();
      let Heading: any[] = [['Порядковый номер', 'Длинна' ,'Станция','Станция (ГС)','Код станции','Дорога']]
      xlsx.utils.sheet_add_aoa(worksheet, Heading);
      xlsx.utils.sheet_add_json(worksheet, this.pathRequest, {origin: 'A2', header: ['orderNum','len', 'stationName', 'stationNameGS', 'stationCode', 'dorName'], skipHeader: true});
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "products");
    });
  }
// тестирование
  exportRoutesExcelIas(id: number) {
    let resultIas = []
    this.calculationsService.getPathRequest(this.form.controls.forecastCorrespondence.value.var_id, id).subscribe(
      res => {
        resultIas = res
      },
      error => this.modalService.open(error.error.message),
      () => {
        import("xlsx").then(xlsx => {
          const worksheet = xlsx.utils.book_new();
          let Heading: any[] = [['Порядковый номер', 'Длинна' ,'Станция','Станция (ГС)','Код станции','Дорога']]
          xlsx.utils.sheet_add_aoa(worksheet, Heading);
          xlsx.utils.sheet_add_json(worksheet, resultIas, {origin: 'A2', header: ['orderNum','len', 'stationName', 'stationNameGS', 'stationCode', 'dorName'], skipHeader: true});
          const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
          const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
          this.saveAsExcelFile(excelBuffer, "products");
        });
      }
    )
  }
  saveAsExcelFile(buffer: any, fileName: string): void {
    import("file-saver").then(FileSaver => {
      let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      let EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
      });
      FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    });
  }

  exportTest() {
    console.log('resultTwoTable', this.resultTwoTable)
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.book_new();
      let Heading: any[] = [['Дорога', 'Начальная станция участка' ,'Единая сетевая разметка начальной станции','Конечная станция участка','Единая сетевая разметка конечной станции','км']]
      xlsx.utils.sheet_add_json(worksheet, this.resultTwoTable );
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "resultTwoTable");
    });
  }
}
