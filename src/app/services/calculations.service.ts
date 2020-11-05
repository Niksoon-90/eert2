import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CalculationsService {

  constructor(private http: HttpClient) { }

  private url = environment.hostURL;
  private urlCalc = environment.hostCalc;

  getTest(id: number, idHorizonforecast: number){
    return this.http.get(this.urlCalc + `api/calc/regression/${id}?calcYearsNumber=${idHorizonforecast}`)
  }
}
