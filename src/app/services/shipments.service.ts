import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from 'rxjs';
import {ISession, IShipment} from '../models/shipmenst.model';

@Injectable({
  providedIn: 'root'
})
export class ShipmentsService {

  constructor(private http: HttpClient) {
  }

  private url = environment.hostURL;

  postUploadFile(fd, fileName: string) {
    return this.http.post<any>(this.url + `api/file/upload?localFileName=${fileName}`, fd, {
      reportProgress: true,
      observe: "events"
    });
  }

  getShipSession(): Observable<ISession[]> {
   // return this.http.get<ISession[]>(this.url + `api/session/`);
    return this.http.get<ISession[]>('assets/shipments.json');
  }

  deleteShipSession(id: number){
    return this.http.delete(this.url + `api/session/${id}`)
  }
  getShipments(id: number): Observable<IShipment[]>{
    return this.http.get<IShipment[]>(this.url + `api/file/shipments?sessionId=${id}`)
    //return this.http.get<IShipment[]>('')
  }
}
