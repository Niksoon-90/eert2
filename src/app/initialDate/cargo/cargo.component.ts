import { Component, OnInit } from '@angular/core';
import {MenuItem} from "primeng/api";

@Component({
  selector: 'app-cargo',
  templateUrl: './cargo.component.html',
  styleUrls: ['./cargo.component.scss']
})
export class CargoComponent implements OnInit {

  cargoMenu: MenuItem[];
  constructor() { }

  ngOnInit(): void {
    this.cargoMenu = [
      { label: 'Загрузить данные', routerLink: ['cargoUpload'] },
      { label: 'Просмотреть данные', routerLink: ['data'] },
    ];
  }
}
