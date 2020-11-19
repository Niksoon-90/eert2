import {Component, OnChanges, OnInit, ViewChild} from '@angular/core';
import {ShipmentsService} from "../../../services/shipments.service";
import {ISession, IShipment} from "../../../models/shipmenst.model";
import {Table} from "primeng/table";
import {ModalService} from "../../../services/modal.service";


@Component({
  selector: 'app-data-shipments',
  templateUrl: './data-shipments.component.html',
  styleUrls: ['./data-shipments.component.scss']
})
export class DataShipmentsComponent implements OnInit, OnChanges {
  @ViewChild('dt') table: Table;

  shipmentsSession: ISession[];
  customers: any[];
  mathematicalForecastTable: IShipment[];
  loading: boolean = true;
  totalRecords: number;
  first = 0;
  rows = 25;
  dialogVisible: boolean;
  massSummYear: any[];
  summYears: 0;
  columsYears: number= 0;
  primeryBol = [ { label: 'Все', value: '' },{ label: 'Да', value: true },{ label: 'Нет', value: false }]
  cols: any[];
  selectedPrimery: any;


  constructor(
    private shipmentsService: ShipmentsService,
    private modalService: ModalService
  ) { }

  ngOnChanges() {
    this.totalRecords = this.mathematicalForecastTable.length;
  }

  ngOnInit(): void {

    this.getShipmentsSession();
  }

  next() {
    this.first = this.first + this.rows;
  }

  prev() {
    this.first = this.first - this.rows;
  }

  reset() {
    this.first = 0;
    this.getShipmentsSession();
  }

  isLastPage(): boolean {
    return this.customers ? this.first === (this.customers.length - this.rows): true;
  }

  isFirstPage(): boolean {
    return this.customers ? this.first === 0 : true;
  }

  getShipmentsSession() {
    this.loading = true
    this.shipmentsService.getShipSession().subscribe(
      res => {this.shipmentsSession = res; console.log(res)},
      error => this.modalService.open(error.error.message),
      () => this.loading = false,
    )
  }

  removeShipSession(id: number) {
    this.shipmentsService.deleteShipSession(id).subscribe(
      () =>  this.getShipmentsSession(),
      error => this.modalService.open(error.error.message),
      () => console.log('HTTP request completed.')
    )
  }

  openShipItemSession(id: number) {
    this.loading = true
    this.shipmentsService.getShipments(id).subscribe(
      res => this.mathematicalForecastTable = res,
      error => {
        this.modalService.open(error.error.message);
        this.loading = false;
        },
      () => {
        this.createTable();
      }
    )
  }
  columnFilter(event: any, field) {
    this.table.filter(event.target.value, field, 'contains');
  }
  createTable(){
    if(this.mathematicalForecastTable[0].shipmentYearValuePairs.length > 0){this.columsYears = this.mathematicalForecastTable[0].shipmentYearValuePairs.length}
    this.massSummYears(this.mathematicalForecastTable)
    this.cols = [
      { field: 'cargoGroup', header: 'Группа груза', width: '100px', keyS: false},
      { field: 'shipmentType', header: 'Вид перевозки', width: '100px', keyS: false },
      { field: 'primary', header: 'Корреспонденции', width: '100px', keyS: false },
      { field: 'fromRoad', header: 'Дорога отправления', width: '100px', keyS: false },
      { field: 'fromStation', header: 'Станция отправления РФ', width: '100px', keyS: false },
      { field: 'fromStationCode', header: 'Код станции отправления РФ', width: '100px', keyS: false },
      { field: 'fromSubject', header: 'Субъект отправления', width: '100px', keyS: false },
      { field: 'receiverName', header: 'Грузоотправитель', width: '100px', keyS: false },
      { field: 'toRoad', header: 'Дорога назначения', width: '100px', keyS: false },
      { field: 'toStation', header: 'Станция назначения РФ', width: '100px', keyS: false },
      { field: 'toStationCode', header: 'Код станции назначения РФ', width: '100px', keyS: false },
      { field: 'toSubject', header: 'Субъект назначения', width: '100px', keyS: false },
      { field: 'senderName', header: 'Грузополучатель', width: '100px', keyS: false }
    ];
    for(let i=0; i< this.columsYears ; i++){
      this.cols.push({ field: `shipmentYearValuePairs.${i}.value`, header: this.mathematicalForecastTable[0].shipmentYearValuePairs[i].year, width: '100px',keyS: true })
    }
    this.loading = false;
    this.showDialog();
  }


  massSummYears($event: any) {
    console.log('massSummYears', $event)
    this.loading = true;
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
      this.loading = false;
    }else{
      for (let i = 0; i <  this.mathematicalForecastTable[0].shipmentYearValuePairs.length ; i++){
        this.summYears = 0;
        for (let x = 0; x <  this.mathematicalForecastTable.length; x++){
          this.summYears +=  this.mathematicalForecastTable[x].shipmentYearValuePairs[i].value;
        }
        this.massSummYear.push(this.summYears);
      }
      this.loading = false;
    }
  }

  onRowEditInit(item: any) {
  }

  onRowEditSave(item: any) {
    delete item.session
    console.log(JSON.stringify(item))
    this.shipmentsService.putShipments(item).subscribe(
      res => (console.log('god')),
      error => this.modalService.open(error.error.message)
    )
  }

  onRowEditCancel() {
  }

  editColumn(row: any, col: any, $event: any) {
    console.log(col)
    console.log('row', row)
    if(col['keyS'] === true){
      const mass = col['field'].toString().split('.');
      row.shipmentYearValuePairs[mass[1]].value = Number($event);
    }else{
      const item = col['field'];
      row[item] = $event
    }
  }

  showDialog() {
      this.dialogVisible = true;
    }

  colorYears(rowData, col: any) {
    const mass = col['field'].toString().split('.');
    return rowData.shipmentYearValuePairs[mass[1]].calculated === true ?  true :  false
  }
}
