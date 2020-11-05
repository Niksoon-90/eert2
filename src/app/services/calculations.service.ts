import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {ICalculatingPredictiveRegression} from "../models/calculations.model";

@Injectable({
  providedIn: 'root'
})
export class CalculationsService {

  constructor(private http: HttpClient) { }

  private url = environment.hostURL;
  private urlCalc = environment.hostCalc;

  getCalculation(id: number, idHorizonforecast: number): Observable<ICalculatingPredictiveRegression[]>{
    return this.http.get<ICalculatingPredictiveRegression[]>(this.urlCalc + `api/calc/regression/${id}?calcYearsNumber=${idHorizonforecast}`)
  }
}
