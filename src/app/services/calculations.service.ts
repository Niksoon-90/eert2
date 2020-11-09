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

  getCalculationMultiple(id: number, idHorizonforecast: number): Observable<ICalculatingPredictiveRegression[]>{
    return this.http.get<ICalculatingPredictiveRegression[]>(this.urlCalc + `api/calc/regression/multiple/${id}?calcYearsNumber=${idHorizonforecast}`)
  }
  getCalculationSimple(id: number, idHorizonforecast: number): Observable<ICalculatingPredictiveRegression[]> {
    return this.http.get<ICalculatingPredictiveRegression[]>(this.urlCalc + `api/calc/regression/simple/${id}?calcYearsNumber=${idHorizonforecast}`)
  }
  getCalculationFiscal(id: number, idHorizonforecast: number, year: string): Observable<ICalculatingPredictiveRegression[]> {
    return this.http.get<ICalculatingPredictiveRegression[]>(this.urlCalc + `api/calc/regression/fiscal/${id}?calcYearsNumber=${idHorizonforecast}&fiscalYear=${year}`)
  }
  getCalculationFixed(id: number, idHorizonforecast: number): Observable<ICalculatingPredictiveRegression[]> {
    return this.http.get<ICalculatingPredictiveRegression[]>(this.urlCalc + `api/calc/regression/tendency/fixed/${id}?calcYearsNumber=${idHorizonforecast}`)
  }
  getCalculationIncreasing(id: number, idHorizonforecast: number): Observable<ICalculatingPredictiveRegression[]> {
    return this.http.get<ICalculatingPredictiveRegression[]>(this.urlCalc + `api/calc/regression/tendency/increasing/${id}?calcYearsNumber=${idHorizonforecast}`)
  }
  getCalculationAverage(id: number, idHorizonforecast: number): Observable<ICalculatingPredictiveRegression[]> {
    return this.http.get<ICalculatingPredictiveRegression[]>(this.urlCalc + `api/calc/regression/average/${id}?calcYearsNumber=${idHorizonforecast}`)
  }
}

