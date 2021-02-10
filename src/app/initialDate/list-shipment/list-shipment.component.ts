import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output} from '@angular/core';
import {AuthenticationService} from "../../services/authentication.service";
import {ModalService} from "../../services/modal.service";
import {ShipmentsService} from "../../services/shipments.service";
import {IShipment} from "../../models/shipmenst.model";
import {IAuthModel} from "../../models/auth.model";
import {LazyLoadEvent} from "primeng/api";
import {Subscription} from "rxjs";
import {ICargoNci} from "../../models/calculations.model";
import {CalculationsService} from "../../services/calculations.service";
import {IShipmentInfo, TestService} from "../../services/test.service";


@Component({
  selector: 'app-list-shipment',
  templateUrl: './list-shipment.component.html',
  styleUrls: ['./list-shipment.component.scss'],
})
export class ListShipmentComponent implements OnInit, OnChanges {

  @Input() mathematicalForecastTable;

  @Input() dialogVisible;

  @Input() loading;

  @Input() sessionId;

  @Output() change: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output() changes: EventEmitter<boolean> = new EventEmitter<boolean>();

  shipmenNewtInfo: IShipmentInfo
  mathematicalForecastContent: IShipment[]
  totalRecords: number
  cols: any[];
  columsYears: number = 0;
  loadingTable: boolean = true
  primary2 = [{label: 'Да', value: true}, {label: 'Нет', value: false}]
  primeryBol = [{label: 'Все', value: ''}, {label: 'Да', value: true}, {label: 'Нет', value: false}]
  displayModal: boolean = false
  user: IAuthModel
  first: number = 0;
  massSummYear: {} = {}
  filters: string = ''
  selectedPrimery: any;
  filterTableEvant: any

  constructor(
    private modalService: ModalService,
    private shipmentsService: ShipmentsService,
    private authenticationService: AuthenticationService,
    private calculationsService: CalculationsService,
    private testService: TestService
  ) {
    this.user = this.authenticationService.userValue;
  }


  ngOnChanges() {
    this.testService.getValueShipmentInfo().subscribe(res => this.shipmenNewtInfo = res)
  }

  ngOnInit(): void {
    this.mathematicalForecastContent = this.mathematicalForecastTable.content;
    this.totalRecords = this.mathematicalForecastTable.totalElements
    this.createColumnTable();
  }

  createColumnTable() {
    if (this.mathematicalForecastContent[0].shipmentYearValuePairs.length > 0) {
      this.columsYears = this.mathematicalForecastContent[0].shipmentYearValuePairs.length
    }
    this.cols = [
      {field: 'cargoGroup', header: 'Группа груза', width: '100px', keyS: false, isStatic: true},
      {field: 'cargoSubGroup', header: 'Подгруппа груза', width: '100px', keyS: false},
      {field: 'shipmentType', header: 'Вид перевозки', width: '100px', keyS: false},
      {field: 'primary', header: 'Корреспонденции', width: '100px', keyS: false},
      {field: 'fromRoad', header: 'Дорога отправления', width: '100px', keyS: false},
      {field: 'fromStation', header: 'Станция отправления РФ', width: '100px', keyS: false},
      {field: 'fromStationCode', header: 'Код станции отправления РФ', width: '100px', keyS: false},
      {field: 'fromSubject', header: 'Субъект отправления', width: '100px', keyS: false},
      {field: 'senderName', header: 'Грузоотправитель', width: '100px', keyS: false},
      {field: 'toRoad', header: 'Дорога назначения', width: '100px', keyS: false},
      {field: 'toStation', header: 'Станция назначения РФ', width: '100px', keyS: false},
      {field: 'toStationCode', header: 'Код станции назначения РФ', width: '100px', keyS: false},
      {field: 'toSubject', header: 'Субъект назначения', width: '100px', keyS: false},
      {field: 'receiverName', header: 'Грузополучатель', width: '100px', keyS: false},

    ];
    for (let i = 0; i < this.columsYears; i++) {
      this.cols.push({
        field: `shipmentYearValuePairs.${i}.value`,
        header: this.mathematicalForecastContent[0].shipmentYearValuePairs[i].year,
        width: '100px',
        keyS: true
      })
    }
  }


  showModalDialog() {
    this.displayModal = true;
  }

  closeModalTable() {
    this.change.emit(this.loading = false);
    this.changes.emit(this.dialogVisible = false);
  }

