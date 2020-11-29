import { Component, OnInit } from '@angular/core';
import {ModalService} from "../../services/modal.service";
import {CalculationsService} from "../../services/calculations.service";
import {ICargoNci} from "../../models/calculations.model";
import {AuthenticationService} from "../../services/authentication.service";

@Component({
  selector: 'app-cargo-nci',
  templateUrl: './cargo-nci.component.html',
  styleUrls: ['./cargo-nci.component.scss']
})
export class CargoNciComponent implements OnInit {
  cols: any[];
  totalRecords: any;
  cargoNci: ICargoNci[]
  nameNewCargoNci: string = '';

  constructor(
    private modalService: ModalService,
    private calculationsService: CalculationsService,
    public authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.getCargoNci()
    this.cols = [
      { field: 'id', header: 'id', width: '15px', isStatic :true},
      { field: 'name', header: 'Грузовладельцы', width: '100px', },
      { field: 'initialVerificationCoeff', header: 'Коэффициент ', width: '15px', isStatic :true}
    ]
  }
  getCargoNci(){
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

  deleteItemCargoNci(id: number) {
    this.calculationsService.deleteCargoNci(id).subscribe(
      res => console.log(),
      error => this.modalService.open(error.error.message),
      () =>   this.getCargoNci()
    )
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

    }
  }
}
