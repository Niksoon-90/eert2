import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {AuthenticationService} from "../services/authentication.service";

@Component({
  selector: 'app-calculations',
  templateUrl: './calculations.component.html',
  styleUrls: ['./calculations.component.scss']
})
export class CalculationsComponent implements OnInit {

  constructor(
    public authenticationService: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit() {

  }

  new() {
    this.router.navigate(['steps/import'])
  }
}
