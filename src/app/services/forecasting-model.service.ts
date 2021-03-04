import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ForecastingModelService {

  ticketInformation = {
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
        calculated: false
    },
    history: {
      historicalName: null,
      primeryBolChange: false,
      historicalYears: null,
      forecastConfirmed: false,
      firstRouteId: 0,
      secondRouteId: 0,
      allCorrespondensRouteId: 0,
    }
  };


  getTicketInformation() {
    return this.ticketInformation;
  }

  setTicketInformation(ticketInformation) {
    this.ticketInformation = ticketInformation;
  }

}
