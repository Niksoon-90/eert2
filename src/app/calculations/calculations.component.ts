import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {AuthenticationService} from "../services/authentication.service";
import {IAuthModel} from "../models/auth.model";

@Component({
  selector: 'app-calculations',
  templateUrl: './calculations.component.html',
  styleUrls: ['./calculations.component.scss']
})
export class CalculationsComponent implements OnInit {
  user: IAuthModel
  constructor(
    public authenticationService: AuthenticationService,
    private router: Router
  ) {
    this.user = this.authenticationService.userValue;
  }

  ngOnInit() {

  }

  new() {
    this.router.navigate(['steps/import'])
  }
}
