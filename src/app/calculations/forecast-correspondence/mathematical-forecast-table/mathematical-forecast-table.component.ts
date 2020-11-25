import {
  Component, EventEmitter,
  Input,
  OnChanges,
  OnInit, Output,
  ViewChild
} from '@angular/core';
import {Table} from 'primeng/table';
import {ShipmentsService} from "../../../services/shipments.service";
import {ModalService} from "../../../services/modal.service";
import {ICalculatingPredictiveRegression} from "../../../models/calculations.model";



@Component({
  selector: 'app-mathematical-forecast-table',
  templateUrl: './mathematical-forecast-table.component.html',
  styleUrls: ['./mathematical-forecast-table.component.scss']
})
export class MathematicalForecastTableComponent implements OnInit, OnChanges {
  @ViewChild('dt')  table: Table;
  @Input() mathematicalForecastTable;
  @Output() resetTable: EventEmitter<ICalculatingPredictiveRegression[]> = new EventEmitter<ICalculatingPredictiveRegression[]>();

  loading: boolean;
  totalRecords: number;
  massSummYear: any[];
  summYears: 0;
  columsYears: number= 0;
  cols: any[];
  virtTable: any[];



  primeryBol = [ { label: 'Все', value: '' },{ label: 'Да', value: true },{ label: 'Нет', value: false }]
  selectedPrimery: any;
  virtTable2: any;




  constructor(
    private shipmentsService: ShipmentsService,
    private modalService: ModalService
  ) { }


  ngOnChanges() {
    this.totalRecords = this.mathematicalForecastTable.length;
  }
  ngOnInit(): void {
    this.columsYears = this.mathematicalForecastTable[0].shipmentYearValuePairs.length
    this.massSummYears(this.mathematicalForecastTable)
    this.cols = [
      { field: 'cargoGroup', header: 'Группа груза', width: '100px', keyS: false},
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
  console.log('item', item)
  }

  onRowEditSave(item: any) {
    delete item.session
    this.shipmentsService.putShipments(item).subscribe(
      res => (console.log('god')),
      error => this.modalService.open(error.error.message),
      () => this.massSummYears(this.virtTable2)
    )
  }

  onRowEditCancel() {
  }
  out(){

  }

  test(idx: number, value: any) {
    const dec = value / this.massSummYear[idx];
    for(let i=0; i< this.virtTable.length; i++){
      this.virtTable[i].shipmentYearValuePairs[idx].value = Number((this.virtTable[i].shipmentYearValuePairs[idx].value * dec).toFixed(2))
      const res = this.virtTable[i];
      for(let a = 0; a < this.mathematicalForecastTable.length; a++){
        if(this.virtTable[i].id = this.mathematicalForecastTable[a].id){
          this.massSummYears(this.virtTable2)
        //  this.table.initRowEdit(this.mathematicalForecastTable[a]);
        //  this.onRowEditSave(this.mathematicalForecastTable[a])
          // this.table.onEditComplete.emit(this.mathematicalForecastTable[a]);
          break;
        }
        break;
      }
    }
    console.log('this.mathematicalForecastTable1', this.mathematicalForecastTable)
    this.resetTable.emit(this.mathematicalForecastTable);
    // this.mathematicalForecastTable = [];
    // console.log('this.mathematicalForecastTable2', this.mathematicalForecastTable)
    // this.mathematicalForecastTable = this.virtTable;
    // console.log('this.mathematicalForecastTable3', this.mathematicalForecastTable)
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
//this.table.cancelRowEdit(this.mathematicalForecastTable[a])
// this.shipmentsService.getTest(res.id, res.shipmentYearValuePairs).subscribe(
//   res => {this.mathematicalForecastTable[a].shipmentYearValuePairs = res
//     console.log('res2', this.mathematicalForecastTable[a].shipmentYearValuePairs)
//   },
//   error => this.modalService.open(error.error.message),
//   () => {
//
//   }
// )
//this.onRowEditInit(this.mathematicalForecastTable[a]);
// this.onRowEditSave(this.mathematicalForecastTable[a]);
// this.onRowEditCancel()
