import { Component, OnInit } from '@angular/core';
import {MenuItem} from "primeng/api";
import {AuthenticationService} from "../../services/authentication.service";
import {IAuthModel} from "../../models/auth.model";

@Component({
  selector: 'app-cargo',
  templateUrl: './cargo.component.html',
  styleUrls: ['./cargo.component.scss']
})
export class CargoComponent implements OnInit {

  cargoMenu: MenuItem[];
  user: IAuthModel

  constructor(
    private authenticationService: AuthenticationService,
  ) {
    this.user = this.authenticationService.userValue;
}

  ngOnInit(): void {
    this.cargoMenu = [{ label: 'Просмотреть данные', routerLink: ['data'] }];
    if(this.user.authorities.includes('P_P_p1') === true){this.cargoMenu.unshift({ label: 'Загрузить данные', routerLink: ['cargoUpload'] })}
  }
}
