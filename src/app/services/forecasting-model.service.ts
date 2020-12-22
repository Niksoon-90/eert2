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
        sessionId: null
    },
    history: {
      primeryBolChange: false,
      historicalYears: null,
      forecastConfirmed: false
    }
  };

  private paymentComplete = new Subject<any>();

  paymentComplete$ = this.paymentComplete.asObservable();

  getTicketInformation() {
    return this.ticketInformation;
  }

  setTicketInformation(ticketInformation) {
    this.ticketInformation = ticketInformation;
  }

  complete() {
    this.paymentComplete.next(this.ticketInformation.stepOne);
  }
}
