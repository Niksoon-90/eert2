import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ModalService} from "../../services/modal.service";
import {CalculationsService} from "../../services/calculations.service";
import {ICargoNci, ICargoOwnerInfluenceFactor} from "../../models/calculations.model";
import {AuthenticationService} from "../../services/authentication.service";
import {IAuthModel} from "../../models/auth.model";
import {MathForecastCalcService} from "../../services/math-forecast-calc.service";
import {ConfirmationService} from "primeng/api";
import {Subscription} from "rxjs";


@Component({
  selector: 'app-cargo-nci',
  templateUrl: './cargo-nci.component.html',
  styleUrls: ['./cargo-nci.component.scss']
})
export class CargoNciComponent implements OnInit, OnDestroy {

  @ViewChild('fileUpload') fileUpload: any;

  cols: any[];
  totalRecords: any;
  cargoNci: ICargoNci[]
  nameNewCargoNci: string = '';
  user: IAuthModel
  displayMaximizable: boolean;
  cargoOwnerId: number
  cargoOwnerName: string
  displayPosition: boolean;
  position: string;
  uploadFileNsi: string
  influenceNci: ICargoOwnerInfluenceFactor[];
  subscriptions: Subscription = new Subscription();

  constructor(
    private modalService: ModalService,
    private calculationsService: CalculationsService,
    public authenticationService: AuthenticationService,
    private mathForecastCalcService: MathForecastCalcService,
    private confirmationService: ConfirmationService,
  ) {
    this.user = this.authenticationService.userValue;
  }

  ngOnInit(): void {
    this.getCargoNci()
    this.cols = [
      { field: 'id', header: 'id', width: '120px', isStatic :true},
      { field: 'name', header: 'Грузовладельцы', width: 'auto', },
      { field: 'initialVerificationCoeff', header: 'Коэффициент ', width: '150px', isStatic :true}
    ]
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  getCargoNci(){
    this.subscriptions.add(this.calculationsService.getAllCargoNci().subscribe(
        res => this.cargoNci = res,
        error => this.modalService.open(error.error.message),
      ))
  }
  onRowEditInit() {
  }

  onRowEditSave(rowData) {
    const itemCargoNci: ICargoNci = {
      id: rowData.id,
      name: rowData.name,
      initialVerificationCoeff: rowData.initialVerificationCoeff
    }
    this.subscriptions.add(this.calculationsService.putCargoNci(itemCargoNci).subscribe(
      () => console.log(),
      error => this.modalService.open(error.error.message),
    ))
  }

  onRowEditCancel() {
  }

  deleteItemCargoNci(id: number, name: string) {
    this.confirmationService.confirm({
      message: `Вы уверенны, что хотите удалить грузовладельца: ${name}?`,
      header: 'Удаление грузовладельца',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.subscriptions.add(this.calculationsService.deleteCargoNci(id).subscribe(
          () => console.log(),
          error => this.modalService.open(error.error.message),
          () =>   this.getCargoNci()
        ))
      }
    });
  }
  createCargoNci(){
    if(this.nameNewCargoNci != '') {
      this.subscriptions.add(this.calculationsService.getCreateCargoNci(this.nameNewCargoNci).subscribe(
        () => console.log(),
        error => {
          this.modalService.open(error.error.message);
          this.nameNewCargoNci = '';
        },
        () => {
          this.nameNewCargoNci = '';
          this.getCargoNci();
        }
      ))
    } else{
      this.modalService.open('Заполните поле Грузовладелец!')
    }
  }

  showMaximizableDialog(id: number, name: string) {
    this.cargoOwnerName = name;
    this.cargoOwnerId = id;
    this.displayMaximizable = true;
  }

  closeModal() {
    this.cargoOwnerId = 0;
    this.displayMaximizable=false
  }

  showPositionDialog(position: string) {
    this.uploadFileNsi = 'synonym'
    this.position = position;
    this.displayPosition = true;
  }

  closeModalUpload() {
    this.uploadFileNsi = '';
    this.displayPosition=false
  }

  updateCargoNci(event: string) {
    this.getCargoNci();
  }

  factor(id: number) {
    this.subscriptions.add(this.calculationsService.getAllFactorCargoId(id)
      .subscribe(
        res => this.influenceNci = res,
        error => this.modalService.open(error.error.message),
        () => this.mathForecastCalcService.setValue(this.influenceNci)
      ))
  }
}
