import {Component, OnInit} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {AuthenticationService} from "./services/authentication.service";
import {Router} from "@angular/router";
import {IAuthModel} from "./models/auth.model";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'eert';
  name = '';
  sidebar: MenuItem[];
  visibleSidebar1: any;
  user: IAuthModel

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {
    //this.authenticationService.getMe().subscribe(res => this.authenticationService.auth = res);
  //  this.user = this.authenticationService.userValue;
  }

  ngOnInit(): void {
    console.log('user', this.user)





    // this.authenticationService.getMe().subscribe(
    //   res => {
    //     this.authenticationService.auth = res;
    //     this.name = res['fio']
    //   },
    //   error => console.log(error.error.message),
    //   () => console.log(this.authenticationService.auth)
    // )


    this.sidebar = [
      {
      label: 'Исходные данные',
      items: [
        {label: 'Исторические данные объемов перевозок', routerLink: ['shipments/data'], command: () => { this.clickItem(); }},
        {label: 'Макроэкономические показатели', routerLink: ['macroPok'], command: () => { this.clickItem(); }},
        {label: 'Заявки компаний-грузовладельцев', routerLink: ['cargo/data'], command: () => { this.clickItem(); }},
        {label: 'Данные о перспективных кореспонденциях',  routerLink: ['correspondence/data'], command: () => { this.clickItem(); }},

      ]
    },
      {
        label: 'Справочники',
        items:[
          {label: 'Факторы влияния', routerLink: ['directory'], command: () => { this.clickItem(); }},
          {label: 'Дороги, станции', },
          {label: 'Группы грузов', },
        ]
      }
      ]
    if(this.authenticationService.auth.authorities.includes('P_P_p3') === true){
      this.sidebar.splice(1, 0,
        {
          label: 'Расчеты',
          items:[
            {label: 'Модель прогнозирования', routerLink: [''], command: () => { this.clickItem(); }},
          ]
        }
      )
    }
  }

  clickItem() {
        this.visibleSidebar1 = false;
    }
  logout() {
    this.authenticationService.logout();
    this.router.navigate(['http://192.168.11.180:8080/logout']);
  }
}
