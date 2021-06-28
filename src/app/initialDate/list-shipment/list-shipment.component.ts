import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {AuthenticationService} from "../../services/authentication.service";
import {ModalService} from "../../services/modal.service";
import {ShipmentsService} from "../../services/shipments.service";
import {IShipment} from "../../models/shipmenst.model";
import {IAuthModel} from "../../models/auth.model";
import {ConfirmationService, LazyLoadEvent} from "primeng/api";
import {CalculationsService} from "../../services/calculations.service";
import {IShipmentInfo, TestService} from "../../services/test.service";
import {forkJoin, Subscription} from "rxjs";
import {Table} from "primeng/table";
import {Dropdown} from "primeng/dropdown";


@Component({
  selector: 'app-list-shipment',
  templateUrl: './list-shipment.component.html',
  styleUrls: ['./list-shipment.component.scss'],
})
export class ListShipmentComponent implements OnInit, OnChanges, OnDestroy {

  @ViewChild('dt') table: Table;

  @ViewChild("dropdownPrimary", {static: false}) dropdownPrimary: Dropdown

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
  subscriptions: Subscription = new Subscription();

  constructor(
    private modalService: ModalService,
    private shipmentsService: ShipmentsService,
    private authenticationService: AuthenticationService,
    private calculationsService: CalculationsService,
    private testService: TestService,
    private confirmationService: ConfirmationService,
  ) {
    this.user = this.authenticationService.userValue;
  }


  ngOnChanges() {
    this.subscriptions.add(this.testService.getValueShipmentInfo().subscribe(res => this.shipmenNewtInfo = res))
  }

  ngOnInit(): void {
    this.mathematicalForecastContent = [];
    this.totalRecords = 0

  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
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
    this.loadingTable = false
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
        this.parseFilterColumn(name, value)
        //this.filters = ',' + name + '~' + value;
        break;
      case 'cargoSubGroup':
        this.parseFilterColumn(name, value)
        //this.filters = ',' + name + '~' + value;
        break;
      case 'shipmentType':
        this.parseFilterColumn(name, value)
        //this.filters = ',' + name + '~' + value;
        break;
      case 'fromRoad':
        this.parseFilterColumn(name, value)
        //this.filters = ',' + name + '~' + value;
        break;
      case 'fromStation':
        this.parseFilterColumn(name, value)
        //this.filters = ',' + name + '~' + value;
        break;
      case 'fromStationCode':
        this.parseFilterColumn(name, value)
        //this.filters = ',' + name + '~' + value;
        break;
      case 'fromSubject':
        this.parseFilterColumn(name, value)
        //this.filters = ',' + name + '~' + value;
        break;
      case 'senderName':
        this.parseFilterColumn(name, value)
        //this.filters = ',' + name + '~' + value;
        break;
      case 'toRoad':
        this.parseFilterColumn(name, value)
        //this.filters = ',' + name + '~' + value;
        break;
      case 'toStation':
        this.parseFilterColumn(name, value)
        //this.filters = ',' + name + '~' + value;
        break;
      case 'toStationCode':
        this.parseFilterColumn(name, value)
        //this.filters = ',' + name + '~' + value;
        break;
      case 'toSubject':
        this.parseFilterColumn(name, value)
        //this.filters = ',' + name + '~' + value;
        break;
      case 'receiverName':
        this.parseFilterColumn(name, value)
        //this.filters = ',' + name + '~' + value;
        break;
      case 'primary':
        this.filters = ',' + 'isPrimary' + ':' + value;
        break;
      default:
        this.parseFiltersYears(name, value);
    }
  }

  parseFilterColumn(name: string, value: string){
    console.log(value.match(/^[@]/))
    if (value.match(/^[@]/)) {
      return value[0] === '@' ? this.filters = ',' + name + ':' + value.trim().slice(1) : this.filters = ',' + name + value
    }else{
      return this.filters = ',' + name + '~' + value;
    }
  }

  parseFiltersYears(name: string, value: string) {
    if (value.match(/^[><=]/)) {
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
        resultFilterUrl.push(this.filters)
      }
    }
    event.sortField === 'primary' ? sortField = 'isPrimary' : sortField = event.sortField
    event.sortOrder === 1 ? sortOrder = 'asc' : sortOrder = 'desc'
    this.filterTableEvant = {
      sessionId: this.sessionId,
      currentPage: currentPage,
      rows: event.rows,
      sortField: sortField,
      sortOrder: sortOrder,
      resultFilterUrl: resultFilterUrl.join('')
    }
    this.shipmentPagination()
  }

  shipmentPagination() {
    this.loadingTable = true
    this.subscriptions.add(
      forkJoin(
        this.shipmentsService.getShipmetsPaginations(this.filterTableEvant.sessionId, this.filterTableEvant.currentPage, this.filterTableEvant.rows, this.filterTableEvant.sortField, this.filterTableEvant.sortOrder, this.filterTableEvant.resultFilterUrl),
        this.shipmentsService.getSummFooter(this.filterTableEvant.sessionId, this.filterTableEvant.resultFilterUrl)
      ).subscribe(([mathematicalForecast, massSummYear]) =>
        {
          mathematicalForecast === null ? this.mathematicalForecastContent = [] : this.mathematicalForecastContent = mathematicalForecast.content
          mathematicalForecast === null ? this.totalRecords = 0 : this.totalRecords = mathematicalForecast.totalElements
          this.massSummYear = massSummYear;
        },error => {
          this.modalService.open(error.error.message)
          this.loadingTable = false
        },
        () => {
          this.columsYears === 0 ? this.createColumnTable() : this.loadingTable = false
        }
      )
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
    this.subscriptions.add(this.shipmentsService.putShipments(rowData).subscribe(
      () => console.log('Сохранение успешно'),
      error => this.modalService.open(error.error.message),
      () => this.summFooter(this.sessionId)
    ))
  }

  onRowEditCancel() {

  }

  displayModalRowClose(event: boolean) {
    this.displayModal = event
  }

  updateListShipmentTable(event: boolean) {
    if (event === true) {
      this.shipmentPagination()
    }
  }

  summFooter(sessionId: number) {
    this.massSummYear= {}
    this.subscriptions.add(this.shipmentsService.getSummFooter(sessionId, this.filterTableEvant.resultFilterUrl).subscribe(
      res => {
        this.massSummYear = res
      },
      error => this.modalService.open(error.error.message)
    ))
  }

  deleteShipments(id: number) {
    this.confirmationService.confirm({
      message: `Вы уверенны, что хотите удалить?`,
      header: 'Удаление!',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.subscriptions.add(this.shipmentsService.deleteShipment(id).subscribe(
          () => console.log(),
          error => this.modalService.open(error.message),
          () => this.shipmentPagination()
        ))
      }
    });
  }

  clearfilter() {
    this.dropdownPrimary.clear(null);
    this.table.reset();
  }
}
