import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ForecastingModelService {

  ticketInformation = {
    stepOne: {
      Session: 0,
      calcYearsNumber: 0,
      idCargo: 0,
      id: null
    },
    stepThree: {
        forecastingStrategy: null,
        yearsSession: null
    },
    paymentInformation: {
      cardholderName:'',
      cardholderNumber:'',
      date:'',
      cvv:'',
      remember:false
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
