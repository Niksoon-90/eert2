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
        {label: 'Макроэкономические показатели', routerLink: ['/macroPok']},
        {label: 'Заявки компаний-грузовладельцев', routerLink: ['/cargo']},
        {label: 'Данные о перспективных кореспонденциях',  routerLink: ['/correspondence']}
      ]
    },
      {
        label: 'Расчеты',
        items:[
          {label: 'Модель прогнозирования', routerLink: ['/calculations']},
        ]
      },
      {
        label: 'Справочники'
      }];
  }

}
