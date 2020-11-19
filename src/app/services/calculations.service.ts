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

  getCalculationMultiple(id: number, idHorizonforecast: number, type: string): Observable<ICalculatingPredictiveRegression[]>{
    return this.http.get<ICalculatingPredictiveRegression[]>(this.urlCalc + `api/calc/regression/multiple/${id}?calcYearsNumber=${idHorizonforecast}&macroScenarioType=${type}`)
  }
  getCalculationSimple(id: number, idHorizonforecast: number): Observable<ICalculatingPredictiveRegression[]> {
    return this.http.get<ICalculatingPredictiveRegression[]>(this.urlCalc + `api/calc/correspondence/simple/${id}?calcYearsNumber=${idHorizonforecast}`)
  }
  getCalculationFiscal(id: number, idHorizonforecast: number, year: string): Observable<ICalculatingPredictiveRegression[]> {
    return this.http.get<ICalculatingPredictiveRegression[]>(this.urlCalc + `api/calc/correspondence/fiscal/${id}?calcYearsNumber=${idHorizonforecast}&fiscalYear=${year}`)
  }
  getCalculationFixed(id: number, idHorizonforecast: number): Observable<ICalculatingPredictiveRegression[]> {
    return this.http.get<ICalculatingPredictiveRegression[]>(this.urlCalc + `api/calc/correspondence/tendency/fixed/${id}?calcYearsNumber=${idHorizonforecast}`)
  }
  getCalculationIncreasing(id: number, idHorizonforecast: number): Observable<ICalculatingPredictiveRegression[]> {
    return this.http.get<ICalculatingPredictiveRegression[]>(this.urlCalc + `api/calc/correspondence/tendency/increasing/${id}?calcYearsNumber=${idHorizonforecast}`)
  }
  getCalculationAverage(id: number, idHorizonforecast: number): Observable<ICalculatingPredictiveRegression[]> {
    return this.http.get<ICalculatingPredictiveRegression[]>(this.urlCalc + `api/calc/correspondence/average/${id}?calcYearsNumber=${idHorizonforecast}`)
  }
  getCorrelation(idHorizonforecast: number): Observable<ICalculatingPredictiveRegression[]>{
    return this.http.get<ICalculatingPredictiveRegression[]>(this.urlCalc + `api/calc/correlation/${idHorizonforecast}?forecastType=LESS_SQUARE`)
  }
  getPerspective(sessionId: number,perspectiveSessionId: number ): Observable<ICalculatingPredictiveRegression[]>{
    return this.http.get<ICalculatingPredictiveRegression[]>(this.urlCalc + `api/calc/correspondence/perspective?perspectiveSessionId=${perspectiveSessionId}&sessionId=${sessionId}`)
  }
  // getOil(){
  //   return this.http.get()
  // }
  // getMetallurgy(){
  //   return this.http.get()
  // }
  // getOre(){
  //   return this.http.get()
  // }
}
