import { Component, OnInit } from '@angular/core';
import {MenuItem} from "primeng/api";
import {AuthenticationService} from "../../services/authentication.service";

@Component({
  selector: 'app-correspondence',
  templateUrl: './correspondence.component.html',
  styleUrls: ['./correspondence.component.scss']
})
export class CorrespondenceComponent implements OnInit {

  correspondenceMenu: MenuItem[];
  constructor(
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.correspondenceMenu = [{ label: 'Просмотреть данные', routerLink: ['data'] }];
    if(!this.authenticationService.auth.authorities.includes('P_P_p1') === false){this.correspondenceMenu.unshift({ label: 'Загрузить данные', routerLink: ['correspondUpload'] })}
  }
}
