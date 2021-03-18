import {Component, OnDestroy, OnInit} from '@angular/core';
import {ShipmentsService} from "../../../services/shipments.service";
import {ModalService} from "../../../services/modal.service";
import {ISession, IShipmentPagination} from "../../../models/shipmenst.model";
import {IAuthModel} from "../../../models/auth.model";
import {AuthenticationService} from "../../../services/authentication.service";
import {map} from "rxjs/operators";
import {ConfirmationService} from "primeng/api";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-data-correspondence',
  templateUrl: './data-correspondence.component.html',
  styleUrls: ['./data-correspondence.component.scss']
})
export class DataCorrespondenceComponent implements OnInit, OnDestroy {
  correspondenceSession: ISession[];
  first = 0;
  rows = 25;
  customers: any;
  loading: boolean = true;
  user: IAuthModel
  sessionId: number = 0
  mathematicalForecastTable: IShipmentPagination;
  dialogVisible: boolean;
  subscriptions: Subscription = new Subscription();

  constructor(
    private shipmentsService: ShipmentsService,
    private modalService: ModalService,
    private authenticationService: AuthenticationService,
    private confirmationService: ConfirmationService,
  ) {
    this.user = this.authenticationService.userValue;
  }

  ngOnInit(): void {
    this.getCorrespondenceSession()
  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  reset() {
    this.first = 0;
    this.getCorrespondenceSession();
  }

  isLastPage(): boolean {
    return this.customers ? this.first === (this.customers.length - this.rows) : true;
  }

  isFirstPage(): boolean {
    return this.customers ? this.first === 0 : true;
  }

  getCorrespondenceSession() {
    this.loading = true;
    if (this.user.authorities.includes('P_P_p5') === true) {
      this.subscriptions.add(this.shipmentsService.getCorrespondenceSession().subscribe(
        res => {
          this.correspondenceSession = res;
          console.log(res)
        },
        error => this.modalService.open(error.error.message),
        () => this.loading = false
      ))
    } else {
      this.subscriptions.add(this.shipmentsService.getCorrespondenceSession()
        .pipe(
          map((data: ISession[]) => {
            if (data.length !== 0) {
              data = data.filter(p => p.userLogin === this.user.user)
            }
            return data
          })
        )
        .subscribe(
          res => {
            this.correspondenceSession = res;
            console.log(this.user.user)
            console.log(res)
          },
          error => this.modalService.open(error.error.message),
          () => this.loading = false
        ))
    }
  }

  openShipItemSession(id: any) {
    this.sessionId = id
    this.loading = true
    this.subscriptions.add(this.shipmentsService.getShipmetsPaginations(id, 0).subscribe(
      res => {
        this.mathematicalForecastTable = res
        this.showDialog();
      },
      error => {
        this.modalService.open(error.error.message);
      },
      () => console.log('sdsds')
    ))
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

  removeShipSession(id: number, name: string) {
    this.confirmationService.confirm({
      message: `Вы уверенны, что хотите удалить данные о перспективных корреспонденция: ${name}?`,
      header: `Удалить ${name}?`,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.loading = true
        this.subscriptions.add(this.shipmentsService.deleteShipSession(id).subscribe(
          () => this.getCorrespondenceSession(),
          error => {
            this.modalService.open(error.error.message);
            this.loading = false;
          },
          () => this.loading = false
        ))
      }
    });
  }

  prev() {
    this.first = this.first - this.rows;
  }
  next() {
    this.first = this.first + this.rows;
  }
}
