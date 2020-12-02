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
}
