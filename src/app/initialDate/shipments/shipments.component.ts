import { Component, OnInit } from '@angular/core';
import {MenuItem} from 'primeng/api';
import {AuthenticationService} from "../../services/authentication.service";
import {IAuthModel} from "../../models/auth.model";

@Component({
  selector: 'app-shipments',
  templateUrl: './shipments.component.html',
  styleUrls: ['./shipments.component.scss']
})
export class ShipmentsComponent implements OnInit {

  shipmentsMenu: MenuItem[];
  user: IAuthModel

  constructor(
    private authenticationService: AuthenticationService
  ) {
    this.user = this.authenticationService.userValue;
  }

  ngOnInit(): void {
    this.shipmentsMenu = [ { label: 'Просмотреть данные', routerLink: ['data'] }]
    if(this.user.authorities.includes('P_P_p1') === true){this.shipmentsMenu.unshift({ label: 'Загрузить данные', routerLink: ['shipmentsUpload'] })}
  }
}
