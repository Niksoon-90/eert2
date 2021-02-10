import {Component, DoCheck, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {ModalService} from "../services/modal.service";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit, DoCheck {

  display$: Observable<'open' | 'close'>;
  erroMessage: string;

  constructor(
    private modalService: ModalService
  ) {}

  ngDoCheck(){
    this.erroMessage = this.modalService.errorMessage;
  }
  ngOnInit() {
    this.display$ = this.modalService.watch();
  }

  close() {
    this.modalService.close();
  }

  closeConfirm() {
    this.modalService.close();
    return false
  }
}
