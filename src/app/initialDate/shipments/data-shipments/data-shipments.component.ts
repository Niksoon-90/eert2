import {Component, OnDestroy, OnInit,} from '@angular/core';
import {ShipmentsService} from "../../../services/shipments.service";
import {ISession, IShipmentPagination} from "../../../models/shipmenst.model";

import {ModalService} from "../../../services/modal.service";
import {IAuthModel} from "../../../models/auth.model";
import {AuthenticationService} from "../../../services/authentication.service";
import {map} from "rxjs/operators";
import {Subscription} from "rxjs";
import {ConfirmationService, MessageService} from "primeng/api";
import {HttpEventType} from "@angular/common/http";
import {CalculationsService} from "../../../services/calculations.service";


@Component({
  selector: 'app-data-shipments',
  templateUrl: './data-shipments.component.html',
  styleUrls: ['./data-shipments.component.scss']
})
export class DataShipmentsComponent implements OnInit, OnDestroy {

  shipmentsSession: ISession[];
  customers: any[];
  loading: boolean = true;
  first = 0;
  rows = 25;
  dialogVisible: boolean;
  user: IAuthModel
  sessionId: number = 0
  doenloadItemId: number [] = []
  opimalItemId: number [] = []
  subscriptions: Subscription = new Subscription();
  displayModal: boolean = false
  shipmentHistoricalYears: any[] = []
  selectedShipmentHistoricalYears: [];
  shipmentItemId: number

  constructor(
    private messageService: MessageService,
    private shipmentsService: ShipmentsService,
    private modalService: ModalService,
    private authenticationService: AuthenticationService,
    private confirmationService: ConfirmationService,
    private calculationsService: CalculationsService,
  ) {
    this.user = this.authenticationService.userValue;
  }

  ngOnInit(): void {
    this.getShipmentsSession();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  reset() {
    this.first = 0;
    this.getShipmentsSession();
  }

  isLastPage(): boolean {
    return this.customers ? this.first === (this.customers.length - this.rows) : true;
  }

  isFirstPage(): boolean {
    return this.customers ? this.first === 0 : true;
  }

  getShipmentsSession() {
    this.loading = true
    if (this.user.authorities.includes('P_P_p5') === true) {
      this.subscriptions.add(this.shipmentsService.getHistoricalSession()
        .pipe(
          map((data: ISession[]) => {
            if (data.length !== 0) {
              data = data.filter(p => p.fileType === "SHIPMENTS")
            }
            return data
          })
        )
        .subscribe(
          res => {
            this.shipmentsSession = res.sort((a, b) => a.id < b.id ? 1 : -1);
          },
          error => this.modalService.open(error.error.message),
          () => this.loading = false,
        )
      )
    } else {
      this.subscriptions.add(this.shipmentsService.getShipSession()
        .pipe(
          map((data: ISession[]) => {
            if (data.length !== 0) {
              data = data.filter(p => p.userLogin === this.user.user && p.fileType === "SHIPMENTS")
            }
            return data
          })
        )
        .subscribe(
          res => {
            this.shipmentsSession = res.sort((a, b) => a.id < b.id ? 1 : -1);
          },
          error => this.modalService.open(error.error.message),
          () => this.loading = false,
        )
      )
    }
  }

  removeShipSession(id: number, name: string) {
    this.confirmationService.confirm({
      message: `Вы уверенны, что хотите удалить исторические данные: ${name}?`,
      header: 'Удаление исторических данных',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.shipmentsService.deleteShipSession(id).subscribe(
          () => console.log(),
          error => {
            this.modalService.open(error.error.message);
            this.loading = false;
          },
          () => {
            this.loading = false
            this.getShipmentsSession()
          }
        )
      }
    });
  }

  openShipItemSession(id: number) {
    this.sessionId = id
    this.showDialog();
  }

  showDialog() {
    this.dialogVisible === true ? '' : this.dialogVisible = true;
    this.loading = false;
  }

  loadingChange(event) {
    this.loading = event;
  }

  CloseModalChange(event: boolean) {
    this.dialogVisible = event;
  }

  next() {
    this.first = this.first + this.rows;
  }

  prev() {
    this.first = this.first - this.rows;
  }


  downloadAbsentcargo(id: number) {
    this.doenloadItemId.push(id)
    this.subscriptions.add(this.shipmentsService.getDownloadAbsentcargo(id).subscribe(
      result => {
        switch (result.type) {
          case HttpEventType.Sent:
            console.log('Request sent!');
            break;
          case HttpEventType.ResponseHeader:
            console.log('Response header received!');
            break;
          case HttpEventType.DownloadProgress:
            const kbLoaded = Math.round(  result.total / result.loaded * 100);
            console.log('result', result);
            console.log('result.total', result.total);
            console.log('result.loaded', result.loaded);
            console.log(`Download in progress! ${kbLoaded}Kb loaded`);
            break;
          case HttpEventType.UploadProgress:
            const kbUploaded = Math.round(result.loaded / 1024);
            console.log(`Upload in progress! ${kbUploaded}Kb loaded`);
            break;
          case HttpEventType.Response:
            let filename: string = 'absentcargo.xlsx'
            let binaryData = [];
            binaryData.push(result.body);
            let downloadLink = document.createElement('a');
            downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: 'blob'}));
            downloadLink.setAttribute('download', filename);
            document.body.appendChild(downloadLink);
            downloadLink.click();
            return [];
        }
      },
      async (error) => {
        const message = JSON.parse(await error.error.text()).message;
        this.modalService.open(message)
        this.doenloadItemId = this.doenloadItemId.filter(item => item !== id)
      },
      () => this.doenloadItemId = this.doenloadItemId.filter(item => item !== id)
    )
    )
  }
  opimalOld(id: number) {
    this.opimalItemId.push(id)
    this.subscriptions.add(this.calculationsService.postoptimalAndHierarchical(id).subscribe(
      () => console.log(),
      error => {
        this.modalService.open(error.error.message)
        this.opimalItemId = this.opimalItemId.filter(item => item !== id)
      },
      () => {
        this.opimalItemId = this.opimalItemId.filter(item => item !== id)
      }
    ))
  }

  opimal() {
        this.opimalItemId.push(this.shipmentItemId)
        this.subscriptions.add(this.calculationsService.postCorrespondenceOptimal(this.shipmentItemId).subscribe(
          () => console.log(),
          error => {
            this.modalService.open(error.error.message)
            this.opimalItemId = this.opimalItemId.filter(item => item !== this.shipmentItemId)
          },
          () => {
            this.subscriptions.add(this.calculationsService.postHierarchicalShipment(this.shipmentItemId).subscribe(
              () => console.log(),
              error => {
                this.modalService.open(error.error.message)
                this.opimalItemId = this.opimalItemId.filter(item => item !== this.shipmentItemId)
              },
              () => {
                this.opimalItemId = this.opimalItemId.filter(item => item !== this.shipmentItemId)
              }
            ))
          }
        ))
      }

  showModalDialog(id: number, year: string) {
    this.selectedShipmentHistoricalYears = []
    this.shipmentHistoricalYears  = year.split(',')
    this.shipmentItemId = id
    this.displayModal = true;
  }

  closedisplayModal() {
    this.selectedShipmentHistoricalYears = []
    this.displayModal = false;
  }

  checkShipmentHistoricalYearsLenght(item: number) {
    return this.selectedShipmentHistoricalYears.length === this.shipmentHistoricalYears.length - 1 ?   item :  false
  }
}
