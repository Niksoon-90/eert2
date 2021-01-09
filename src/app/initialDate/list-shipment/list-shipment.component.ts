import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {AuthenticationService} from "../../services/authentication.service";
import {ModalService} from "../../services/modal.service";
import {ShipmentsService} from "../../services/shipments.service";
import {IShipment} from "../../models/shipmenst.model";
import {IAuthModel} from "../../models/auth.model";
import {LazyLoadEvent} from "primeng/api";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-list-shipment',
  templateUrl: './list-shipment.component.html',
  styleUrls: ['./list-shipment.component.scss']
})
export class ListShipmentComponent implements OnInit, OnDestroy {

  @Input() mathematicalForecastTable;

  @Input() dialogVisible;

  @Input() loading;

  @Input() sessionId;

  @Output() change: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output() changes: EventEmitter<boolean> = new EventEmitter<boolean>();

  mathematicalForecastContent: IShipment[]
  totalRecords: number
  cols: any[];
  columsYears: number= 0;
  sub: Subscription
  loadingTable: boolean

  primary2 = [ { label: 'Да', value: true },{ label: 'Нет', value: false }]
  displayModal: boolean = false
  user: IAuthModel

  constructor(
    private modalService: ModalService,
    private shipmentsService: ShipmentsService,
    private authenticationService: AuthenticationService,
  ) {
    this.user = this.authenticationService.userValue;
  }

  ngOnInit(): void {
    this.mathematicalForecastContent = this.mathematicalForecastTable.content;
    this.totalRecords = this.mathematicalForecastTable.totalElements
    this.createColumnTable();
  }
  createColumnTable(){
    if(this.mathematicalForecastContent[0].shipmentYearValuePairs.length > 0){this.columsYears = this.mathematicalForecastContent[0].shipmentYearValuePairs.length}
    this.cols = [
      { field: 'id', header: 'id', width: '100px', keyS: false, isStatic :true},
      { field: 'cargoGroup', header: 'Группа груза', width: '100px', keyS: false, isStatic :true},
      { field: 'cargoSubGroup', header: 'Подгруппа груза', width: '100px', keyS: false },
      { field: 'shipmentType', header: 'Вид перевозки', width: '100px', keyS: false },
      { field: 'primary', header: 'Корреспонденции', width: '100px', keyS: false },
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

    ];
    for(let i=0; i< this.columsYears ; i++){
      this.cols.push({ field: `shipmentYearValuePairs.${i}.value`, header: this.mathematicalForecastContent[0].shipmentYearValuePairs[i].year, width: '100px',keyS: true })
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe()
  }

  showModalDialog() {
    this.displayModal = true;
  }

  closeModalTable(){
    this.change.emit(this.loading = false);
    this.changes.emit(this.dialogVisible = false);
  }

  loadCustomers(event: LazyLoadEvent) {
    this.loadingTable = true
    //event.sortField = Field name to sort with
    //event.sortOrder = Sort order as number, 1 for asc and -1 for dec
    console.log(event)
    console.log('сортировка по полю: ' ,event.sortField)
    let currentPage = event.first / event.rows + 1;
    if(event.sortField){
      let sortOrder = ''
      event.sortOrder === 1 ?  sortOrder = 'asc' : sortOrder = 'desc'
      this.sub = this.shipmentsService.getShipmetsPaginations(this.sessionId, currentPage, event.rows ,event.sortField, sortOrder).subscribe(
        res => {
          console.log(res)
          this.mathematicalForecastContent = res.content
          this.totalRecords = res.totalElements
        },
        error => this.modalService.open(error.error.message),
        () => this.loadingTable = false
      )
    } else {
      this.sub = this.shipmentsService.getShipmetsPaginations(this.sessionId, currentPage, event.rows).subscribe(
        res => {
          console.log(res)
          this.mathematicalForecastContent = res.content
          this.totalRecords = res.totalElements

        },
        error => this.modalService.open(error.error.message),
        () => this.loadingTable = false
      )
    }
  }

  colorYears(rowData, col: any) {
    const mass = col['field'].toString().split('.');
    return rowData.shipmentYearValuePairs[mass[1]].calculated === true ?  true :  false
  }

  editColumn(row: any, col: any, $event: any) {
    if(col['keyS'] === true){
      const mass = col['field'].toString().split('.');
      console.log(row.shipmentYearValuePairs[mass[1]])
      console.log([mass[1]])
      row.shipmentYearValuePairs[mass[1]].value = Number($event);
    }else{
      const item = col['field'];
      row[item] = $event
    }
  }
  onRowEditInit(rowData) {
    console.log(rowData)
  }

  onRowEditSave(rowData) {
    console.log(rowData)
    this.shipmentsService.putShipments(rowData).subscribe(
      res => (console.log('god')),
      error => this.modalService.open(error.error.message)
    )
  }

  onRowEditCancel() {

  }
}
