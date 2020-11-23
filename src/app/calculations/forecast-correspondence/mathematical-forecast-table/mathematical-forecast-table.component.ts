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
  @ViewChild('dt')  table: Table;

  loading: boolean;
  totalRecords: number;
  massSummYear: any[];
  summYears: 0;
  columsYears: number= 0;
  cols: any[];
  virtTable: any[];



  primeryBol = [ { label: 'Все', value: '' },{ label: 'Да', value: true },{ label: 'Нет', value: false }]
  selectedPrimery: any;
  constructor(
    private shipmentsService: ShipmentsService,
    private modalService: ModalService
  ) { }


  ngOnChanges() {
    this.totalRecords = this.mathematicalForecastTable.length;
    this.massSummYears(this.mathematicalForecastTable)
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
      { field: 'senderName', header: 'Грузополучатель', width: '100px', keyS: false },
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

  }

  onRowEditSave(item: any) {
    delete item.session
    console.log(JSON.stringify(item))
    // this.shipmentsService.putShipments(item).subscribe(
    //   res => (console.log('god')),
    //   error => this.modalService.open(error.error.message)
    // )
  }

  onRowEditCancel() {

  }


  test(idx: number, value: any) {
    const dec = value / this.massSummYear[idx];
    const resultMass = []
    for(let i=0; i< this.virtTable.length; i++){
      this.virtTable[i].shipmentYearValuePairs[idx].value = Number((this.virtTable[i].shipmentYearValuePairs[idx].value * dec).toFixed(2))
      console.log(typeof this.virtTable[i].shipmentYearValuePairs[idx].value)
      const res = this.virtTable[i];
      for(let a = 0; a < this.mathematicalForecastTable.length; a++){
        if(this.virtTable[i].id = this.mathematicalForecastTable[a].id){
          this.mathematicalForecastTable[a] = res;
          delete res.session
          console.log('res',res)
          console.log('this.mathematicalForecastTable[a]', this.mathematicalForecastTable[a])
          console.log(JSON.stringify(res))
        //  this.onRowEditSave(res)
          // console.log('1', this.mathematicalForecastTable[a].shipmentYearValuePairs[idx].value)
          // this.mathematicalForecastTable[a].shipmentYearValuePairs[idx].value = res
          // console.log('2', this.mathematicalForecastTable[a].shipmentYearValuePairs[idx].value)
          break;
        }
        break;
      }
      // const item = {idShip: this.virtTable[i].id, idYear: this.virtTable[i].shipmentYearValuePairs[idx].id, value: res}
      // resultMass.push(item)
    }
    console.log(resultMass)
  }

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
}
