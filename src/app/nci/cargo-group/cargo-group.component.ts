import {Component, OnDestroy, OnInit} from '@angular/core';
import {ICargoGroupNci, IDorogyNci} from "../../models/calculations.model";
import {IAuthModel} from "../../models/auth.model";
import {AuthenticationService} from "../../services/authentication.service";
import {ModalService} from "../../services/modal.service";
import {ShipmentsService} from "../../services/shipments.service";
import {ConfirmationService} from "primeng/api";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-cargo-group',
  templateUrl: './cargo-group.component.html',
  styleUrls: ['./cargo-group.component.scss']
})
export class CargoGroupComponent implements OnInit, OnDestroy {

  cols: any[];
  totalRecords: any;
  cargoGroupNci: ICargoGroupNci[]
  nameNewCargoGroupNci: string = '';
  user: IAuthModel
  subscriptions: Subscription = new Subscription();


  constructor(
    public authenticationService: AuthenticationService,
    private modalService: ModalService,
    private shipmentsService: ShipmentsService,
    private confirmationService: ConfirmationService,
  ) {
    this.user = this.authenticationService.userValue;
  }
  ngOnInit(): void {
    this.getCargoGroupNci();
    this.cols = [
      { field: 'name', header: 'Группа грузов', width: 'auto', isStatic :true}
    ]
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  createCargoGroupNci() {
    if(this.nameNewCargoGroupNci !== ''){
      this.subscriptions.add(this.shipmentsService.postDictionaryCargo(this.nameNewCargoGroupNci).subscribe(
        () => console.log(),
        error => this.modalService.open(error.error.message),
        () => {
          this.nameNewCargoGroupNci = '',
          this.getCargoGroupNci()
        }
      ))
    }else{
      this.modalService.open('Укажите наименование группы грузов!')
    }
  }
  getCargoGroupNci() {
    this.subscriptions.add(this.shipmentsService.getDictionaryCargo().subscribe(
      res =>  this.cargoGroupNci =res,
      error => this.modalService.open(error.error.message),
    ))
  }

  onRowEditInit() {

  }

  onRowEditSave(rowData) {
    const cargoGroupNci: ICargoGroupNci = {
     id: rowData.id,
     name: rowData.name
    }
    this.subscriptions.add(this.shipmentsService.putDictionaryCargo(cargoGroupNci).subscribe(
      () => console.log(),
      error => this.modalService.open(error.error.message),
    ))
  }

  onRowEditCancel() {

  }

  deleteItemCargoNci(id: any, name: string) {
    this.confirmationService.confirm({
      message: `Вы уверенны, что хотите удалить группу груза: ${name}?`,
      header: 'Удаление группы груза',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.subscriptions.add(this.shipmentsService.deleteDictionaryCargo(id).subscribe(
          () => console.log(),
          error => this.modalService.open(error.error.message),
          () => this.getCargoGroupNci()
        ))
      }
    });
  }
}
