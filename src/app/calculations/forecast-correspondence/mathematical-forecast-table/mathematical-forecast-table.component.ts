import {
  Component,
  Input,
  OnChanges,
  OnInit,
  ViewChild
} from '@angular/core';
import {Table} from 'primeng/table';
import {ShipmentsService} from "../../../services/shipments.service";
import {ModalService} from "../../../services/modal.service";
import {ForecastingModelService} from "../../../services/forecasting-model.service";
import {AuthenticationService} from "../../../services/authentication.service";
import {IAuthModel} from "../../../models/auth.model";
import {HttpResponse} from "@angular/common/http";
import {UploadFileService} from "../../../services/upload-file.service";
import {from} from "rxjs";
import {concatMap, mergeMap} from "rxjs/operators";



@Component({
  selector: 'app-mathematical-forecast-table',
  templateUrl: './mathematical-forecast-table.component.html',
  styleUrls: ['./mathematical-forecast-table.component.scss']
})
export class MathematicalForecastTableComponent implements OnInit, OnChanges {
  @ViewChild('dt')  table: Table;
  @Input() mathematicalForecastTable;


  loading: boolean;
  totalRecords: number;
  massSummYear: any[];
  summYears: 0;
  columsYears: number= 0;
  cols: any[];
  virtTable: any[];
  user: IAuthModel;
  loader: boolean = false
  downloadShipLoading: boolean = false
  downloadRoadLoading: boolean = false
  primeryBol = [ { label: 'Все', value: '' },{ label: 'Да', value: true },{ label: 'Нет', value: false }]
  selectedPrimery: any;
  virtTable2: any;
  sessionId: number
  primary2 = [ { label: 'Да', value: true },{ label: 'Нет', value: false }]

  constructor(
    private shipmentsService: ShipmentsService,
    private modalService: ModalService,
    private forecastingModelService: ForecastingModelService,
    private authenticationService: AuthenticationService,
    private uploadFileService: UploadFileService,
    public forecastModelService: ForecastingModelService,
  ) {
    this.user = this.authenticationService.userValue;
  }

  ngOnChanges() {
    this.totalRecords = this.mathematicalForecastTable.length;
  }
  ngOnInit(): void {
    if(this.forecastModelService.getTicketInformation().stepOne.Session !== null){
      this.sessionId = this.forecastModelService.getTicketInformation().stepOne.Session['id']
    }else{
      this.sessionId = this.forecastModelService.getTicketInformation().stepThree.sessionId;
    }

    this.columsYears = this.mathematicalForecastTable[0].shipmentYearValuePairs.length
    this.massSummYears(this.mathematicalForecastTable)
    this.cols = [
      { field: 'cargoGroup', header: 'Группа груза', width: '100px', keyS: false},
      { field: 'cargoSubGroup', header: 'Подгруппа груза', width: '100px', keyS: false },
      { field: 'shipmentType', header: 'Вид перевозки', width: '100px', keyS: false },
      { field: 'fromRoad', header: 'Дорога отправления', width: '100px', keyS: false },
      { field: 'fromStation', header: 'Станция отправления РФ', width: '100px', keyS: false },
      { field: 'fromStationCode', header: 'Код станции отправления РФ', width: '100px', keyS: false },
      { field: 'fromSubject', header: 'Субъект отправления', width: '100px', keyS: false },
      { field: 'senderName', header: 'Грузоотправитель', width: '100px', keyS: false },
      { field: 'toRoad', header: 'Дорога назначения', width: '100px', keyS: false },
      { field: 'toStation', header: 'Станция назначения РФ', width: '100px', keyS: false },
      { field: 'toStationCode', header: 'Код станции назначения РФ', width: '100px', keyS: false },
      { field: 'toSubject', header: 'Субъект назначения', width: '100px', keyS: false },
      { field: 'receiverName', header: 'Грузополучатель', width: '100px', keyS: false },
      { field: 'primary', header: 'Уст.', width: '80px', keyS: false },
    ];
    for(let i=0; i< this.columsYears ; i++){
      this.cols.push({ field: `shipmentYearValuePairs.${i}.value`, header: this.mathematicalForecastTable[0].shipmentYearValuePairs[i].year, width: '100px',keyS: true })
    }
  }

  columnFilter(event: any, field) {
    this.table.filter(event.target.value, field, 'contains');
  }

  massSummYears($event: any) {
    this.virtTable2 = $event;               //исходное значение
    this.virtTable = $event.filteredValue; //фильтр
    this.massSummYear = [ ]
    if($event['filteredValue'] !== undefined){
      if($event.filteredValue.length > 0){
        for (let i = 0; i < $event.filteredValue[0].shipmentYearValuePairs.length ; i++){
          this.summYears = 0;
          for (let x = 0; x < $event.filteredValue.length; x++){
            this.summYears += $event.filteredValue[x].shipmentYearValuePairs[i].value;
          }
          this.massSummYear.push(this.summYears);
        }
      }
    }else{
      this.virtTable = [...this.mathematicalForecastTable];
      if(this.columsYears > 0){
        for (let i = 0; i <  this.mathematicalForecastTable[0].shipmentYearValuePairs.length ; i++){
          this.summYears = 0;
          for (let x = 0; x <  this.mathematicalForecastTable.length; x++){
            this.summYears +=  this.mathematicalForecastTable[x].shipmentYearValuePairs[i].value;
          }
          this.massSummYear.push(this.summYears);
        }
      }
    }
  }

