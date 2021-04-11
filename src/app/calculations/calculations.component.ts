import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {AuthenticationService} from "../services/authentication.service";
import {IAuthModel} from "../models/auth.model";
import {ForecastingModelService} from "../services/forecasting-model.service";

@Component({
  selector: 'app-calculations',
  templateUrl: './calculations.component.html',
  styleUrls: ['./calculations.component.scss']
})
export class CalculationsComponent implements OnInit {

  user: IAuthModel

  constructor(
    public authenticationService: AuthenticationService,
    public forecastModelService: ForecastingModelService,
    private router: Router
  ) {
    this.user = this.authenticationService.userValue;
  }

  ngOnInit() { }

  new() {
    const ticketInformation = {
        stepOne: {
          Session: null,
          calcYearsNumber: 0,
          scenarioMacro: null,
          correspondenceSession: null,
          cargoSessionSender: null,
          cargoSessionReceiver: null,
          oilCargo: null,
          metallurgy: null,
          ore: null,
          nameNewShip: null,
          oldSessionId: null,
          newSessionId: null,
        },
        stepThree: {
          forecastingStrategy: null,
          yearsSession: null,
          primeryBolChange: false,
          sessionId: null,
          calculated: false,
          mathematicalForecastTable: null
        },
        history: {
          historicalName: null,
          primeryBolChange: false,
          historicalYears: null,
          forecastConfirmed: false,
          firstRouteId: 0,
          secondRouteId: 0,
          allCorrespondensRouteId: 0
        }
    };
    this.forecastModelService.ticketInformation = ticketInformation;
    this.router.navigate(['steps/import'])
  }
}
