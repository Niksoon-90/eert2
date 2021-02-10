import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import { Subscription} from "rxjs";
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




@Component({
  selector: 'app-step',
  templateUrl: './step.component.html',
  styleUrls: ['./step.component.scss']
})
export class StepComponent implements OnInit {
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

  position: string;
  displayPosition: boolean;

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
    this.allShipItemSession();
  }


  allShipItemSession() {
    this.loader = true
    this.shipmentsService.getShipmetsPaginations(this.sessionId)
      .subscribe(
        res => {
          console.log(res)
          res === null ? this.mathematicalForecastTable = [] : this.mathematicalForecastTable = res.content
          res === null ? this.totalRecords = 0 : this.totalRecords = res.totalElements
        },
        error => {
          this.modalService.open(error.error.message)
          this.loader = false
        },
        () => {
          this.createColumnTable()
          this.loader = false
        }
      )
  }

  createColumnTable() {
    this.columsYears = this.mathematicalForecastTable[0].shipmentYearValuePairs.length
    this.cols = [
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
        keyS: true
      })
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
      error => {
        this.modalService.open(error.error.message),
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
      error => {
        this.modalService.open(error.error.message),
          this.downloadRoadLoading = false
      },
      () => this.downloadRoadLoading = false
    )
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


  prevPage() {
    this.router.navigate(['/payments']);
  }

  nextPage() {
    if (this.selectedPrimery !== null) {
      this.router.navigate(['payments/ias/', this.sessionId, this.nameSession]);
    }
  }

  showPositionDialog(position: string) {
    this.position = position;
    this.displayPosition = true;
  }
}
