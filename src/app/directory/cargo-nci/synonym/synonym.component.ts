import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {ShipmentsService} from "../../../services/shipments.service";
import {ModalService} from "../../../services/modal.service";
import {ISynonym} from "../../../models/shipmenst.model";
import {IAuthModel} from "../../../models/auth.model";
import {AuthenticationService} from "../../../services/authentication.service";

@Component({
  selector: 'app-synonym',
  templateUrl: './synonym.component.html',
  styleUrls: ['./synonym.component.scss']
})
export class SynonymComponent implements OnInit, OnChanges {
  @Input() cargoOwnerId


  synonym: ISynonym[]
  user: IAuthModel
  nameNewSysonym: string;
  cols: any;

  constructor(
    public authenticationService: AuthenticationService,
    private shipmentsService: ShipmentsService,
    private modalService: ModalService
  ) {
    this.user = this.authenticationService.userValue;
  }
  ngOnChanges() {

  }

  ngOnInit(): void {
    this.cols = [
      { field: 'name', header: 'Синонимы', width: 'auto', isStatic :true}
    ]
    this.getSynonymAll(this.cargoOwnerId);
  }
  getSynonymAll(cargoOwnerId: number){
    this.shipmentsService.getSynonym(cargoOwnerId)
      .subscribe(
      res => {
        this.synonym = res,
          console.log(res)
      },
      error => this.modalService.open(error.error.message),
        () => {
          if (this.synonym === null) {
            this.synonym = []
          }
        }
    )
  }
  deleteSynonymItem(cargoOwnerSynonymId: number){
    this.shipmentsService.deletetSynonym(cargoOwnerSynonymId).subscribe(
      res => console.log(),
      error => this.modalService.open(error.error.message),
      () => this.getSynonymAll(this.cargoOwnerId)
    )
  }

  createSysonym() {
    this.shipmentsService.postSynonym(this.cargoOwnerId, this.nameNewSysonym).subscribe(
      res => console.log(),
      error => this.modalService.open(error.error.message),
      () => {
        this.nameNewSysonym = '',
          this.getSynonymAll(this.cargoOwnerId)
      }
    )
  }
}
