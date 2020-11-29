import { Component, OnInit } from '@angular/core';
import {MenuItem} from 'primeng/api';
import {AuthenticationService} from "../../services/authentication.service";

@Component({
  selector: 'app-shipments',
  templateUrl: './shipments.component.html',
  styleUrls: ['./shipments.component.scss']
})
export class ShipmentsComponent implements OnInit {

  shipmentsMenu: MenuItem[];
  constructor(
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.shipmentsMenu = [ { label: 'Просмотреть данные', routerLink: ['data'] }]
    if(!this.authenticationService.auth.authorities.includes('P_P_p1') === false){this.shipmentsMenu.unshift({ label: 'Загрузить данные', routerLink: ['shipmentsUpload'] })}
  }
}
