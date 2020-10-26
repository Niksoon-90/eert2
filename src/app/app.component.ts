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

  constructor() {
  }

  ngOnInit(): void {
    this.sidebar = [
      {
      label: 'Исходные данные',
      items: [
        {label: 'Исторические данные объемов перевозок', routerLink: ['/shipments']},
        {label: 'Макроэкономические показатели', routerLink: ['/']},
        {label: 'Заявки компаний-грузовладельцев', routerLink: ['/']},
        {label: 'Данные о перспективных кореспонденциях',  routerLink: ['/']}
      ]
    },
      {
        label: 'Расчеты'
      }];
  }

}
