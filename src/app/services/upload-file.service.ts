import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {

  constructor(private http: HttpClient) {
  }

  private url = environment.hostCalc;

  getDownload(sessionId: number, reportType: string){
    return this.http.get<Blob>(this.url + `api/reports/download/${sessionId}?reportType=${reportType}`, { observe: 'response', responseType: 'blob' as 'json' } )
  }
  getDownloadTotal(sessionId: number, iasForecastPrimaryId: number, iasForecastSecondaryId: number){
    return this.http.get<Blob>(this.url + `api/reports/download/routes/total?iasForecastPrimaryId=${iasForecastPrimaryId}&iasForecastSecondaryId=${iasForecastSecondaryId}&sessionId=${sessionId}`, { observe: 'response', responseType: 'blob' as 'json' } )

  }
  getDownloadIasCalc(sessionId: number, iasId:number, reportType: string){
    return this.http.get<Blob>(this.url + `api/reports/download/ias/${iasId}?reportType=${reportType}&sessionId=${sessionId}`, { observe: 'response', responseType: 'blob' as 'json' })
  }
}
