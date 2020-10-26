import { Component, OnInit } from '@angular/core';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-shipments',
  templateUrl: './shipments.component.html',
  styleUrls: ['./shipments.component.scss']
})
export class ShipmentsComponent implements OnInit {

  shipmentsMenu: MenuItem[];
  constructor() { }

  ngOnInit(): void {
    this.shipmentsMenu = [
      { label: 'Загрузить данные', routerLink: ['/shipments/upload'] },
      { label: 'Просмотреть данные', routerLink: ['/shipments/data'] },
    ];
  }
}
