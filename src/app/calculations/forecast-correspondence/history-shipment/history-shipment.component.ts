import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ModalService} from "../../../services/modal.service";
import {ShipmentsService} from "../../../services/shipments.service";
import {IShipment} from "../../../models/shipmenst.model";
import {forkJoin, Subscription} from "rxjs";
import {LazyLoadEvent} from "primeng/api";

@Component({
  selector: 'app-history-shipment',
  templateUrl: './history-shipment.component.html',
  styleUrls: ['./history-shipment.component.scss']
})
export class HistoryShipmentComponent implements OnInit, OnDestroy {

  @Input() sessionId

  mathematicalForecastTable: IShipment[];
  primeryBol = [{label: 'Все', value: ''}, {label: 'Да', value: true}, {label: 'Нет', value: false}]
  massSummYear: {} = {}
  typeCalculation= [
    {label: 'Все', value: ''},
    {label: 'по методу наименьших квадратов', value: 'LESS_SQUARE'},
    {label: 'по отчётному году', value: 'FISCAL_YEAR'},
    {label: 'по тенденции (по фиксированным промежуткам)', value: 'TENDENCY_FIXED_DELTA'},
    {label: 'по тенденции (по увеличивающимся промежуткам)', value: 'TENDENCY_INCREASING_DELTA'},
    {label: 'по среднему арифметическому (по фиксированным промежуткам)', value: 'AVERAGE_FIXED_INTERVAL'},
    {label: 'по среднему арифметическому (по увеличивающимся промежуткам)', value: 'AVERAGE_INCREASING_INTERVAL'},
    ]
  selectedPrimery: any;
  selectedForecastType: any;
  totalRecords: number
  filters: string = ''
  loadingTable: boolean = true
  columsYears: number = 0;
  cols: any[];
  first: number = 0;
  filterTableEvant: any
  subscriptions: Subscription = new Subscription();

  constructor(
    private modalService: ModalService,
    private shipmentsService: ShipmentsService,
  ) {
  }

  ngOnInit(): void {
    this.mathematicalForecastTable = []
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  createColumnTable() {
    this.mathematicalForecastTable.length === 0 ? this.columsYears = 0 : this.columsYears = this.mathematicalForecastTable[0].shipmentYearValuePairs.length
    this.cols = [
      {field: 'forecastType', header: 'Предлагаемая стратегия прогнозирования', width: '100px', keyS: false},
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
        header: this.mathematicalForecastTable[0].shipmentYearValuePairs[i].year,
        width: '100px',
        keyS: true
      })
    }
    this.loadingTable = false
  }


  filterFieldHeaders(name: string, value: string) {
    switch (name) {
      case 'forecastType':
        this.filters = ',' + name + ':' + value;
        break;
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
          mathematicalForecast === null ? this.mathematicalForecastTable = [] : this.mathematicalForecastTable = mathematicalForecast.content
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

  // summFooter(sessionId: number) {
  //   this.subscriptions.add(this.shipmentsService.getSummFooter(sessionId, this.filterTableEvant.resultFilterUrl).subscribe(
  //     res => this.massSummYear = res,
  //     error => this.modalService.open(error.error.message)
  //   ))
  // }

  sdsd(name: string) {
    switch (name) {
      case 'LESS_SQUARE':
        return 'по методу наименьших квадратов'
        break;
      case 'FISCAL_YEAR':
        return 'по отчётному году'
        break;
      case 'TENDENCY_FIXED_DELTA':
        return 'по тенденции (по фиксированным промежуткам)'
        break;
      case 'TENDENCY_INCREASING_DELTA':
        return 'по тенденции (по увеличивающимся промежуткам)'
        break;
      case 'AVERAGE_FIXED_INTERVAL':
        return 'по среднему арифметическому (по фиксированным промежуткам)'
        break;
      case 'AVERAGE_INCREASING_INTERVAL':
        return 'по среднему арифметическому (по увеличивающимся промежуткам)'
        break;
      default:
        return 'Подбирается оптимальный метод'
        break;
    }
  }
}
