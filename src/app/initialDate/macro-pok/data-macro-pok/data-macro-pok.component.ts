import {Component, OnInit} from '@angular/core';
import {MenuItem} from "primeng/api";
import {IAuthModel} from "../../../models/auth.model";
import {AuthenticationService} from "../../../services/authentication.service";

@Component({
  selector: 'app-data-macro-pok',
  templateUrl: './data-macro-pok.component.html',
  styleUrls: ['./data-macro-pok.component.scss']
})
export class DataMacroPokComponent implements OnInit {

  makroPokMenu: MenuItem[];
  user: IAuthModel

  constructor(
    private authenticationService: AuthenticationService
  ) {
    this.user = this.authenticationService.userValue;
  }

  ngOnInit(): void {
    this.makroPokMenu = [{label: 'Просмотреть данные', routerLink: ['data']}];
    if (this.user.authorities.includes('P_P_p1') === true) {
      this.makroPokMenu.unshift({label: 'Загрузить данные', routerLink: ['macroUpload']})
    }
  }
}
