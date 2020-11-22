import {Component, OnInit} from '@angular/core';
import {MenuItem} from 'primeng/api';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'eert';
  name = 'Сидоров Максим Петрович';
  sidebar: MenuItem[];
  visibleSidebar1: any;

  constructor() {
  }

  ngOnInit(): void {
    this.sidebar = [
      {
      label: 'Исходные данные',
      items: [
        {label: 'Исторические данные объемов перевозок', routerLink: ['shipments/shipmentsUpload'], command: (event) => { this.clickItem(event); }},
        {label: 'Макроэкономические показатели', routerLink: ['macroPok'], command: (event) => { this.clickItem(event); }},
        {label: 'Заявки компаний-грузовладельцев', routerLink: ['cargo/cargoUpload'], command: (event) => { this.clickItem(event); }},
        {label: 'Данные о перспективных кореспонденциях',  routerLink: ['correspondence/correspondUpload'], command: (event) => { this.clickItem(event); }}
      ]
    },
      {
        label: 'Расчеты',
        items:[
          {label: 'Модель прогнозирования', routerLink: [''], command: (event) => { this.clickItem(event); }},
        ]
      },
      {
        label: 'Справочники',
        items:[
          {label: 'Модель прогнозирования', routerLink: [''], command: (event) => { this.clickItem(event); }},
        ]
      }];
  }

  clickItem(event) {
    console.log(event)
        this.visibleSidebar1 = false;
    }
}
