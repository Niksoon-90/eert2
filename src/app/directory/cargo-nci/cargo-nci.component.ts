import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ModalService} from "../../services/modal.service";
import {CalculationsService} from "../../services/calculations.service";
import {ICargoNci, ICargoOwnerInfluenceFactor, IInfluenceNci} from "../../models/calculations.model";
import {AuthenticationService} from "../../services/authentication.service";
import {IAuthModel} from "../../models/auth.model";
import {MathForecastCalcService} from "../../services/math-forecast-calc.service";
import {ShipmentsService} from "../../services/shipments.service";
import {ConfirmationService} from "primeng/api";


@Component({
  selector: 'app-cargo-nci',
  templateUrl: './cargo-nci.component.html',
  styleUrls: ['./cargo-nci.component.scss']
})
export class CargoNciComponent implements OnInit {
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
  getCargoNci(){
    console.log('sdsdsdsds')
      this.calculationsService.getAllCargoNci().subscribe(
        res => this.cargoNci = res,
        error => this.modalService.open(error.error.message),
      )
  }
  onRowEditInit() {
  }

  onRowEditSave(rowData) {
    const itemCargoNci: ICargoNci = {
      id: rowData.id,
      name: rowData.name,
      initialVerificationCoeff: rowData.initialVerificationCoeff
    }
    this.calculationsService.putCargoNci(itemCargoNci).subscribe(
      res => console.log(),
      error => this.modalService.open(error.error.message),
    )
  }

  onRowEditCancel() {
  }

  deleteItemCargoNci(id: number, name: string) {
    this.confirmationService.confirm({
      message: `Вы уверенны, что хотите удалить грузовладельца: ${name}?`,
      header: 'Удаление грузовладельца',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.calculationsService.deleteCargoNci(id).subscribe(
          res => console.log(),
          error => this.modalService.open(error.error.message),
          () =>   this.getCargoNci()
        )
      }
    });
  }
  createCargoNci(){
    if(this.nameNewCargoNci != '') {
      this.calculationsService.getCreateCargoNci(this.nameNewCargoNci).subscribe(
        res => console.log(),
        error => {
          this.modalService.open(error.error.message);
          this.nameNewCargoNci = '';
        },
        () => {
          this.nameNewCargoNci = '';
          this.getCargoNci();
        }
      )
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
    this.calculationsService.getAllFactorCargoId(id)
      .subscribe(
        res => this.influenceNci = res,
        error => this.modalService.open(error.error.message),
        () => this.mathForecastCalcService.setValue(this.influenceNci)
      )
  }
}
