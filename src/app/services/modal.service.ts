import {Injectable} from '@angular/core';

import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  errorMessage: string;
  private display: BehaviorSubject<'open' | 'close'> =
    new BehaviorSubject('close');

  watch(): Observable<'open' | 'close'> {
    return this.display.asObservable();
  }

  open(error: string) {
    this.errorMessage = error;
    this.display.next('open');
  }

  close() {
    this.errorMessage = '';
    this.display.next('close');
  }
}
