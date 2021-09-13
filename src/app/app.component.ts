import {Component, OnInit} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {AuthenticationService} from "./services/authentication.service";
import {Router} from "@angular/router";
import {IAuthModel} from "./models/auth.model";
import {ModalService} from "./services/modal.service";


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
    private router: Router,
    private modalService: ModalService
  ) {}


  ngOnInit(): void {
      this.authenticationService.getMe().subscribe(
        res => console.log('res', res),
        error => this.modalService.open(error.error.message),
        () => this.test());
      this.authenticationService.user.subscribe(
        res => this.user = res,
        error => this.modalService.open(error.error.message),
        () => this.test());
       this.user = this.authenticationService.userValue;

    this.sidebar = [
      {
      label: 'Исходные данные',
      items: [
        {label: 'Исторические данные объемов перевозок', routerLink: ['shipments/data'], command: () => { this.clickItem(); }},
        {label: 'Макроэкономические показатели', routerLink: ['macroPok/data'], command: () => { this.clickItem(); }},
        {label: 'Заявки компаний-грузовладельцев', routerLink: ['cargo/data'], command: () => { this.clickItem(); }},
        {label: 'Данные о перспективных кореспонденциях',  routerLink: ['correspondence/data'], command: () => { this.clickItem(); }},
        {label: 'Расчеты (модель прогнозирования)',  routerLink: ['payments'], command: () => { this.clickItem(); }},

      ]
    },
      {
        label: 'Справочники',
        items:[
          {label: 'Грузовладельцы, факторы', routerLink: ['directory'], command: () => { this.clickItem(); }},
          {label: 'НСИ', routerLink: ['nci'], command: () => { this.clickItem(); }},
          {label: 'Станции', routerLink: ['station'], command: () => { this.clickItem(); }},
        ]
      }
      ]
  }
  test(){
    if(this.user.authorities.includes('P_P_p3') === true){
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
    //TODO LogOut
  logout() {
    this.authenticationService.logout();
    this.router.navigate(['logOut']);
  }
}
