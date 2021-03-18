import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {ShipmentsService} from "../../../services/shipments.service";
import {ModalService} from "../../../services/modal.service";
import {ISynonym} from "../../../models/shipmenst.model";
import {IAuthModel} from "../../../models/auth.model";
import {AuthenticationService} from "../../../services/authentication.service";
import {ConfirmationService} from "primeng/api";
import {Subscription} from "rxjs";

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
  subscriptions: Subscription = new Subscription();

  constructor(
    public authenticationService: AuthenticationService,
    private shipmentsService: ShipmentsService,
    private modalService: ModalService,
    private confirmationService: ConfirmationService,
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

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  getSynonymAll(cargoOwnerId: number){
    this.subscriptions.add(this.shipmentsService.getSynonym(cargoOwnerId)
      .subscribe(
      res => this.synonym = res,
      error => this.modalService.open(error.error.message),
        () => {
          if (this.synonym === null) {
            this.synonym = []
          }
        }
    ))
  }

  deleteSynonymItem(cargoOwnerSynonymId: number, name: string){
    this.confirmationService.confirm({
      message: `Вы уверенны, что хотите удалить синоним: ${name}?`,
      header: 'Удаление синонима',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.subscriptions.add(this.shipmentsService.deletetSynonym(cargoOwnerSynonymId).subscribe(
          () => console.log(),
          error => this.modalService.open(error.error.message),
          () => this.getSynonymAll(this.cargoOwnerId)
        ))
      }
    });

  }

  createSysonym() {
    this.subscriptions.add(this.shipmentsService.postSynonym(this.cargoOwnerId, this.nameNewSysonym).subscribe(
      () => console.log(),
      error => this.modalService.open(error.error.message),
      () => {
        this.nameNewSysonym = ''
        this.getSynonymAll(this.cargoOwnerId)
      }
    ))
  }
}
