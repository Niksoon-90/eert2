import {
  Component,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import {Table} from 'primeng/table';
import {ShipmentsService} from "../../../services/shipments.service";
import {ModalService} from "../../../services/modal.service";
import {ForecastingModelService} from "../../../services/forecasting-model.service";
import {AuthenticationService} from "../../../services/authentication.service";
import {IAuthModel} from "../../../models/auth.model";
import {HttpResponse} from "@angular/common/http";
import {UploadFileService} from "../../../services/upload-file.service";
import {IShipment} from "../../../models/shipmenst.model";
import {CalculationsService} from "../../../services/calculations.service";
import {ISelectMethodUsers} from "../../../models/calculations.model";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ConfirmationService} from "primeng/api";
import {Dropdown} from "primeng/dropdown";


@Component({
  selector: 'app-mathematical-forecast-table',
  templateUrl: './mathematical-forecast-table.component.html',
  styleUrls: ['./mathematical-forecast-table.component.scss']
})
export class MathematicalForecastTableComponent implements OnInit {

  @ViewChild('dt') table: Table;

  @ViewChild("dropdownPrimary", {static: false}) dropdownPrimary: Dropdown

  @ViewChild("dropdownForecastType", {static: false}) dropdownForecastType: Dropdown

  @Input() settlemenType;

  @Input() forecastingStrategySustainable;

  @Input() forecastingStrategySmall;

  @Input() totalRecords;

