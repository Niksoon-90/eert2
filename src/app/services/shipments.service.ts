import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from 'rxjs';
import {ISession, IShipment} from '../models/shipmenst.model';
import {IMacroPokModel} from "../models/macroPok.model";

@Injectable({
  providedIn: 'root'
})
export class ShipmentsService {

  constructor(private http: HttpClient) {
  }

  private url = environment.hostURL;

  postUploadFile(fd, fileName: string, type: string) {
    return this.http.post<any>(this.url + `api/shipments/file/upload?fileType=${type}&name=${fileName}`, fd, {
      reportProgress: true,
      observe: "events"
    });
  }

  getShipSession(): Observable<ISession[]> {
   return this.http.get<ISession[]>(this.url + `api/shipments/file/all/`);
  }
  deleteShipSession(id: number){
    return this.http.delete(this.url + `api/session/${id}`)
  }
  getShipments(id: number): Observable<IShipment[]>{
    return this.http.get<IShipment[]>(this.url + `api/shipments/file/shipments?sessionId=${id}`)
  }
  getMacroPok(): Observable<IMacroPokModel[]>{
    return this.http.get<IMacroPokModel[]>(this.url + `api/macroPok/all`)
  }
  postMacroPok(macroPok: IMacroPokModel){
    return this.http.post(this.url + `api/macroPok`, macroPok)
  }
  putMacroPok(macroPok: IMacroPokModel){
    return this.http.put(this.url + `api/macroPok`, macroPok)
  }
  deleteMackPok(id: number){
    return this.http.delete(this.url + `api/macroPok/${id}`)
  }
  getClaimSession(): Observable<ISession[]>{
    return this.http.get<ISession[]>(this.url + `api/claim/file/all`)
  }
  getCorrespondenceSession(): Observable<ISession[]>{
    return this.http.get<ISession[]>(this.url + `api/correspondence/file/all`)
  }
}
