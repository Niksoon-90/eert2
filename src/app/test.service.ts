import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TestService {

  or = {
    step1: null,
    step2: null,
  }
  tt ={
    step1: null
  }



private paymentComplete = new Subject<any>();

paymentComplete$ = this.paymentComplete.asObservable();

getTicketInformation() {
  return this.or;
}
start(item) {
  delete item.senderName
  this.tt.step1 = JSON.stringify(item);
  return true
}

}
