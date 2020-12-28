import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs";
import {IStepInfoModel} from "../models/stepInfo.model";

@Injectable({
  providedIn: 'root'
})
export class StepInfoService {

  private stepInfo: Subject<IStepInfoModel>;

  constructor() {
    this.stepInfo = new Subject<IStepInfoModel>();
  }

  getValue(): Observable<IStepInfoModel> {
    return this.stepInfo.asObservable();
  }
  setValue(newStepInfo): void {
    this.stepInfo.next(newStepInfo);
  }
}
