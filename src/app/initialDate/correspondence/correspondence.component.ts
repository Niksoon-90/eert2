import { Component, OnInit } from '@angular/core';
import {MenuItem} from "primeng/api";
import {AuthenticationService} from "../../services/authentication.service";
import {IAuthModel} from "../../models/auth.model";

@Component({
  selector: 'app-correspondence',
  templateUrl: './correspondence.component.html',
  styleUrls: ['./correspondence.component.scss']
})
export class CorrespondenceComponent implements OnInit {

  correspondenceMenu: MenuItem[];
  user: IAuthModel

  constructor(
    private authenticationService: AuthenticationService
  ) {
    this.user = this.authenticationService.userValue;
  }

  ngOnInit(): void {
    this.correspondenceMenu = [{ label: 'Просмотреть данные', routerLink: ['data'] }];
    if(this.user.authorities.includes('P_P_p1') === true){this.correspondenceMenu.unshift({ label: 'Загрузить данные', routerLink: ['correspondUpload'] })}
  }
}
