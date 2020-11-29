import { Component, OnInit } from '@angular/core';
import {MenuItem} from "primeng/api";
import {AuthenticationService} from "../../services/authentication.service";

@Component({
  selector: 'app-cargo',
  templateUrl: './cargo.component.html',
  styleUrls: ['./cargo.component.scss']
})
export class CargoComponent implements OnInit {

  cargoMenu: MenuItem[];
  constructor(
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.cargoMenu = [{ label: 'Просмотреть данные', routerLink: ['data'] }];
    if(!this.authenticationService.auth.authorities.includes('P_P_p1') === false){this.cargoMenu.unshift({ label: 'Загрузить данные', routerLink: ['cargoUpload'] })}
  }
}
