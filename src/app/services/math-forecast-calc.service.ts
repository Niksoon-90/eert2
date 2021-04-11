import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs";
import {IShipment} from "../models/shipmenst.model";
import {ICargoOwnerInfluenceFactor} from "../models/calculations.model";

@Injectable({
  providedIn: 'root'
})
export class MathForecastCalcService {

  private cargoOwnerInfluenceFactor: Subject<ICargoOwnerInfluenceFactor[]>;

  constructor() {
    this.cargoOwnerInfluenceFactor = new Subject<ICargoOwnerInfluenceFactor[]>();
  }

  getValue(): Observable<ICargoOwnerInfluenceFactor[]> {
    return this.cargoOwnerInfluenceFactor.asObservable();
  }
  setValue(newCargoOwnerInfluenceFactor): void {
    this.cargoOwnerInfluenceFactor.next(newCargoOwnerInfluenceFactor);
  }

}
