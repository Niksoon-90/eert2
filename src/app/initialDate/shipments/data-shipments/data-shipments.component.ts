import {Component, OnDestroy, OnInit,} from '@angular/core';
import {ShipmentsService} from "../../../services/shipments.service";
import {ISession, IShipment, IShipmentPagination} from "../../../models/shipmenst.model";

import {ModalService} from "../../../services/modal.service";
import {IAuthModel} from "../../../models/auth.model";
import {AuthenticationService} from "../../../services/authentication.service";
import {map} from "rxjs/operators";
import {Subscription} from "rxjs";
import {ConfirmationService} from "primeng/api";
import {HttpResponse} from "@angular/common/http";


@Component({
  selector: 'app-data-shipments',
  templateUrl: './data-shipments.component.html',
  styleUrls: ['./data-shipments.component.scss']
})
export class DataShipmentsComponent implements OnInit {

  shipmentsSession: ISession[];
  customers: any[];
  mathematicalForecastTable: IShipmentPagination;
  sub: Subscription

  loading: boolean = true;
  first = 0;
  rows = 25;
  dialogVisible: boolean;
  user: IAuthModel
  sessionId: number = 0

  doenloadItemId: number [] = []

  constructor(
    private shipmentsService: ShipmentsService,
    private modalService: ModalService,
    private authenticationService: AuthenticationService,
    private confirmationService: ConfirmationService,
  ) {
    this.user = this.authenticationService.userValue;
  }


  ngOnInit(): void {
    this.getShipmentsSession();
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
      this.shipmentsService.getHistoricalSession()
        .pipe(
          map((data: ISession[]) => {
            if (data.length !== 0) {
              data = data.filter(p => p.fileType === "SHIPMENTS")
            //  const transformedData = Object.keys(data).map(key => Object.assign(data[key], {id: Math.random() * 1000000}))
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
    } else {
      this.shipmentsService.getShipSession()
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
    this.sub = this.shipmentsService.getShipmetsPaginations(id, 0).subscribe(
      res => {
        this.mathematicalForecastTable = res
        this.showDialog();
      },
      error => {
        this.modalService.open(error.error.message);
      },
    )
  }

  showDialog() {
    this.dialogVisible === true ? '' : this.dialogVisible = true;
    this.loading = false;
  }

  loadingChange(event) {
    this.loading = event;
  }

  CloseModalChange(event: boolean) {
    this.mathematicalForecastTable = null
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
    this.shipmentsService.getDownloadAbsentcargo(id).subscribe(
      (response: HttpResponse<Blob>) => {
        console.log(response)
        let filename: string = 'absentcargo.xlsx'
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
        this.doenloadItemId =  this.doenloadItemId.filter(item => item !== id)
      },
      () =>  this.doenloadItemId =  this.doenloadItemId.filter(item => item !== id)
    )
  }
}
