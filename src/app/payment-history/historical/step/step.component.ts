import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {forkJoin, Subscription} from "rxjs";
import {IAuthModel} from "../../../models/auth.model";
import {CalculationsService} from "../../../services/calculations.service";
import {ModalService} from "../../../services/modal.service";
import {AuthenticationService} from "../../../services/authentication.service";
import {ShipmentsService} from "../../../services/shipments.service";
import {IShipment} from "../../../models/shipmenst.model";
import {HttpResponse} from "@angular/common/http";
import {UploadFileService} from "../../../services/upload-file.service";
import {Table} from "primeng/table";
import {ForecastingModelService} from "../../../services/forecasting-model.service";
import {Dropdown} from "primeng/dropdown";


@Component({
  selector: 'app-step',
  templateUrl: './step.component.html',
  styleUrls: ['./step.component.scss']
})
export class StepComponent implements OnInit, OnDestroy {

  @ViewChild('dt') table: Table;

  mathematicalForecastTable: IShipment[]
  loading: boolean;
  columsYears: number = 0;
  cols: any[];
  user: IAuthModel;
  loader: boolean = false
  downloadShipLoading: boolean = false
  downloadRoadLoading: boolean = false
  primeryBol = [{label: 'Все', value: ''}, {label: 'Да', value: true}, {label: 'Нет', value: false}]
  selectedPrimery: any;
  sessionId: number
  primary2 = [{label: 'Да', value: true}, {label: 'Нет', value: false}]
  first: number = 0;
  loadingTable: boolean = true;
  operator: ''
  filters: string = ''
  massSummYear: {} = {}
  filterTableEvant: any
  totalRecords: number = 0
  private subscription: Subscription
  nameSession: string
  mathematicalForecastTableShipmentYearCalculated = []
  subscriptions: Subscription = new Subscription();
  selectedIsUpdatedByClaim: any;
  typeCalculation = [
    {label: 'Все', value: ''},
    {label: 'по методу наименьших квадратов', value: 'LESS_SQUARE'},
    {label: 'по отчётному году', value: 'FISCAL_YEAR'},
    {label: 'по тенденции (по фиксированным промежуткам)', value: 'TENDENCY_FIXED_DELTA'},
    {label: 'по тенденции (по увеличивающимся промежуткам)', value: 'TENDENCY_INCREASING_DELTA'},
    {label: 'по среднему арифметическому (по фиксированным промежуткам)', value: 'AVERAGE_FIXED_INTERVAL'},
    {label: 'по среднему арифметическому (по увеличивающимся промежуткам)', value: 'AVERAGE_INCREASING_INTERVAL'},
  ]
  selectedForecastType: any;

  constructor(
    private router: Router,
    private calculationsService: CalculationsService,
    private modalService: ModalService,
    private authenticationService: AuthenticationService,
    private shipmentsService: ShipmentsService,
    private activateRoute: ActivatedRoute,
    private uploadFileService: UploadFileService,
    private forecastingModelService: ForecastingModelService,
  ) {
    this.subscription = activateRoute.params.subscribe(params => {
      this.sessionId = params['id'], this.nameSession = params['name']
    });
    this.user = this.authenticationService.userValue;
  }


  ngOnInit(): void {
    this.mathematicalForecastTable = [];
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }



  createColumnTable() {
    this.mathematicalForecastTable.length === 0 ? this.columsYears = 0 : this.columsYears = this.mathematicalForecastTable[0].shipmentYearValuePairs.length
    this.mathematicalForecastTable.length !== 0 ? this.mathematicalForecastTable[0].shipmentYearValuePairs.forEach(elements => (elements.calculated === true ? this.mathematicalForecastTableShipmentYearCalculated.push(elements.year) : '')) : this.mathematicalForecastTableShipmentYearCalculated = null
    this.mathematicalForecastTableShipmentYearCalculated.length !== 0 ? this.forecastingModelService.setTicketInformationMathematicalForecastTable(this.mathematicalForecastTableShipmentYearCalculated) : this.forecastingModelService.setTicketInformationMathematicalForecastTable(null)

    this.cols = [
      {field: 'forecastType', header: 'Оптимальный по умолчанию (до балансировки)', width: '100px', keyS: false},
      {field: 'cargoGroup', header: 'Группа груза', width: '100px', keyS: false},
      {field: 'cargoSubGroup', header: 'Подгруппа груза', width: '100px', keyS: false},
      {field: 'shipmentType', header: 'Вид перевозки', width: '100px', keyS: false},
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
      {field: 'primary', header: 'Уст.', width: '80px', keyS: false},
      {field: 'updatedByClaim', header: 'На основе заявок', width: '100px', keyS: false},
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

  summFooter(sessionId: number) {
    this.subscriptions.add(this.shipmentsService.getSummFooter(sessionId, this.filterTableEvant.resultFilterUrl).subscribe(
      res => {
        this.massSummYear = res
      },
      error => this.modalService.open(error.error.message)
    ))
  }

  primeryBolChange(value: any, field: any, equals: string) {
    this.table.filter(value, field, equals)
    this.forecastingModelService.ticketInformation.history.primeryBolChange = this.selectedPrimery
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


  onRowEditInit(item: any) {

  }

  onRowEditSave(item: any) {
    delete item.session
    this.subscriptions.add(this.shipmentsService.putShipments(item).subscribe(
      () => console.log('god'),
      error => this.modalService.open(error.error.message),
      () => this.summFooter(this.sessionId)
    ))
  }

  onRowEditCancel() {
  }


  downloadShip() {
    this.downloadShipLoading = true;
    this.subscriptions.add(this.uploadFileService.getDownload(this.sessionId, 'SHIPMENTS').subscribe(
      (response: HttpResponse<Blob>) => {
        console.log(response)
        let filename: string = 'shipments.xlsx'
        let binaryData = [];
        binaryData.push(response.body);
        let downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: 'blob'}));
        downloadLink.setAttribute('download', filename);
        document.body.appendChild(downloadLink);
        downloadLink.click();
      },
      async (error) => {
        const message = JSON.parse(await error.error.text()).message;
        this.modalService.open(message)
        this.downloadShipLoading = false
      },
      () => this.downloadShipLoading = false
    ))
  }

  downloadRoad() {
    this.downloadRoadLoading = true;
    this.subscriptions.add(this.uploadFileService.getDownload(this.sessionId, 'ROAD_TO_ROAD').subscribe(
      (response: HttpResponse<Blob>) => {
        console.log(response)
        let filename: string = 'road_to_road.xlsx'
        let binaryData = [];
        binaryData.push(response.body);
        let downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: 'blob'}));
        downloadLink.setAttribute('download', filename);
        document.body.appendChild(downloadLink);
        downloadLink.click();
      },
      async (error) => {
        const message = JSON.parse(await error.error.text()).message;
        this.modalService.open(message)
        this.downloadRoadLoading = false
      },
      () => this.downloadRoadLoading = false
    ))
  }


  filterFieldHeaders(name: string, value: string) {
    switch (name) {
      case 'forecastType':
        this.filters = ',' + name + ':' + value;
        break;
      case 'updatedByClaim':
        this.filters = ',' + 'isUpdatedByClaim' + ':' + value;
        break;
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

  loadCustomers(event: any) {
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
    if (event.sortField === 'primary') {
      sortField = 'isPrimary'
    } else if (event.sortField === 'updatedByClaim') {
      sortField = 'isUpdatedByClaim'
    } else {
      sortField = event.sortField;
    }
    event.sortOrder === 1 ? sortOrder = 'asc' : sortOrder = 'desc'

    this.filterTableEvant = {
      sessionId: this.sessionId,
      currentPage: currentPage,
      rows: event.rows,
      sortField: sortField,
      sortOrder: sortOrder,
      resultFilterUrl: resultFilterUrl.join('')
    }
    this.shipmentPagination();
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



  prevPage() {
    this.router.navigate(['/payments']);
  }

  nextPage() {
    console.log(this.selectedPrimery)
    if (this.selectedPrimery !== null) {
      this.subscriptions.add(this.shipmentsService.putTransformFile(this.sessionId, true).subscribe(
        () => console.log(),
        error => {
          this.modalService.open(error.error.message)
          this.loading = true
        },
        () => {
          this.router.navigate(['payments/ias/', this.sessionId, this.nameSession]);
        }
      ))
    }
  }

  clearfilter() {
    this.table.reset();
  }

  forecastTypeInString(name: any) {
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
        return ''
        break;
    }
  }
}