  onRowEditInit(item: any) {
  console.log('item', item)
  }

  onRowEditSave(item: any) {
    delete item.session
    this.shipmentsService.putShipments(item).subscribe(
      res => (console.log('god')),
      error => this.modalService.open(error.error.message),
      () => this.massSummYears(this.mathematicalForecastTable)
    )
  }

  onRowEditCancel() {
  }


  test(idx: number, value: any) {

    const saveMass = []
    const dec = Number(value / this.massSummYear[idx]).toFixed(3);
    for(let i=0; i< this.virtTable.length; i++) {
      this.virtTable[i].shipmentYearValuePairs[idx].value = Number((this.virtTable[i].shipmentYearValuePairs[idx].value * Number(dec)).toFixed(3))
      console.log(Number((this.virtTable[i].shipmentYearValuePairs[idx].value * Number(dec)).toFixed(2)))
      delete this.virtTable[i].session;
      saveMass.push(this.virtTable[i])
    }
    // for(let i=0; i< this.mathematicalForecastTable.length; i++) {
    //   this.mathematicalForecastTable[i].shipmentYearValuePairs[idx].value = Number((this.mathematicalForecastTable[i].shipmentYearValuePairs[idx].value * dec).toFixed(2))
    //   delete this.mathematicalForecastTable[i].session;
    //   saveMass.push(this.mathematicalForecastTable[i])
    // //  this.onRowEditSave(this.mathematicalForecastTable[i])
    // }

    if(saveMass.length !== 0){
      this.loader = true;
      from(saveMass).pipe(
        concatMap(param => this.shipmentsService.putShipments(param)) //concatMap
      ).subscribe(
        res =>   this.massSummYears(this.mathematicalForecastTable),
        error => {
          this.modalService.open(error.error.message),
            this.loader = false;
        },
        () => {
          this.massSummYears(this.mathematicalForecastTable),
            this.loader = true;
          setTimeout(()=>{
            this.loader = false;
          }, 10);
        }
      );
    }
  }
  //   const dec = value / this.massSummYear[idx];
  //   for(let i=0; i< this.mathematicalForecastTable.length; i++) {
  //     this.mathematicalForecastTable[i].shipmentYearValuePairs[idx].value = Number((this.mathematicalForecastTable[i].shipmentYearValuePairs[idx].value * dec).toFixed(2))
  //     console.log(this.mathematicalForecastTable[i])
  //     this.onRowEditSave(this.mathematicalForecastTable[i])
  //   }
  //   this.loader = true;
  //   setTimeout(()=>{
  //     this.loader = false;
  //   }, 2000);
  // }

  colorYears(rowData, col: any) {
    const mass = col['field'].toString().split('.');
    return rowData.shipmentYearValuePairs[mass[1]].calculated === true ?  true :  false
  }

  editColumn(row: any, col: any, $event: any) {
    if(col['keyS'] === true){
      const mass = col['field'].toString().split('.');
      row.shipmentYearValuePairs[mass[1]].value = Number($event);
    }else{
      const item = col['field'];
      row[item] = $event
    }
  }

  test2(item: any, idx: number) {
    return this.mathematicalForecastTable[0].shipmentYearValuePairs[idx].calculated === true ? true : false
  }

  primeryBolChange(value: any, field: any, equals: string) {
    this.table.filter(value, field, equals)
    this.forecastingModelService.ticketInformation.stepThree.primeryBolChange = this.selectedPrimery
  }

  downloadShip() {
    this.downloadShipLoading = true;
    this.uploadFileService.getDownload(this.sessionId, 'SHIPMENTS').subscribe(
      (response: HttpResponse<Blob>) => {
        console.log(response)
        let filename: string = 'shipments.xlsx'
        let binaryData = [];
        binaryData.push(response.body);
        let downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: 'blob' }));
        downloadLink.setAttribute('download', filename);
        document.body.appendChild(downloadLink);
        downloadLink.click();
      },
      error => {
        this.modalService.open(error.error.message),
          this.downloadShipLoading = false
      },
      () => this.downloadShipLoading = false
    )
  }
  downloadRoad() {
    this.downloadRoadLoading = true;
    this.uploadFileService.getDownload(this.sessionId, 'ROAD_TO_ROAD').subscribe(
      (response: HttpResponse<Blob>) => {
        console.log(response)
        let filename: string = 'road_to_road.xlsx'
        let binaryData = [];
        binaryData.push(response.body);
        let downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: 'blob' }));
        downloadLink.setAttribute('download', filename);
        document.body.appendChild(downloadLink);
        downloadLink.click();
      },
      error => {
        this.modalService.open(error.error.message),
          this.downloadRoadLoading = false
      },
      () =>  this.downloadRoadLoading = false
    )
  }
}
