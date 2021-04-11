import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs";

export interface IShipmentInfo {
  sessionId: number,
  currentPage: number,
  rows: number,
  sortField?: string,
  sortOrder?: string
}

@Injectable({
  providedIn: 'root'
})


export class TestService {

  private shipmentInfo: Subject<IShipmentInfo>;

  constructor() {
    this.shipmentInfo = new Subject<IShipmentInfo>();
  }

  getValueShipmentInfo(): Observable<IShipmentInfo> {
    return this.shipmentInfo.asObservable();
  }
  setValueShipmentInfo(newStepInfo): void {
    this.shipmentInfo.next(newStepInfo);
  }
}
