import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ModalService} from "../../services/modal.service";
import {CalculationsService} from "../../services/calculations.service";
import {ICargoNci, ICargoOwnerInfluenceFactor} from "../../models/calculations.model";
import {AuthenticationService} from "../../services/authentication.service";
import {IAuthModel} from "../../models/auth.model";
import {MathForecastCalcService} from "../../services/math-forecast-calc.service";
import {ConfirmationService, MessageService} from "primeng/api";
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
  selectedCargoNci: any;

  constructor(
    private modalService: ModalService,
    private calculationsService: CalculationsService,
    public authenticationService: AuthenticationService,
    private mathForecastCalcService: MathForecastCalcService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.user = this.authenticationService.userValue;
  }

  ngOnInit(): void {
    this.getCargoNci()
    this.cols = [
      { field: 'id', header: 'id', width: '120px', isStatic :true},
      { field: 'name', header: 'Грузовладельцы', width: 'auto', },
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
      name: rowData.name.replace(/\s+/g, ' ').trim(),
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
          () =>   this.cargoNci = this.cargoNci.filter(cargoNci => cargoNci.id !== id)
        ))
      }
    });
  }
  createCargoNci(){
    if(this.nameNewCargoNci != '') {
      this.subscriptions.add(this.calculationsService.getCreateCargoNci(this.nameNewCargoNci.replace(/\s+/g, ' ').trim()).subscribe(
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

  clearSelectedCargoNci() {
    this.selectedCargoNci = []
  }
//TODO comm
  deleteCargoNciList() {
    this.confirmationService.confirm({
      message: `Удалить ${this.selectedCargoNci.length} грузовладельц(ев)а?`,
      header: 'Удаление грузовладельцев.',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        let massId = []
        for(let item of this.selectedCargoNci){
          massId.push(item.id)
        }
        this.subscriptions.add(this.calculationsService.getCargoList(massId).subscribe(
          () => {
            this.cargoNci = this.cargoNci.filter( ( el ) => !massId.includes( el.id ) );
          },
          error => this.modalService.open(error.error.message),
          () => {
            this.selectedCargoNci = []
            this.messageService.add({severity:'success', summary: 'Успешно!', detail: 'Грузовладелец удален!', life: 6000});
        }
        ))
      }
    });
  }
}
