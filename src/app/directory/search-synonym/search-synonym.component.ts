import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {ModalService} from "../../services/modal.service";
import {ShipmentsService} from "../../services/shipments.service";

@Component({
  selector: 'app-search-synonym',
  templateUrl: './search-synonym.component.html',
  styleUrls: ['./search-synonym.component.scss']
})
export class SearchSynonymComponent implements OnInit, OnDestroy {
  nameSearchSynonym: string;
  synonymNci: any
  searchSynSub: Subscription
  loadingSynonymTable: boolean = false;

  constructor(
    private modalService: ModalService,
    private shipmentsService: ShipmentsService
  ) { }

  ngOnInit(): void {

  }
ngOnDestroy() {
    if(this.searchSynSub){
      this.searchSynSub.unsubscribe()
    }
}

  searchSynonym() {
    this.loadingSynonymTable = true
    this.searchSynSub = this.shipmentsService.postSearchSynonym(this.nameSearchSynonym).subscribe(
      res => this.synonymNci = res,
      error => this.modalService.open(error.error.message),
      () => {
        this.nameSearchSynonym = ''
        this.loadingSynonymTable = false
      }
    )
  }
}
