import { Component, Input, OnChanges, OnInit,  ViewChild} from '@angular/core';
import {Table} from 'primeng/table';
import {ShipmentsService} from "../../../services/shipments.service";
import {ModalService} from "../../../services/modal.service";



@Component({
  selector: 'app-mathematical-forecast-table',
  templateUrl: './mathematical-forecast-table.component.html',
  styleUrls: ['./mathematical-forecast-table.component.scss']
})
export class MathematicalForecastTableComponent implements OnInit, OnChanges {
  @Input() mathematicalForecastTable;
  @Input() correspondence;
  @ViewChild('dt')  table: Table;

  loading: boolean;
  totalRecords: number;
  massSummYear: any[];
  summYears: 0;
  columsYears: number= 0;
  cols: any[];
  virtTable: any[];
  constructor(
    private shipmentsService: ShipmentsService,
    private modalService: ModalService
  ) { }


  ngOnChanges() {
    this.totalRecords = this.mathematicalForecastTable.length;
    if(this.correspondence.key === true){
      this.mathematicalForecastTable = this.mathematicalForecastTable.filter(data => data.primary === true )
    }
  }
  ngOnInit(): void {
    this.columsYears = this.mathematicalForecastTable[0].shipmentYearValuePairs.length
    this.cols = [
      { field: 'cargoGroup', header: 'Группа груза', width: '100px', keyS: false},
      { field: 'shipmentType', header: 'Вид перевозки', width: '100px', keyS: false },
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
    this.massSummYears(this.mathematicalForecastTable)
  }

  columnFilter(event: any, field) {
    this.table.filter(event.target.value, field, 'contains');
  }

  massSummYears($event: any) {
    this.virtTable = $event.filteredValue;
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
      this.virtTable = this.mathematicalForecastTable;
      if(this.columsYears > 0){
        for (let i = 0; i <  this.mathematicalForecastTable[0].shipmentYearValuePairs.length ; i++){
          this.summYears = 0;
          for (let x = 0; x <  this.mathematicalForecastTable.length; x++){
            this.summYears +=  this.mathematicalForecastTable[x].shipmentYearValuePairs[i].value;
          }
          this.massSummYear.push(this.summYears);
        }
      }
      this.loading = false;
    }
  }

  onRowEditInit(item: any) {
    //console.log(item)
  }

  onRowEditSave(item: any) {
    delete item.session
    this.shipmentsService.putShipments(item).subscribe(
      res => (console.log('god')),
      error => this.modalService.open(error.error.message)
    )
  }

  onRowEditCancel(item: any, ri) {

  }

  magic(row: any, col: any, $event: any) {
    if(col['keyS'] === true){
      const mass = col['field'].toString().split('.');
      row.shipmentYearValuePairs[mass[1]].value = Number($event);
    }else{
      const item = col['field'];
      row[item] = $event
    }
  }

  test(idx: number, value: any) {
    console.log(this.virtTable)
    console.log(idx)
    console.log(value)
    const dec = value / this.massSummYear[idx];
    const resultMass = []
    for(let i=0; i< this.virtTable.length; i++){
     const res =  this.virtTable[i].shipmentYearValuePairs[idx].value * dec;
     const item = {idShip: this.virtTable[i].id, idYear: this.virtTable[i].shipmentYearValuePairs[idx].id, value: res}
      resultMass.push(item)
    }
    console.log(resultMass)
  }
}
