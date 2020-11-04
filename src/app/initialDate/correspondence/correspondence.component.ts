import { Component, OnInit } from '@angular/core';
import {MenuItem} from "primeng/api";

@Component({
  selector: 'app-correspondence',
  templateUrl: './correspondence.component.html',
  styleUrls: ['./correspondence.component.scss']
})
export class CorrespondenceComponent implements OnInit {

  correspondenceMenu: MenuItem[];
  constructor() { }

  ngOnInit(): void {
    this.correspondenceMenu = [
      { label: 'Загрузить данные', routerLink: ['correspondUpload'] },
      { label: 'Просмотреть данные', routerLink: ['data'] },
    ];
  }
}
