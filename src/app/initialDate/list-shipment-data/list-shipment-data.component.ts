import {Component, DoCheck, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild} from '@angular/core';
import {ShipmentsService} from "../../services/shipments.service";
import {ModalService} from "../../services/modal.service";
import {Table} from "primeng/table";

@Component({
  selector: 'app-list-chipment-data',
  templateUrl: './list-shipment-data.component.html',
  styleUrls: ['./list-shipment-data.component.scss']
})
export class ListShipmentDataComponent implements OnInit, OnChanges, DoCheck {
  @ViewChild('dt') table: Table;
  @Input() dialogVisible;
  @Input() mathematicalForecastTable;
  @Input() loading;
  @Output() change: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() changes: EventEmitter<boolean> = new EventEmitter<boolean>();

  columsYears: number= 0;
  primeryBol = [ { label: 'Все', value: '' },{ label: 'Да', value: true },{ label: 'Нет', value: false }]
  cols: any[];
  selectedPrimery: any;
  massSummYear: any[];
  totalRecords: number;
  summYears: 0;

  constructor(
    private shipmentsService: ShipmentsService,
    private modalService: ModalService
  ) { }
  ngDoCheck(){
    this.massSummYears(this.mathematicalForecastTable);
  }

  ngOnChanges() {
    this.totalRecords = this.mathematicalForecastTable.length;
  }

  ngOnInit(): void {
    if(this.mathematicalForecastTable[0].shipmentYearValuePairs.length > 0){this.columsYears = this.mathematicalForecastTable[0].shipmentYearValuePairs.length}
    this.loading = false
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
  }

  massSummYears($event: any) {
    console.log('massSummYears', $event)
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
      for (let i = 0; i <  this.mathematicalForecastTable[0].shipmentYearValuePairs.length ; i++){
        this.summYears = 0;
        for (let x = 0; x <  this.mathematicalForecastTable.length; x++){
          this.summYears +=  this.mathematicalForecastTable[x].shipmentYearValuePairs[i].value;
        }
        this.massSummYear.push(this.summYears);
      }
    }
  }

  onRowEditInit() {
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
    if(col['keyS'] === true){
      const mass = col['field'].toString().split('.');
      row.shipmentYearValuePairs[mass[1]].value = Number($event);
    }else{
      const item = col['field'];
      row[item] = $event
    }
  }

  columnFilter(event: any, field) {
    this.table.filter(event.target.value, field, 'contains');
  }

  colorYears(rowData, col: any) {
    const mass = col['field'].toString().split('.');
    return rowData.shipmentYearValuePairs[mass[1]].calculated === true ?  true :  false
  }
  closeModalTable(){
    this.change.emit(this.loading = false);
    this.changes.emit(this.dialogVisible = false);
  }
}