  loadingMathematicalForecastTable: boolean = true
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
  reportingYears = [];
  methodUsers: ISelectMethodUsers[];
  forecastingStrategyFilter: any;
  yearsColm: any;
  primeColm: any;
  forecastFiscalYear: any;
  dynamicForm: FormGroup;
  numberHistroricalYears = 0
  mathematicalForecastTableShipmentYearCalculated = []
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
    private formBuilder: FormBuilder,
    private shipmentsService: ShipmentsService,
    private modalService: ModalService,
    private forecastingModelService: ForecastingModelService,
    private authenticationService: AuthenticationService,
    private uploadFileService: UploadFileService,
    public forecastModelService: ForecastingModelService,
    public calculationsService: CalculationsService,
    private confirmationService: ConfirmationService,
  ) {
    this.user = this.authenticationService.userValue;
  }


  ngOnInit(): void {
    this.dynamicForm = this.formBuilder.group({
      summYearsInput: new FormArray([])
    });

    if (this.forecastModelService.getTicketInformation().stepOne.Session !== null) {
      this.sessionId = this.forecastModelService.getTicketInformation().stepOne.Session['id']
      this.additionalInfo(this.forecastModelService.ticketInformation.stepOne.Session['historicalYears']);
    } else {
      this.sessionId = this.forecastModelService.getTicketInformation().stepThree.sessionId;
    }
    this.methodUsers = [
      {id: 1, type: 'LESS_SQUARE', name: 'Вычисление прогноза корреспонденций по методу наименьших квадратов'},
      {id: 2, type: 'FISCAL_YEAR', name: 'Вычисление прогноза корреспонденций по отчётному году'},
      {
        id: 3,
        type: 'TENDENCY_FIXED_DELTA',
        name: 'Вычисление прогноза корреспонденций по тенденции (по фиксированным промежуткам)'
      },
      {
        id: 4,
        type: 'TENDENCY_INCREASING_DELTA',
        name: 'Вычисление прогноза корреспонденций по тенденции (по увеличивающимся промежуткам)'
      },
      {
        id: 5,
        type: 'AVERAGE_FIXED_INTERVAL',
        name: 'Вычисление прогноза корреспонденций по среднему арифметическому (по фиксированным промежуткам)'
      },
      {
        id: 6,
        type: 'AVERAGE_INCREASING_INTERVAL',
        name: 'Вычисление прогноза корреспонденций по среднему арифметическому (по увеличивающимся промежуткам)'
      },
    ]
  }


  get f() {
    return this.dynamicForm.controls;
  }

  get t() {
    return this.f.summYearsInput as FormArray;
  }


  onChangeTickets() {
    this.numberHistroricalYears =0
    this.mathematicalForecastTableShipmentYearCalculated = []
    if(this.mathematicalForecastTable.length !== 0){
      this.mathematicalForecastTable[0].shipmentYearValuePairs.forEach(elements => (elements.calculated === false ? this.numberHistroricalYears++ : '') );
      this.mathematicalForecastTable[0].shipmentYearValuePairs.forEach(elements => (elements.calculated === true ? this.mathematicalForecastTableShipmentYearCalculated.push(elements.year) : '') );
      this.mathematicalForecastTableShipmentYearCalculated.length !== 0 ? this.forecastModelService.setTicketInformationMathematicalForecastTable(this.mathematicalForecastTableShipmentYearCalculated) : this.forecastModelService.setTicketInformationMathematicalForecastTable(null)

      console.log(this.mathematicalForecastTableShipmentYearCalculated)
    }
    if (this.t.length < this.columsYears - this.numberHistroricalYears) {
      for (let i = this.t.length; i < this.columsYears -  this.numberHistroricalYears; i++) {
        this.t.push(this.formBuilder.group({
          name: ['', Validators.required],
        }));
      }
    } else {
      for (let i = this.t.length; i >= this.columsYears - this.numberHistroricalYears; i--) {
        this.t.removeAt(i);
      }
    }
  }

  additionalInfo(items) {
    const res = items.split(',')
    for (let item of res) {
      this.reportingYears.push({"name": item});
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
      () => this.summFooter(this.sessionId)
    )
  }

  onRowEditCancel() {
  }

  createColumnTable() {
    this.mathematicalForecastTable.length === 0 ? this.columsYears = 0 : this.columsYears = this.mathematicalForecastTable[0].shipmentYearValuePairs.length

    this.onChangeTickets()
    this.cols = [
      {field: 'forecastType', header: 'Предлагаемая стратегия прогнозирования', width: '100px', keyS: false},
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
    ];
    for (let i = 0; i < this.columsYears; i++) {
      this.cols.push({
        field: `shipmentYearValuePairs.${i}.value`,
        header: this.mathematicalForecastTable[0].shipmentYearValuePairs[i].year,
        width: '100px',
        keyS: true,
      })
    }
    this.loadingTable = false
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


  primeryBolChange(value: any, field: any, equals: string) {
    this.table.filter(value, field, equals)
    //this.forecastingModelService.ticketInformation.stepThree.primeryBolChange = this.selectedPrimery
  }

  downloadShip() {
    this.downloadShipLoading = true;
    this.uploadFileService.getDownload(this.sessionId, 'SHIPMENTS').subscribe(
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
    )
  }

  downloadRoad() {
    this.downloadRoadLoading = true;
    this.uploadFileService.getDownload(this.sessionId, 'ROAD_TO_ROAD').subscribe(
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
    )
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
        this.filters = ',' + 'isPrimary' + ':' + value;
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

  loadCustomers(event: any) {
    let sortField = ''
    let sortOrder = ''
    let currentPage = event.first / event.rows;
    let resultFilterUrl = []
    this.loadingTable = true
    if (Object.keys(event.filters).length !== 0) {
      for (let i = 0; i < Object.keys(event.filters).length; i++) {
        console.log(event)
        console.log(event.filters)
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
          console.log('ERERE', res)
          res === null ? this.mathematicalForecastTable = [] : this.mathematicalForecastTable = res.content
          res === null ? this.totalRecords = 0 : this.totalRecords = res.totalElements
        },
        error => {
          this.modalService.open(error)
          this.loadingTable = false
        },
        () => {
          this.columsYears === 0 ? this.createColumnTable() : this.loadingTable = false
          this.summFooter(this.sessionId)
        }
      )
  }

  particalListFilter() {
    if (this.forecastingStrategyFilter.type === 'FISCAL_YEAR' && (this.forecastFiscalYear === null || this.forecastFiscalYear === undefined)) {
      this.modalService.open('Стратегия прогнозирования корреспонденций. Укажите год!');
    } else {
      this.loadingMathematicalForecastTable = false
      this.calculationsService.getPartialListFilter(
        this.forecastModelService.getTicketInformation().stepOne.calcYearsNumber['name'],
        this.forecastingStrategyFilter.type,
        this.sessionId,
        this.forecastingStrategyFilter.type === 'FISCAL_YEAR' ? this.forecastFiscalYear['name'] : null,
        this.filterTableEvant.currentPage,
        this.filterTableEvant.rows,
        this.filterTableEvant.sortField,
        this.filterTableEvant.sortOrder,
        this.filterTableEvant.resultFilterUrl
      )
        .subscribe(
          res => console.log(res),
          error => {
            this.modalService.open(error.error.message)
            this.loadingMathematicalForecastTable = true
          },
          () => {
            this.loadingMathematicalForecastTable = true
            this.shipmentPagination()
          }
        )
    }
  }

  divideSum(idx: number, value: any) {
    let idxYear = idx + this.numberHistroricalYears
    let yearSumm: null;
    console.log(idxYear)
    this.mathematicalForecastTable.length !== 0 ? yearSumm = this.mathematicalForecastTable[0].shipmentYearValuePairs[idxYear.toString()].year : yearSumm = null
    console.log(idxYear)
    console.log(yearSumm)
    console.log(value)
    if (value !== '') {
      this.loadingTable = true
      this.calculationsService.getDivideSum(this.sessionId, this.filterTableEvant.resultFilterUrl, value, yearSumm)
        .subscribe(
          res => console.log(res),
          error => {
            this.modalService.open(error.error.message)
            this.loadingTable = false
          },
          () => {
            this.t.reset();
            this.shipmentPagination()
          }
        )
    }
  }

  shipmentPagination() {
    this.loadingTable = true
    this.shipmentsService.getShipmetsPaginations(this.sessionId, this.filterTableEvant.currentPage, this.filterTableEvant.rows, this.filterTableEvant.sortField, this.filterTableEvant.sortOrder, this.filterTableEvant.resultFilterUrl)
      .subscribe(
        res => {
          res === null ? this.mathematicalForecastTable = [] : this.mathematicalForecastTable = res.content
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

  summFooter(sessionId: number) {
    this.shipmentsService.getSummFooter(sessionId, this.filterTableEvant.resultFilterUrl).subscribe(
      res => {
        console.log('23', res)
        this.massSummYear = res
      },
      error => this.modalService.open(error.error.message)
    )
  }


  downloadBorder() {
    this.calculationsService.getLandBorder(this.sessionId).subscribe(
      (response: HttpResponse<Blob>) => {
        console.log(response)
        let filename: string = 'land_border.xlsx'
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
      }
    )
  }

  downloadPort() {
    this.calculationsService.getSeaPort(this.sessionId).subscribe(
      (response: HttpResponse<Blob>) => {
        console.log(response)
        let filename: string = 'sea_port.xlsx'
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
      }
    )
  }

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
        return ''
        break;
    }
  }

  hierarchicalShipment() {
    this.loadingTable = true
    this.calculationsService.postHierarchicalShipment(this.sessionId).subscribe(
      () => console.log(),
      error => {
        this.modalService.open(error.message)
        this.loadingTable = false
      },
      () => {
        this.shipmentPagination()
        this.loadingTable = false
      }
    )
  }

  deleteShipments(id: number) {
    this.confirmationService.confirm({
      message: `Вы уверенны, что хотите удалить корреспонденцию?`,
      header: 'Удаление корреспонденции',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.shipmentsService.deleteShipment(id).subscribe(
          () => console.log(),
          error => this.modalService.open(error.message),
          () => this.shipmentPagination()
        )
      }
    });

  }

  arrayHstoriYears(numberHistroricalYears: number) {
    return Array(numberHistroricalYears)
  }

  clearfilter() {
    this.dropdownPrimary.clear(null);
    this.dropdownForecastType.clear(null);
      this.table.reset();

  }
}