  filterFieldHeaders(name: string, value: string) {
    switch (name) {
      case 'cargoGroup':
        this.filters = ',' + name + '~' + value;
        break;
      case 'cargoSubGroup':
        this.filters = ',' + name + '~' + value;
        break;
      case 'shipmentType':
        this.filters = ',' + name + '~' + value;
        break;
      case 'fromRoad':
        this.filters = ',' + name + '~' + value;
        break;
      case 'fromStation':
        this.filters = ',' + name + '~' + value;
        break;
      case 'fromStationCode':
        this.filters = ',' + name + '~' + value;
        break;
      case 'fromSubject':
        this.filters = ',' + name + '~' + value;
        break;
      case 'senderName':
        this.filters = ',' + name + '~' + value;
        break;
      case 'toRoad':
        this.filters = ',' + name + '~' + value;
        break;
      case 'toStation':
        this.filters = ',' + name + '~' + value;
        break;
      case 'toStationCode':
        this.filters = ',' + name + '~' + value;
        break;
      case 'toSubject':
        this.filters = ',' + name + '~' + value;
        break;
      case 'receiverName':
        this.filters = ',' + name + '~' + value;
        break;
      case 'primary':
        this.filters = ',' + 'isPrimary' + '~' + value;
        break;
      default:
        this.parseFiltersYears(name, value);
    }
  }

  parseFiltersYears(name: string, value: string) {
    if(value.match(/^[><=]/)){
      return value[0] === '=' ? this.filters = ',' + name + ':' + value.trim().slice(1) : this.filters = ',' + name + value
    }
    if (value.search('-') !== -1) {
      let massiv = value.split('-')
      if (massiv.length === 2) {
        return this.filters = ',' + name + '>' + massiv[0] + ',' + name + '<' + massiv[1];
      }
    } else {
      return this.filters = ',' + name + '>' + value;
    }
  }

  loadCustomers(event: LazyLoadEvent) {
    let sortField = ''
    let sortOrder = ''
    let currentPage = event.first / event.rows;
    let resultFilterUrl = []
    this.loadingTable = true
    if (Object.keys(event.filters).length !== 0) {
      for (let i = 0; i < Object.keys(event.filters).length; i++) {
        this.filterFieldHeaders(Object.keys(event.filters)[i], Object.values(event.filters[Object.keys(event.filters)[i]])[0].toString());
        console.log(this.filters)
        resultFilterUrl.push(this.filters)
      }
    }
    event.sortField === 'primary' ? sortField = 'isPrimary' : sortField = event.sortField
    event.sortOrder === 1 ? sortOrder = 'asc' : sortOrder = 'desc'

    console.log('сортировка по полю: ', event.sortField)
    this.filterTableEvant = {
      sessionId: this.sessionId,
      currentPage: currentPage,
      rows: event.rows,
      sortField: sortField,
      sortOrder: sortOrder,
      resultFilterUrl: resultFilterUrl.join('')
    }
    this.shipmentsService.getShipmetsPaginations(this.sessionId, currentPage, event.rows, sortField, sortOrder, resultFilterUrl.join(''))
      .subscribe(
        res => {
          console.log(res)
          res === null ? this.mathematicalForecastContent = [] : this.mathematicalForecastContent = res.content
          res === null ? this.totalRecords = 0 : this.totalRecords = res.totalElements
        },
        error => {
          this.modalService.open(error.error.message)
          this.loadingTable = false
        },
        () => {
          this.columsYears === 0 ? this.createColumnTable() : this.loadingTable = false
          this.summFooter(this.sessionId)
        }
      )
  }

  colorYears(rowData, col: any) {
    const mass = col['field'].toString().split('.');
    return rowData.shipmentYearValuePairs[mass[1]].calculated === true ? true : false
  }

  editColumn(row: any, col: any, $event: any) {
    if (col['keyS'] === true) {
      const mass = col['field'].toString().split('.');
      row.shipmentYearValuePairs[mass[1]].value = Number($event);
    } else {
      const item = col['field'];
      row[item] = $event
    }
  }

  onRowEditInit(rowData) {

  }

  onRowEditSave(rowData) {
    this.shipmentsService.putShipments(rowData).subscribe(
      res => (console.log('Сохранение успешно')),
      error => this.modalService.open(error.error.message),
      () => this.summFooter(this.sessionId)
    )
  }

  onRowEditCancel() {

  }

  displayModalRowClose(event: boolean) {
    this.displayModal = event
  }

  updateListShipmentTable(event: boolean) {
    if (event === true) {
      console.log('this.shipmenNewtInfo', this.shipmenNewtInfo)
      this.shipmentsService.getShipmetsPaginations(this.filterTableEvant.sessionId, this.filterTableEvant.currentPage, this.filterTableEvant.rows, this.filterTableEvant.sortField, this.filterTableEvant.sortOrder, this.filterTableEvant.resultFilterUrl)
        .subscribe(
          res => {
            console.log(res)
            res === null ? this.mathematicalForecastContent = [] : this.mathematicalForecastContent = res.content
            res === null ? this.totalRecords = 0 : this.totalRecords = res.totalElements
          },
          error => {
            this.modalService.open(error.error.message)
            this.loadingTable = false
          },
          () => {
            this.loadingTable = false,
              this.summFooter(this.filterTableEvant.sessionId)
          }
        )
    }
  }

  summFooter(sessionId: number) {
    this.shipmentsService.getSummFooter(sessionId, this.filterTableEvant.resultFilterUrl).subscribe(
      res => {
        console.log(res)
        this.massSummYear = res
      },
      error => this.modalService.open(error.error.message)
    )
  }
}
